import {type Context, Hono, type Next} from 'hono';
import {html} from 'hono/html';
import {serveStatic} from 'hono/bun';
import './reload-server.js';

const policies = [
  // This specifies where POST requests for violation reports will be sent.
  'report-uri /csp-report',

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
  'font-src https://fonts.googleapis.com https://fonts.gstatic.com',

  // This allows getting images from Unsplash.
  'img-src https://images.unsplash.com',

  // This allows getting videos from googleapis.
  'media-src http://commondatastorage.googleapis.com',

  // This allows downloading the htmx library from a CDN.
  "script-src-elem 'self' 'report-sample' https://unpkg.com",

  // This allows htmx.min.js to insert style elements.
  "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com"
];
const csp = policies.join('; ');
// console.log('server.tsx: csp =', csp);

const app = new Hono();

// Serve static files from the public directory.
app.use('/*', (c: Context, next: Next) => {
  c.header('Content-Security-Policy', csp);
  const yearSeconds = 31536000;
  c.header(
    'Strict-Transport-Security',
    `max-age=${yearSeconds}; includeSubDomains`
  );
  const fn = serveStatic({root: './public'});
  return fn(c, next);
});

app.get('/dom-xss', (c: Context) => {
  return c.text("alert('A DOM XSS occurred!')");
});

app.get('/reflective-xss', (c: Context) => {
  return c.html("<script>alert('A reflective XSS occurred!');</script>");
});

// Return a Response whose body contains
// the version of Bun running on the server.
app.get('/version', (c: Context) => {
  // The html tagged template literal escapes
  // HTML elements in strings, but not in JSX!
  const storedContent = '<script>alert("XSS!");</script>';
  const escaped = html`v${Bun.version} ${storedContent}`;
  return c.html(escaped);
});

// This receives reports of CSP violations in a JSON object.
app.post('/csp-report', async (c: Context) => {
  const json = await c.req.json();
  const report = json['csp-report'];
  // console.log(report);
  let file = report['document-uri'];
  if (file.endsWith('/')) file = 'index.html';
  console.error(
    `${file} attempted to access ${report['blocked-uri']} which ` +
      `violates the ${report['effective-directive']} CSP directive.`
  );
  c.status(403);
  return c.text('CSP violation');
});

export default app;
