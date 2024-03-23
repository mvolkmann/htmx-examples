import {type Context, Hono} from 'hono';
import {serveStatic} from 'hono/bun';
import './reload-server.ts';

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

const app = new Hono();

// This serves static files from the public directory.
app.use('/*', serveStatic({root: './public'}));

// There are three ways to handle dispatching a reset event.
// 1) dispatch a bubbling event on the button and listen on body
// 2) dispatch a non-bubbling event on the body and listen on body
// 3) dispatch a non-bubbling event on the button and listen on button
app.get('/progress-bar', (c: Context) => c.html(<ProgressBar />));

app.get('/progress', (c: Context) => {
  const trigger = c.req.header('hx-trigger');
  if (trigger === 'reset-btn') {
    percentComplete = 0;
  } else {
    const delta = Math.random() * 30;
    percentComplete = Math.min(100, percentComplete + delta);
  }
  return c.html(<ProgressBar />);
});

export default app;
