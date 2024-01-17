import {Hono} from 'hono';
import type {Context} from 'hono';
import {serveStatic} from 'hono/bun';
import type {FC} from 'hono/jsx';
import sanitizeHtml from 'sanitize-html';

const app = new Hono();

// This serves static files from the public directory.
app.use('/*', serveStatic({root: './public'}));

const BaseHtml: FC = ({children}) => (
  <html>
    <head>
      <title>Sanitizing HTML</title>
      <link rel="stylesheet" href="/styles.css" />
      <script src="https://unpkg.com/htmx.org@1.9.9"></script>
    </head>
    <body>{children}</body>
  </html>
);

app.get('/', (c: Context) => {
  return c.html(
    <BaseHtml>
      <h1>Sanitizing HTML</h1>
      <form hx-post="/render" hx-target="#result">
        <input name="markup" type="text" />
        <div id="result" />
        <button>Submit</button>
      </form>
    </BaseHtml>
  );
});

app.post('/render', async (c: Context) => {
  const data = await c.req.formData();
  const markup = data.get('markup');
  console.log('index.tsx /render: markup =', markup);
  // const markup = '<p>before</p><script>alert("pwned")</script><p>after</p>';
  return c.html(sanitizeHtml(markup));
});

export default app;
