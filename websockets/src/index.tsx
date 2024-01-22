import {Hono} from 'hono';
import {serveStatic} from 'hono/bun';

const app = new Hono();

// This serves static files from the public directory.
app.use('/*', serveStatic({root: './public'}));

const wsServer = Bun.serve({
  // The WebSocket port defaults to 3000 which conflicts with the HTTP server.
  port: 3001,
  fetch(req, server) {
    // Upgrade the request to support WebSockets.
    if (server.upgrade(req)) return; // no Response
    return new Response('WebSockets upgrade failed', {status: 500});
  },
  websocket: {
    open(ws) {
      console.log('WebSocket opened');
    },
    message(ws, json: string) {
      const data = JSON.parse(json);
      // "start" is a form input name.
      countdown(ws, parseInt(data.start));
    },
    close(ws, code) {
      // For code values, see
      // https://datatracker.ietf.org/doc/html/rfc6455#section-7.4.1
      // 1000 = Normal Closure
      // 1001 = Going Away (browser navigated away or server shut down)
      console.log('WebSocket closed with code', code);
    }
  }
});

async function countdown(ws, start: number) {
  let n = start;
  while (n >= 0) {
    const swap = n === start ? 'innerHTML' : 'beforeend';
    const html = (
      <div id="countdown" hx-swap-oob={swap}>
        <div>{n}</div>
      </div>
    );
    ws.send(html.toString());
    await Bun.sleep(1000);
    n--;
  }
}

console.log('WebSocket server is listening on port', wsServer.port);

export default app;
