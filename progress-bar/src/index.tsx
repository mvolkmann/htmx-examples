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
  if (percentComplete < 100) {
    attributes['hx-get'] = '/progress';
    attributes['hx-trigger'] = 'load delay:1s, reset';
    attributes['hx-swap'] = 'outerHTML';
  }

  // This works, but value changes cannot be animated.
  /*
  return (
    <progress
      id="percent-complete"
      max="100"
      value={percentComplete}
      {...attributes}
    />
  );
  */
  return (
    <div
      class="progress-container"
      {...attributes}
      role="progressbar"
      aria-valuenow={percentComplete}
    >
      <div class="progress-text">{percentComplete.toFixed(1)}%</div>
      <div class="progress-bar" style={`width: ${percentComplete}%`} />
    </div>
  );
}

app.get('/', () => {
  return (
    <BaseHtml>
      <h1>Progress Bar</h1>
      <ProgressBar />
      <button hx-on="percentComplete = 0; this.dispatchEvent('reset')">
        Reset
      </button>
    </BaseHtml>
  );
});

app.get('/progress', () => {
  const delta = Math.random() * 20;
  percentComplete = Math.min(100, percentComplete + delta);
  return <ProgressBar />;
});

app.listen(1919);
console.log('listening on port', app.server?.port);
