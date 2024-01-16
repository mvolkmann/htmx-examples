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
    </head>
    <body>{children}</body>
  </html>
);

let percentComplete = 0;

function ProgressBar() {
  const attributes: {[key: string]: string} = {};
  console.log('index.tsx : percentComplete =', percentComplete);
  if (percentComplete < 100) {
    attributes['hx-get'] = '/progress';
    attributes['hx-trigger'] = 'load';
    attributes['hx-swap'] = 'outerHTML';
  }
  return (
    <progress
      id="percent-complete"
      max="100"
      value={percentComplete}
      {...attributes}
    />
  );
}

app.get('/', () => {
  return (
    <BaseHtml>
      <h1>Progress Bar</h1>
      <ProgressBar />
    </BaseHtml>
  );
});

app.get('/progress', () => {
  Bun.sleepSync(1000); // enables testing hx-indicator spinner
  const delta = Math.random() * 10;
  percentComplete = Math.min(100, percentComplete + delta);
  return <ProgressBar />;
});

app.listen(1919);
console.log('listening on port', app.server?.port);
