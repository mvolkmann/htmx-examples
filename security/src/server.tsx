import {type Context, Hono, type Next} from 'hono';
import {serveStatic} from 'hono/bun';
import './reload-server.js';

const policies = [
  // Only resources from the current domain are allowed
  // unless overridden by a more specific directive.
  "default-src 'self'",

  // This allows sending HTTP requests to the JSONPlaceholder API.
  // It also allows reload-client.js to create a WebSocket.
  "connect-src 'self' https://jsonplaceholder.typicode.com ws:",

  // This allows getting Google fonts.
  // "link" tags for Google fonts have an href
  // that begins with https://fonts.googleapis.com.
  // The linked font file contains @font-face CSS rules
  // with a src URL beginning with https://fonts.gstatic.com.
  "font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com",

  // This allows getting images from Unsplash.
  "img-src 'self' https://images.unsplash.com",

  // This allows getting videos from googleapis.
  "media-src 'self' http://commondatastorage.googleapis.com",

  // This specifies where POST requests for violation reports will be sent.
  // In the future, "report-uri" will be replaced by "report-to".
  'report-uri /csp-report',

  // This allows downloading the htmx library from a CDN.
  "script-src-elem 'self' https://unpkg.com",

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
  const fn = serveStatic({root: './public'});
  return fn(c, next);
});

app.get('/dom-xss', (c: Context) => {
  return c.text("alert('A DOM XSS occurred!')");
});

app.get('/reflective-xss', (c: Context) => {
  return c.html("<script>alert('A reflective XSS occurred!');</script>");
});

app.get('/version', (c: Context) => {
  // Return a Response whose body contains
  // the version of Bun running on the server.
  return c.text('v' + Bun.version);
});

// This receives reports of CSP violations in a JSON object.
app.post('/csp-report', async (c: Context) => {
  const report = await c.req.json();
  console.log(report);
  c.status(403);
  return c.text('CSP violation');
});

export default app;
