import {type Context, Hono} from 'hono';
import {serveStatic} from 'hono/bun';
import {watch} from 'fs';
import WebSocket from 'ws';

// Browser code will connect to this so it
// can detect when the server is restarted.
// On restart, the browser will reload the page.
let wss = new WebSocket.Server({port: 3001}); // choose any unused port

// If any files in or below the public directory change,
// send the client a message to tell it to reload.
watch('./public', {recursive: true}, (event, filename) => {
  console.log(`detected ${event} in ${filename}`);
  for (const client of wss.clients) {
    client.send('reload');
  }
});

const app = new Hono();

// Serve static files from the public directory.
app.use('/*', serveStatic({root: './public'}));

let darkMode = false;

app.get('/switch', async (c: Context) => {
  // This could conditionally determine which Shoelace component to return
  // and its attributes.
  // Here we are adding htmx attributes.
  return c.html(
    <sl-switch
      size="large"
      hx-trigger="sl-change"
      hx-post="/busy"
      hx-vals="js:{busy: event.target.checked}"
      hx-target="#busy"
    >
      Busy
    </sl-switch>
  );
});

app.post('/busy', async (c: Context) => {
  const formData = await c.req.formData();
  const busy = formData.get('busy') === 'true';
  return c.text(busy ? 'busy' : 'free');
});

app.get('/version', async (c: Context) => {
  // Return a Response whose body contains
  // the version of Bun running on the server.
  return c.text('v' + Bun.version);
  /*
  return c.html(
    <img
      alt="htmx logo"
      src="https://mvolkmann.github.io/blog/assets/htmx-logo.png"
    />
  );
  */
});

export default app;
