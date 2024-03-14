import {type Context, Hono} from 'hono';
import {serveStatic} from 'hono/bun';
import './reload-server.js';

const app = new Hono();

// Serve static files from the public directory.
app.use('/*', serveStatic({root: './public'}));

app.get('/danger', (c: Context) => {
  /*
  When Hono converts JSX to a string, it is escaped.
  That causes a syntax error when the browser tries to
  execute the script below because the quotes are replaced.
  We can bypass the escaping by creating the HTML as a string.
  */
  const html = `
    <div>First</div>
    <script>alert('possible hack')</script>
    <div>Second</div>
  `;
  return c.html(html);
});

export default app;
