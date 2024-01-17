import {Hono} from 'hono';
import type {Context} from 'hono';
import {serveStatic} from 'hono/bun';
import type {FC} from 'hono/jsx';
import sanitizeHtml from 'sanitize-html';

const app = new Hono();

// This serves static files from the public directory.
app.use('/*', serveStatic({root: './public'}));

const BaseHtml: FC = ({children}) => (
  <html>
    <head>
      <title>Sanitizing HTML</title>
      {/* This CSP says:
          - By default, all content must come from this domain.
          - An exception is made for images which can come from any https URL.
          - The child-src directive defines the valid sources for
            web workers and nested browsing contexts
            loaded using elements such as <frame> and <iframe>.
            No sources are valid for these.
       */}
      {/* <meta
        http-equiv="Content-Security-Policy"
        content="default-src 'self'; img-src https://*; child-src 'none';"
      /> */}
      {/* <meta name="htmx-config" content='{"allowScriptTags": false}' /> */}
      {/* The request timeout can be specified on individual requests
          with the `hx-request` attribute. */}
      {/* <meta name="htmx-config" content='{"timeout": 2000}' /> */}
      <link rel="stylesheet" href="/styles.css" />
      {/* The CSP above blocks getting scripts from other domains,
          so this project includes a local copy of htmx.min.js. */}
      <script src="htmx.min.js"></script>
    </head>
    <body>{children}</body>
  </html>
);

app.get('/', (c: Context) => {
  return c.html(
    <BaseHtml>
      <h1>Sanitizing HTML</h1>
      {/* The timeout for all requests can be specified
          in a meta tag for htmx-config. */}
      <form hx-post="/render" hx-target="#result" hx-request='\"timeout\":2000'>
        <input name="markup" type="text" />
        <div
          id="result"
          hx-get="/timeout"
          hx-trigger="htmx:timeout from:form"
        />
        <button>Submit</button>
      </form>
    </BaseHtml>
  );
});

app.get('/timeout', (c: Context) => c.text('The request timed out.'));

app.post('/render', async (c: Context) => {
  Bun.sleepSync(5000); // simulates long-running query
  const data = await c.req.formData();
  const markup = data.get('markup');
  // const markup = '<p>before</p><script>alert("pwned")</script><p>after</p>';
  // console.log('index.tsx /render: markup =', markup);
  // return c.html(markup);
  return c.html(sanitizeHtml(markup));
});

export default app;
