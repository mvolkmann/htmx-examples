import {Context, Hono} from 'hono';
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
      <div hx-ext="sse" sse-connect="/sse" sse-swap="time" />
      <div hx-ext="sse" sse-connect="/sse" sse-swap="color" />
    </BaseHtml>
  );
});

// See https://htmx.org/extensions/server-sent-events/.

const colors = ['red', 'green', 'blue', 'yellow', 'blue', 'purple'];
let index = 0;

app.get('/sse', (c: Context) => {
  return streamSSE(c, async stream => {
    while (true) {
      await stream.writeSSE({
        data: new Date().toLocaleTimeString(),
        event: 'time'
      });
      await stream.writeSSE({
        data: colors[index],
        event: 'color'
      });
      // TODO: Why does the index change twice per iteration?
      index = (index + 1) % colors.length;
      console.log('index.tsx : index =', index);

      await stream.sleep(1000);
    }
  });
});

export default app;
