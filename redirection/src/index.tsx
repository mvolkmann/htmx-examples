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
      <link rel="stylesheet" href="styles.css" />
      <script src="https://unpkg.com/htmx.org@1.9.9"></script>
    </head>
    <body>{children}</body>
  </html>
);

app.get('/', () => {
  return (
    <BaseHtml>
      <h1>Redirection</h1>
      <form hx-post="/process" hx-target="#result">
        <input name="value" type="number" />
        <button>Submit</button>
      </form>
      <div id="result" />
    </BaseHtml>
  );
});

app.post('/process', ({body, set}) => {
  const {value} = body;
  const doubled = value * 2;
  if (doubled > 10) set.headers['hx-location'] = '/page2';
  return doubled;
});

app.listen(1919);
console.log('listening on port', app.server?.port);
