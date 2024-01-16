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
    attributes['hx-trigger'] = 'load delay:2s';
    attributes['hx-swap'] = 'outerHTML';
  }

  // The HTML progress element cannot be animated.
  return (
    <div
      class="progress-container"
      {...attributes}
      role="progressbar"
      aria-valuenow={percentComplete}
    >
      <div class="progress-text">{percentComplete.toFixed(1)}%</div>
      {/* This div MUST have an id in order for the transition to work! */}
      <div
        class="progress-bar"
        id="progress-bar"
        style={`width: ${percentComplete}%`}
      />
    </div>
  );
}

// globalThis.reset = element => {
//   console.log('reset: element =', element);
//   percentComplete = 0;
//   element.dispatchEvent(new Event('reset'));
// };

app.get('/', () => {
  return (
    <BaseHtml>
      <h1>Progress Bar</h1>
      <ProgressBar />
      {/* <button hx-on:click="globalThis.reset(this)">Reset</button> */}
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
