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
      console.log('index.tsx message: data =', data);
      let number = parseInt(data.start);
      console.log('index.tsx message: number =', number);
      while (number > 0) {
        const html = `<div id="countdown" hx-swap-oob="beforeend">${number}</div>`;
        ws.send(html);
        number--;
      }
    },
    // error(ws, error) {
    //   console.error('WebSocket error:', error);
    // },
    close(ws, code, json) {
      console.log('WebSocket closed with code', code);
      if (json) console.log(`WebSocket closed with json "${json}"`);
    }
  }
});

console.log('WebSocket server is listening on port', wsServer.port);

export default app;
