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

let percentComplete = 0;

function ProgressBar() {
  // The HTML progress element cannot be animated.
  return (
    // TODO: How can this signal to the /progress endpoint
    // TODO: that it is being invoked due to a reset event
    // TODO: so it can reset percentComplete to zero ?
    <div
      class="progress-container"
      hx-get="/progress"
      hx-swap="outerHTML"
      hx-trigger={
        percentComplete < 100
          ? 'load delay:1s, reset from:#reset-btn'
          : 'reset from:#reset-btn'
      }
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

app.get('/', () => {
  return (
    <BaseHtml>
      <h1>Progress Bar</h1>
      <ProgressBar />
      {/*
      There are three ways to handle dispatching a reset event.
      1) dispatch a bubbling event on the button and listen on body
      2) dispatch a non-bubbling event on the body and listen on body
      3) dispatch a non-bubbling event on the button and listen on button
      */}
      <button
        id="reset-btn"
        hx-on:click="this.dispatchEvent(new Event('reset'))"
      >
        Reset
      </button>
    </BaseHtml>
  );
});

app.get('/progress', ({headers}) => {
  if (percentComplete === 100) percentComplete = 0;
  const delta = Math.random() * 30;
  percentComplete = Math.min(100, percentComplete + delta);
  return <ProgressBar />;
});

app.listen(1919);
console.log('listening on port', app.server?.port);
