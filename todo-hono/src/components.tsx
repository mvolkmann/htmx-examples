import type {FC} from 'hono/jsx';
export type Todo = {
  id: number;
  description: string;
  completed: number; // 0 or 1 for SQLite compatibility
};

type ErrProps = {message?: string};
export const Err: FC<ErrProps> = ({message = ''}) => (
  <p id="error" hx-swap-oob="true">
    {message}
  </p>
);

export const Layout: FC = ({children}) => (
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>To Do List</title>
      <link rel="stylesheet" href="/styles.css" />
      <script src="htmx.min.js"></script>
      <script defer src="alpine.min.js"></script>
      <script defer src="setup.js"></script>
    </head>
    {/* editingId is state that only belongs on the client.
        If the user clicks outside of any todo description,
        deselect the currently selected todo. */}
    <body x-data="{editingId: 0}" x-on:click="editingId = 0">
      {children}
    </body>
  </html>
);

export const TodoForm: FC = () => {
  // Attribute spreading is used here because VS Code
  // does not like attributes containing colons.
  const reset = {'hx-on:htmx:after-request': 'this.reset()'};

  return (
    <form
      hx-disabled-elt="#add-btn"
      hx-indicator=".htmx-indicator"
      hx-post="/todos"
      hx-swap="afterbegin"
      hx-target="#todo-list"
      x-data="{text: ''}"
      {...reset}
    >
      <input
        name="description"
        placeholder="enter new todo here"
        size={30}
        type="text"
        x-model="text"
      />
      <button
        id="add-btn"
        type="submit"
        x-bind:disabled="text.trim().length == 0"
      >
        Add
      </button>
      <img alt="loading..." class="htmx-indicator" src="spinner.gif" />
    </form>
  );
};

type TodoItemProps = {todo: Todo};
export const TodoItem: FC<TodoItemProps> = ({
  todo: {completed, description, id}
}: TodoItemProps) => {
  // Attribute spreading is used here because VS Code
  // does not like attributes containing colons.
  const handleInputClick = {'x-on:click.stop': ''};
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
        hx-trigger="blur, keyup[keyCode == 13]"
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
        hx-swap="outerHTML swap:1s"
        hx-target="closest div"
      >
        🗑
      </button>
    </div>
  );
};

type TodoListProps = {todos: Todo[]};
export const TodoList: FC<TodoListProps> = ({todos}) => (
  <div id="todo-list" x-on:description-change="editingId = 0">
    {todos.map(todo => (
      <TodoItem todo={todo} />
    ))}
  </div>
);
