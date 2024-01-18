# todo-hono

This is a todo app implemented with htmx, Bun, and Hono.

To run this:

- Enter `bun install`
- Enter `bun run dev`
- Browse localhost:1919

## Database Setup

- Create the database with `sqlite3 todos.db`
- Create a table with `create table todos(id integer primary key autoincrement, description string, completed numeric, unique (description collate nocase));`
- Verify that the table was created with `.schema`
- Insert two rows with `insert into todos values('t1', 'cut grass', 0);`
  and `insert into todos values('t2', 'buy milk', 1);`
- Verify that the rows were inserted with `select * from todos;`
- Exit with `.exit`
