import {type Context, Hono} from 'hono';
import {serveStatic} from 'hono/bun';
import './reload-server.js';

const app = new Hono();

// Serve static files from the public directory.
app.use('/*', serveStatic({root: './public'}));

app.get('/demo', async (c: Context) => {
  // When returning multiple elements, JSX requires wrapping them
  // in a "fragment" which has the syntax <>...</>.
  return c.html(
    <>
      <div>new 1</div>

      {/* <div id="target2" hx-swap-oob="true">new 2</div> */}

      <div id="target2" hx-swap-oob="outerHTML">
        new 2
      </div>

      <div id="target2" hx-swap-oob="afterend">
        <div>after 2</div>
      </div>

      <div hx-swap-oob="innerHTML:#target3">new 3</div>
    </>
  );
});

export default app;
