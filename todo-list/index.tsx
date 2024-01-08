import {Database} from 'bun:sqlite';
import {Elysia, t} from 'elysia';
import {html} from '@elysiajs/html';
import {staticPlugin} from '@elysiajs/static';
import {Attributes} from 'typed-html';
import WebSocket from 'ws';

const app = new Elysia();
app.use(html());
app.use(staticPlugin());

const db = new Database('todos.db', {create: true});
const deleteTodoPS = db.query('delete from todos where id = ?');
const getAllTodosQuery = db.query('select * from todos;');
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
    console.error('index.tsx post: e =', e);
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
      {/* TODO: Can the staticPlugin default to looking in /public? */}
      <link rel="stylesheet" href="/public/tailwind.css" />
      <script src="https://unpkg.com/htmx.org@1.9.10"></script>
      <script src="public/hyperscript.min.js"></script>
      <script defer src="public/setup.js"></script>
    </head>
    <body class="p-8" hx-sse="connect:/update">
      {children}
    </body>
  </html>
);

function TodoForm() {
  return (
    <form
      class="flex gap-4 items-center my-4"
      hx-post="/todos"
      hx-swap="afterend"
      hx-indicator="#spinner"
      hx-disabled-elt="#add-btn"
      _="on submit target.reset()" // uses _hyperscript
    >
      <input
        class="border border-gray-500 p-1 rounded-lg"
        name="description"
        placeholder="enter new todo here"
        size="30"
      />
      <button id="add-btn" type="submit">
        Add
      </button>
      <img
        alt="loading..."
        class="htmx-indicator h-6 w-6"
        id="spinner"
        src="/public/spinner.gif"
      />
    </form>
  );
}

type TodoItemProps = {todo: Todo};
function TodoItem({todo: {id, description, completed}}: TodoItemProps) {
  return (
    <div class="flex gap-4 items-center mb-4">
      <input
        type="checkbox"
        checked={completed === 1}
        hx-patch={`/todos/${id}/toggle`}
        hx-target="closest div" // can also use a CSS selector
        hx-swap="outerHTML"
      />
      <div class={completed ? 'text-gray-500 line-through' : ''}>
        {description}
      </div>
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

function TodoStatus() {
  const todos = getAllTodosQuery.all() as Todo[];
  const uncompletedCount = todos.filter(todo => !todo.completed).length;
  return (
    <p id="todo-status" hx-swap-oob="true">
      {uncompletedCount} of {todos.length} remaining
    </p>
  );
}

// This deletes a given todo.  It is the D in CRUD.
app.delete(
  '/todos/:id',
  ({params}) => {
    try {
      // TODO: How can you determine if this found a todo to delete and
      // TODO: return this if it didn't? new Response('Not found', {status: 404});
      // TODO: Why does this return undefined?
      const result = deleteTodoPS.get(params.id);
      console.log('index.tsx delete: result =', result);
    } catch (e) {
      console.error('index.tsx delete: e =', e);
      throw e;
    }
    // By not returning any HTML for this todo item,
    // we replace the existing todo item with nothing.
    return <TodoStatus />;
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

app.get('/test', () => {
  return (
    <html>
      <head>
        <title>Test</title>
        <script src="head.js"></script>
      </head>
      <body>
        <p id="id1">paragraph #1</p>
        <script src="body.js"></script>
        <p id="id2">paragraph #2</p>
      </body>
    </html>
  );
});

// This renders the todo list UI.  It is the R in CRUD.
app.get('/todos', () => {
  const todos = getAllTodosQuery.all();

  return (
    <Layout>
      <h1>To Do List</h1>
      <TodoStatus />
      <TodoForm />
      <TodoList todos={todos} />
      <button hx-get="/test" hx-select="#id1,#id2">
        Test
      </button>
    </Layout>
  );
});

// This toggles the completed state of a given todo.  It is the U in CRUD.
app.patch(
  '/todos/:id/toggle',
  ({params}) => {
    const todo = getTodoQuery.get(params.id) as Todo;
    if (todo) {
      try {
        todo.completed = 1 - todo.completed;
        updateTodoPS.run(todo.completed, todo.id);
      } catch (e) {
        console.error('index.tsx toggle: e =', e);
        throw e;
      }
      return (
        <>
          <TodoStatus />
          <TodoItem todo={todo} />
        </>
      );
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
  ({body}: any) => {
    const description = body.description.trim();
    if (description.length === 0) {
      throw new Error('Todo description cannot be empty');
    }
    const todo = addTodo(description);

    Bun.sleepSync(1000); // enables testing hx-indicator spinner

    // TODO: Should this return a new TodoList that is sorted?
    return (
      <>
        <TodoStatus />
        <TodoItem todo={todo} />
      </>
    );
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
