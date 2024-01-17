import {Elysia} from 'elysia';
import {html} from '@elysiajs/html'; // enables use of JSX
import {staticPlugin} from '@elysiajs/static'; // enables static file serving
import {Html} from '@kitajs/html';

const app = new Elysia();
app.use(html());
// This causes link and script tags to look for files in the public directory.
app.use(staticPlugin({prefix: ''}));

const BaseHtml = ({children}: {children: Html.Children}) => (
  <html>
    <head>
      <title>Progress Bar</title>
      <link rel="stylesheet" href="/styles.css" />
      <script src="https://unpkg.com/htmx.org@1.9.9"></script>
      <script defer src="setup.js"></script>
    </head>
    <body>{children}</body>
  </html>
);

app.get('/', () => {
  return (
    <BaseHtml>
      <h1>Token in Header</h1>
      <div>
        <button hx-get="/request1" hx-target="#result1">
          Request #1
        </button>
        <button hx-post="/request2" hx-target="#result2">
          Request #2
        </button>
      </div>
      <div id="result1" />
      <div id="result2" />
    </BaseHtml>
  );
});

app.get('/request1', ({headers}) => {
  const token = headers['x-token'];
  return `/request1 received the token ${token}.`;
});

app.post('/request2', ({headers}) => {
  const token = headers['x-token'];
  return `/request2 received the token ${token}.`;
});

app.listen(1919);
console.log('listening on port', app.server?.port);
