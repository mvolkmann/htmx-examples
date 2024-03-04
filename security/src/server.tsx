import {type Context, Hono, type Next} from 'hono';
import {serveStatic} from 'hono/bun';
import './reload-server.js';

const policies = [
  // Only resources from this domain are allowed
  // unless overridden by a more specific directive.
  "default-src 'self'",

  // This allows reload-client.js to create a WebSocket.
  "connect-src 'self' ws:",

  // This allows getting Google fonts.
  // "link" tags for Google fonts have an href
  // that begins with https://fonts.googleapis.com.
  // The linked font file contains @font-face CSS rules
  // with a src URL beginning with https://fonts.gstatic.com.
  "font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com",

  // This allows htmx.min.js to insert style elements.
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com"
];
const csp = policies.join('; ');
console.log('server.tsx: csp =', csp);

const app = new Hono();

// Serve static files from the public directory.
// app.use('/*', serveStatic({root: './public'}));
app.use('/*', (c: Context, next: Next) => {
  c.header('Content-Security-Policy', csp);
  c.header(
    'Content-Security-Policy-Report-Only',
    csp + '; report-uri /csp-report'
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

const auth = {
  'foo@bar.com': 'password'
};

app.post('/login', async (c: Context) => {
  const formData = await c.req.formData();
  const email = formData.get('email');
  const password = formData.get('password');
  console.log('server.tsx /login: email =', email);
  console.log('server.tsx /login: password =', password);
  const success = auth[email] === password;
  if (!success) c.status(401);
  return c.text(success ? 'Authorized' : 'Unauthorized');
});

export default app;
