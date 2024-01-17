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
  // The HTML progress element cannot be animated.
  return (
    // hx-trigger={
    //   percentComplete < 100
    //     ? 'load delay:1s, reset from:#reset-btn'
    //     : 'reset from:#reset-btn'
    // }
    <div
      id="progress-container"
      hx-get="/progress"
      hx-swap="outerHTML"
      hx-trigger={percentComplete < 100 ? 'load delay:1s' : ''}
      role="progressbar"
      aria-valuenow={percentComplete}
    >
      <div id="progress-text">{percentComplete.toFixed(1)}%</div>
      {/* This div MUST have an id in order for the transition to work! */}
      <div id="progress-bar" style={`width: ${percentComplete}%`} />
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
      {/* hx-on:click="this.dispatchEvent(new Event('reset'))" */}
      <button
        id="reset-btn"
        hx-get="/progress"
        hx-swap="outerHTML"
        hx-target="#progress-container"
      >
        Reset
      </button>
    </BaseHtml>
  );
});

app.get('/progress', ({headers}) => {
  if (headers['hx-trigger'] === 'reset-btn') {
    percentComplete = 0;
  } else {
    const delta = Math.random() * 30;
    percentComplete = Math.min(100, percentComplete + delta);
  }
  return <ProgressBar />;
});

app.listen(1919);
console.log('listening on port', app.server?.port);
