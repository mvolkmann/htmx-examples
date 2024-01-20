import {Hono} from 'hono';
import type {Context} from 'hono';
import {serveStatic} from 'hono/bun';
import type {FC} from 'hono/jsx';
import {streamSSE} from 'hono/streaming';

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
      <div hx-ext="sse" sse-connect="/sse" sse-swap="current-time">
        The time will go here.
      </div>
    </BaseHtml>
  );
});

// See https://htmx.org/extensions/server-sent-events/.
let id = 0;
app.get('/sse', (c: Context) => {
  return streamSSE(c, async stream => {
    while (true) {
      await stream.writeSSE({
        data: `time: ${new Date().toISOString()}`,
        event: 'current-time',
        id: String(id++)
      });
      await stream.sleep(1000);
    }
  });
});

export default app;
