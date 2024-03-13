import {type Context, Hono} from 'hono';
import {serveStatic} from 'hono/bun';
import './reload-server.js';

const app = new Hono();

// Serve static files from the public directory.
app.use('/*', serveStatic({root: './public'}));

app.get('/demo', (c: Context) => {
  return c.html(
    <>
      <div>First</div>
      <script>alert('possible hack')</script>
      <div>Second</div>
    </>
  );
});

export default app;
