import {Context, Hono} from 'hono';
import {serveStatic} from 'hono/bun';
import type {FC} from 'hono/jsx';

const app = new Hono();

// Serve static files from the public directory.
app.use('/*', serveStatic({root: './public'}));

const names: string[] = [
  'Amanda',
  'Gerri',
  'Jeremy',
  'Mark',
  'Meghan',
  'Pat',
  'RC',
  'Richard',
  'Tami'
];

const Layout: FC = ({children}) => (
  <html>
    <head>
      <title>HTMX Active Search</title>
      <link href="/tailwind.css" rel="stylesheet" />
      <script src="https://unpkg.com/htmx.org@1.9.9"></script>
    </head>
    <body class="p-8">{children}</body>
  </html>
);

app.get('/', (c: Context) => {
  return c.html(
    <Layout>
      <main>
        <label class="font-bold mr-4" for="name">
          Name
        </label>
        <input
          autofocus
          class="border border-gray-500 p-1 rounded-lg"
          hx-trigger="keyup changed delay:200ms"
          hx-post="/search"
          hx-target="#matches"
          hx-swap="innerHTML"
          name="name"
          size={10}
        />
        <ul id="matches" />
      </main>
    </Layout>
  );
});

app.post('/search', async (c: Context) => {
  const data = await c.req.formData();
  const name = (data.get('name') as string) || '';
  if (name == '') return c.html('');

  const lowerName = name.toLowerCase();
  const matches = names.filter(n => n.toLowerCase().includes(lowerName));
  return c.html(
    <>
      {matches.map(name => (
        <li>{name}</li>
      ))}
    </>
  );
});

export default app;
