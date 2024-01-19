import {Database, Statement} from 'bun:sqlite';
import {Context, Hono} from 'hono';
import {serveStatic} from 'hono/bun';
import WebSocket from 'ws';
import {z} from 'zod';
import {zValidator} from '@hono/zod-validator';
import {Err, Layout, Todo, TodoForm, TodoItem, TodoList} from './components';

//-----------------------------------------------------------------------------
// Browser reload support
//-----------------------------------------------------------------------------

// Browser code connects to this so it can detect when the server is restarted.
// On restart, the browser reloads the page.
new WebSocket.Server({port: 3001});

//-----------------------------------------------------------------------------
// SQLite preparation
//-----------------------------------------------------------------------------

const db = new Database('todos.db', {create: true});
const deleteTodoQuery = db.query('delete from todos where id = ?');
const getAllTodosQuery = db.query('select * from todos order by description;');
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
    const isDuplicate = message.includes('UNIQUE constraint failed');
    if (isDuplicate) message = `duplicate todo "${description}"`;
    return c.html(<Err message={message} />);
  }
}

function updateTodo(
  c: Context,
  statement: Statement,
  todo: Todo,
  property: string
) {
  try {
    // @ts-ignore
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

// Render the todo list UI ... the R in CRUD.
app.get('/todos', (c: Context) => {
  const todos = getAllTodosQuery.all() as Todo[];

  return c.html(
    <Layout>
      <h1>To Do List</h1>
      <p hx-get="/todos/status" hx-trigger="load, status-change from:body" />
      <Err />
      <TodoForm />
      <TodoList todos={todos} />
    </Layout>
  );
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
