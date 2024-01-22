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
    </head>
    <body>{children}</body>
  </html>
);

app.get('/', (c: Context) => {
  return c.html(
    <BaseHtml>
      <h1>Server-Sent Events</h1>

      {/* This listens for SSE "count" events and
          replaces the contents of a target element with their data.
          If hx-target is omitted, the results will
          replace the contents of the current element. */}
      <div
        hx-ext="sse"
        hx-target="#count"
        sse-connect="/sse"
        sse-swap="count"
      />
      <div>
        count = <span id="count" />
      </div>

      {/* This listens for SSE "count" events and
          sends an HTTP request to get other data when they occur. */}
      <div hx-ext="sse" sse-connect="/sse">
        <div hx-get="/count" hx-trigger="sse:count" />
      </div>
    </BaseHtml>
  );
});

// See https://htmx.org/extensions/server-sent-events/.

/*
const colors = ['red', 'green', 'blue', 'yellow', 'blue', 'purple'];
let index = 0;

app.get('/sse', (c: Context) => {
  return streamSSE(c, async stream => {
    // TODO: Why does this loop run two times for every call to sleep?
    while (true) {
      // await stream.writeSSE({
      //   event: 'time',
      //   data: new Date().toLocaleTimeString()
      // });
      console.log('\nsending a color');
      await stream.writeSSE({
        event: 'color',
        data: colors[index]
      });

      console.log('sleeping');
      await stream.sleep(3000);
      console.log('awake');

      console.log('bumping index');
      // TODO: Why does the index change twice per iteration?
      index = (index + 1) % colors.length;
      console.log('index.tsx : index =', index);
    }
  });
});
*/

let count = 0;

app.get('/count', (c: Context) => {
  return c.text(String(count));
});

// This streams count values using server-sent events.
app.get('/sse', (c: Context) => {
  count = 0;
  return streamSSE(c, async stream => {
    await stream.writeSSE({data: 'starting'});

    while (count < 10) {
      count++;
      await stream.writeSSE({
        event: 'count',
        id: String(crypto.randomUUID()),
        data: String(count)
      });
      await stream.sleep(1000);
    }
    stream.close();
  });
});

export default app;
