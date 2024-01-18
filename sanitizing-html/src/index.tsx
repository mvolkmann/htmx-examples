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
      <script defer src="setup.js"></script>
    </head>
    <body>{children}</body>
  </html>
);

app.get('/', (c: Context) => {
  // We are using attribute spreading to add this attribute to the form
  // because VS Code does not recognize hx-on:htmx:after-request
  // as a valid attribute name.
  const reset = {'hx-on:htmx:after-request': 'this.reset()'};

  return c.html(
    <BaseHtml>
      <h1>Sanitizing HTML</h1>

      {/* The timeout for all requests can be specified
          in a meta tag for htmx-config. */}
      <form
        hx-post="/render"
        hx-target="#result"
        hx-request='"timeout":2000'
        {...reset}
      >
        <textarea name="markup" rows={3} cols={40} />
        <br />
        <button>Submit</button>
      </form>
      <div id="result" />
    </BaseHtml>
  );
});

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
