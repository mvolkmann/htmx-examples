import {Database, Statement} from 'bun:sqlite';
import {Context, Hono} from 'hono';
import {serveStatic} from 'hono/bun';
import type {FC} from 'hono/jsx';
import {z} from 'zod';
import {zValidator} from '@hono/zod-validator';
import './reload-server';

//-----------------------------------------------------------------------------
// SQLite preparation
//-----------------------------------------------------------------------------

const db = new Database('todos.db', {create: true});
const deleteTodoQuery = db.query('delete from todos where id = ?');
const getAllTodosQuery = db.query('select * from todos order by description');
const getTodoQuery = db.query('select * from todos where id = ?');
const insertTodoQuery = db.query(
  'insert into todos (description, completed) values (?, 0) returning id'
);
const updateTodoDescriptionPS = db.prepare(
  'update todos set description=? where id = ?'
);
const updateTodoStatusPS = db.prepare(
  'update todos set completed=? where id = ?'
);

//-----------------------------------------------------------------------------
// Utility functions
//-----------------------------------------------------------------------------

function addTodo(c: Context, description: string) {
  Bun.sleepSync(500); // enables testing hx-indicator spinner

  try {
    const {id} = insertTodoQuery.get(description) as {id: number};
    const todo = {id, description, completed: 0};
    c.header('HX-Trigger', 'status-change');
    return c.html(
      <>
        <TodoItem todo={todo} />
        {/* Clear previous error message. */}
        <Err />
      </>
    );
  } catch (e) {
    let message = e instanceof Error ? e.message : String(e);
    const isDuplicate =
      message.includes('UNIQUE constraint failed') ||
      message === 'out of memory';
    if (isDuplicate) message = `duplicate todo "${description}"`;
    return c.html(<Err message={message} />);
  }
}

function updateTodo(
  c: Context,
  statement: Statement,
  todo: Todo,
  property: 'description' | 'completed'
) {
  try {
    const value = todo[property];
    statement.run(value, todo.id);
    return c.html(
      <>
        <TodoItem todo={todo} />
        {/* Clear previous error message. */}
        <Err />
      </>
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return c.html(<Err message={message} />);
  }
}

//-----------------------------------------------------------------------------
// Zod schema validation
//-----------------------------------------------------------------------------

const idSchema = z.object({
  id: z.coerce.number().positive()
});
const idValidator = zValidator('param', idSchema);

const todoSchema = z
  .object({
    description: z.string().min(1)
  })
  .strict(); // no extra properties allowed
const todoValidator = zValidator('form', todoSchema);

//-----------------------------------------------------------------------------
// Component definitions
//-----------------------------------------------------------------------------

type ErrProps = {message?: string};
export const Err: FC<ErrProps> = ({message = ''}) => (
  <p id="error" hx-swap-oob="true">
    {message}
  </p>
);

export type Todo = {
  id: number;
  description: string;
  completed: number; // 0 or 1 for SQLite compatibility
};

type TodoItemProps = {todo: Todo};
const TodoItem: FC<TodoItemProps> = ({
  todo: {completed, description, id}
}: TodoItemProps) => {
  // Attribute spreading is used here because VS Code
  // does not like attributes containing colons.
  // This is used to stop the click event from bubbling up to the div
  // that sets editingId to 0 when clicking outside the active input..
  const handleInputClick = {'x-on:click.stop': ''};
  // This is used to being editing the clicked todo description.
  const handleTextClick = {'x-on:click.stop': 'editingId = id'};

  return (
    <div class="todo-item" x-data={`{id: ${id}}`}>
      <input
        type="checkbox"
        checked={completed === 1}
        hx-patch={`/todos/${id}/toggle-complete`}
        hx-swap="outerHTML"
        hx-target="closest div"
      />
      <div class="description" x-show="id !== editingId" {...handleTextClick}>
        {description}
      </div>
      <input
        hx-include="this"
        hx-patch={`/todos/${id}/description`}
        hx-swap="outerHTML"
        hx-target="closest div"
        hx-trigger="blur, keyup[keyCode === 13]"
        name="description"
        type="text"
        value={description}
        x-show="id === editingId"
        {...handleInputClick}
      />
      {/* The swap modifier is set to 1 second
          to give a CSS transition time to complete.
          See ".todo-item.htmx-swapping" in styles.css. */}
      <button
        class="plain"
        hx-confirm={`Really delete "${description}"?`}
        hx-delete={`/todos/${id}`}
        hx-swap="delete swap:1s"
        hx-target="closest div"
      >
        🗑
      </button>
    </div>
  );
};

//-----------------------------------------------------------------------------
// Endpoint definitions
//-----------------------------------------------------------------------------

const app = new Hono();

// Serve static files from the public directory.
app.use('/*', serveStatic({root: './public'}));

// Delete a given todo ... the D in CRUD.
app.delete('/todos/:id', idValidator, (c: Context) => {
  const id = c.req.param('id');
  deleteTodoQuery.get(id);
  c.header('HX-Trigger', 'status-change');

  // This can be used to demonstrate fading new content into view.
  // return <div class="todo-item warning">A todo was deleted.</div>;

  // By not returning any HTML for this todo item,
  // we replace the existing todo item with nothing.
  return c.text('');
});

// Redirect root URL to todo list.
app.get('/', (c: Context) => c.redirect('/todos'));

// This is used by the endpoints that return JSON and HTML.
function getAllTodos(): Todo[] {
  return getAllTodosQuery.all() as Todo[];
}

// Render the todo list UI ... the R in CRUD.
// It can also return the todos as JSON.
app.get('/todos', (c: Context) => {
  const todos = getAllTodos();

  const accept = c.req.header('accept');
  if (accept?.includes('application/json')) {
    return c.json(todos);
  }

  return c.html(
    <div id="todo-list" x-on:description-change="editingId = 0">
      {todos.map(todo => (
        <TodoItem todo={todo} />
      ))}
    </div>
  );
});

// This endpoint returns all the todos as JSON.
app.get('/todos/json', (c: Context) => {
  const todos = getAllTodos();
  return c.json(todos);
});

// Get the status text that is displayed at the top of the page.
app.get('/todos/status', (c: Context) => {
  const todos = getAllTodosQuery.all() as Todo[];
  const uncompletedCount = todos.filter(todo => !todo.completed).length;
  return c.text(`${uncompletedCount} of ${todos.length} remaining`);
});

// Update the description of a given todo ... the U in CRUD.
app.patch('/todos/:id/description', idValidator, async (c: Context) => {
  const id = c.req.param('id');
  const todo = getTodoQuery.get(id) as Todo;
  if (!todo) return c.notFound();

  const formData = await c.req.formData();
  const description = formData?.get('description') as string | null;
  if (!description || description.length === 0) {
    return c.html(
      <>
        <TodoItem todo={todo} />
        <Err message="Todo description cannot be empty." />
      </>
    );
  }

  todo.description = description;
  c.header('HX-Trigger', 'description-change');
  return updateTodo(c, updateTodoDescriptionPS, todo, 'description');
});

// Toggle the completed state of a given todo ... the U in CRUD.
app.patch('/todos/:id/toggle-complete', idValidator, (c: Context) => {
  const id = c.req.param('id');
  const todo = getTodoQuery.get(id) as Todo;
  if (!todo) return c.notFound();

  todo.completed = 1 - todo.completed;
  c.header('HX-Trigger', 'status-change');
  return updateTodo(c, updateTodoStatusPS, todo, 'completed');
});

// Add a new todo ... the C in CRUD.
app.post('/todos', todoValidator, async (c: Context) => {
  const formData = await c.req.formData();
  const description = formData?.get('description') as string | null;
  if (!description || description.length === 0) {
    throw new Error('Todo description cannot be empty');
  }
  return addTodo(c, description);
});

export default app;
