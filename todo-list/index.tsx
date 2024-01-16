import {Database} from 'bun:sqlite';
import {Elysia, t} from 'elysia';
import {html} from '@elysiajs/html';
import {staticPlugin} from '@elysiajs/static';
import {Attributes} from 'typed-html';
import WebSocket from 'ws';

// Configure Elysia.
const app = new Elysia();
// This enables use of JSX.
app.use(html());
// This serves static files from the public directory.
app.use(staticPlugin({prefix: ''}));

// Prepare to use SQLite to store todos.
const db = new Database('todos.db', {create: true});
const deleteTodoPS = db.query('delete from todos where id = ?');
const getAllTodosQuery = db.query('select * from todos order by description;');
const getTodoQuery = db.query('select * from todos where id = ?');
const insertTodoQuery = db.query(
  'insert into todos (description, completed) values (?, 0) returning id'
);
const updateTodoPS = db.prepare('update todos set completed=? where id = ?');

type Todo = {
  id: number;
  description: string;
  completed: number; // 0 or 1 for SQLite compatibility
};

function addTodo(description: string) {
  try {
    const {id} = insertTodoQuery.get(description) as {id: number};
    return {id, description, completed: 0};
  } catch (e) {
    const isDuplicate = e.toString().includes('UNIQUE constraint failed');
    throw isDuplicate ? new Error('duplicate todo ' + description) : e;
  }
}

const Layout = ({children}: Attributes) => (
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>To Do List</title>
      <link rel="stylesheet" href="/styles.css" />
      <script src="https://unpkg.com/htmx.org@1.9.10"></script>
      <script src="setup.js"></script>
    </head>
    <body class="p-8">{children}</body>
  </html>
);

function TodoForm() {
  // We are using attribute spreading to add this attribute to the form
  // because VS Code does not recognize hx-on:htmx:after-request
  // as a valid attribute name.
  const reset = {'hx-on:htmx:after-request': 'this.reset()'};
  return (
    <form
      hx-post="/todos"
      hx-swap="afterend"
      hx-indicator=".htmx-indicator"
      hx-disabled-elt="#add-btn"
      {...reset}
    >
      <input
        class="border border-gray-500 p-1 rounded-lg"
        hx-on:input="document.getElementById('add-btn').disabled = this.value === ''"
        name="description"
        placeholder="enter new todo here"
        size="30"
      />
      <button disabled id="add-btn" type="submit">
        Add
      </button>
      <img alt="loading..." class="htmx-indicator" src="spinner.gif" />
    </form>
  );
}

type TodoItemProps = {todo: Todo};
function TodoItem({todo: {id, description, completed}}: TodoItemProps) {
  const isCompleted = completed === 1;
  return (
    <div class="todo-item">
      <input
        type="checkbox"
        checked={isCompleted}
        hx-patch={`/todos/${id}/toggle`}
        hx-target="closest div"
        hx-swap="outerHTML"
      />
      <div class={isCompleted ? 'completed' : ''}>{description}</div>
      <button
        class="plain"
        hx-confirm="Are you sure?"
        hx-delete={`/todos/${id}`}
        hx-swap="outerHTML"
        hx-target="closest div"
      >
        🗑
      </button>
    </div>
  );
}

type TodoListProps = {todos: Todo[]};
function TodoList({todos}: TodoListProps) {
  return (
    <div>
      {todos.map(todo => (
        <TodoItem todo={todo} />
      ))}
    </div>
  );
}

// This deletes a given todo.  It is the D in CRUD.
app.delete(
  '/todos/:id',
  ({params, set}) => {
    try {
      // TODO: How can you determine if this found a todo to delete and
      // TODO: return this if it didn't? new Response('Not found', {status: 404});
      // TODO: Why does this return undefined?
      const result = deleteTodoPS.get(params.id);
    } catch (e) {
      console.error('index.tsx delete: e =', e);
      throw e;
    }
    set.headers['hx-trigger'] = 'status-change';
    // By not returning any HTML for this todo item,
    // we replace the existing todo item with nothing.
  },
  {
    params: t.Object({
      id: t.Numeric()
    })
  }
);

app.get('/', ({set}) => {
  set.redirect = '/todos';
});

app.get('/todos/status', () => {
  const todos = getAllTodosQuery.all() as Todo[];
  const uncompletedCount = todos.filter(todo => !todo.completed).length;
  return `${uncompletedCount} of ${todos.length} remaining`;
});

// This renders the todo list UI.  It is the R in CRUD.
app.get('/todos', () => {
  const todos = getAllTodosQuery.all();

  return (
    <Layout>
      <h1>To Do List</h1>
      <p hx-get="/todos/status" hx-trigger="load, status-change from:body" />
      <TodoForm />
      <TodoList todos={todos} />
    </Layout>
  );
});

// This toggles the completed state of a given todo.  It is the U in CRUD.
app.patch(
  '/todos/:id/toggle',
  ({params, set}) => {
    const todo = getTodoQuery.get(params.id) as Todo;
    if (todo) {
      try {
        todo.completed = 1 - todo.completed;
        updateTodoPS.run(todo.completed, todo.id);
      } catch (e) {
        console.error('index.tsx toggle: e =', e);
        throw e;
      }

      set.headers['hx-trigger'] = 'status-change';
      return <TodoItem todo={todo} />;
    } else {
      return new Response('Not found', {status: 404});
    }
  },
  {
    params: t.Object({
      id: t.Numeric() // converts string param to a number
    })
  }
);

// This adds a new todo.  It is the C in CRUD.
app.post(
  '/todos',
  ({body, set}) => {
    const description = body.description.trim();
    if (description.length === 0) {
      throw new Error('Todo description cannot be empty');
    }
    const todo = addTodo(description);

    Bun.sleepSync(1000); // enables testing hx-indicator spinner

    set.headers['hx-trigger'] = 'status-change';

    // TODO: Should this return a new TodoList that is sorted?
    return <TodoItem todo={todo} />;
  },
  {
    body: t.Object({
      description: t.String()
    })
  }
);

// The browser code connects to this
// so it can detect when the server is restarted.
// On restart, the browser reloads the page.
new WebSocket.Server({port: 1920});

app.listen(1919);
console.log('listening on port', app.server?.port);
