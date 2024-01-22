import {Hono} from 'hono';
import {serveStatic} from 'hono/bun';

const app = new Hono();

// This serves static files from the public directory.
app.use('/*', serveStatic({root: './public'}));

let start = 0;

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
      console.log('got WebSocket open');
    },
    message(ws, json: string) {
      const data = JSON.parse(json);
      // console.log('index.tsx message: data =', data);
      // "start" is a form input name.
      let number = parseInt(data.start);
      while (number >= 0) {
        const html = (
          <div id="countdown" hx-swap-oob="beforeend">
            <div>{number}</div>
          </div>
        );
        ws.send(html.toString());
        number--;
      }
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

console.log('WebSocket server is listening on port', wsServer.port);

export default app;
