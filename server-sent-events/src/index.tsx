import {Hono} from 'hono';
import type {Context} from 'hono';
import {serveStatic} from 'hono/bun';
import type {FC} from 'hono/jsx';

const app = new Hono();

// This serves static files from the public directory.
app.use('/*', serveStatic({root: './public'}));

const BaseHtml: FC = ({children}) => (
  <html>
    <head>
      <title>Server-Sent Events</title>
      <link rel="stylesheet" href="/styles.css" />
      <script src="https://unpkg.com/htmx.org@1.9.10"></script>
      <script src="https://unpkg.com/htmx.org/dist/ext/sse.js"></script>
      <script defer src="setup.js"></script>
    </head>
    <body>{children}</body>
  </html>
);

app.get('/', (c: Context) => {
  return c.html(
    <BaseHtml>
      <h1>Server-Sent Events</h1>
      <div hx-ext="sse" sse-connect="/scores" sse-swap="score">
        Contents of this box will be updated in real time with every SSE message
        received from the chatroom.
      </div>
    </BaseHtml>
  );
});

app.get('/scores', (c: Context) => {
  return c.text('test message');
});

export default app;
