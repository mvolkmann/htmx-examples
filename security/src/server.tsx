import {type Context, Hono, type Next} from 'hono';
import {serveStatic} from 'hono/bun';
import './reload-server.js';

const app = new Hono();

// Serve static files from the public directory.
// app.use('/*', serveStatic({root: './public'}));
app.use('/*', (c: Context, next: Next) => {
  const policies = [
    "default-src 'self'",
    // This allows reload-client.js to create a WebSocket.
    "connect-src 'self' ws:",
    // This allows htmx.min.js to insert style elements.
    "style-src 'self' 'unsafe-inline'"
  ];
  const policy = policies.join('; ');
  c.header('Content-Security-Policy', policy);
  c.header(
    'Content-Security-Policy-Report-Only',
    policy + '; report-uri /csp-report'
  );
  const fn = serveStatic({root: './public'});
  return fn(c, next);
});

app.get('/version', (c: Context) => {
  // Return a Response whose body contains
  // the version of Bun running on the server.
  return c.text('v' + Bun.version);
});

app.post('/csp-report', async (c: Context) => {
  const report = await c.req.json();
  console.log('server.tsx /csp-report: report =', report);
  c.status(403);
  return c.text('CSP violation');
});

export default app;
