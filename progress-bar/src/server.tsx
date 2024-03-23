import {type Context, Hono} from 'hono';
import {serveStatic} from 'hono/bun';
import './reload-server.ts';

let percentComplete = 0;

function ProgressBar() {
  // The HTML progress element cannot be animated so we use a div.
  return (
    <div
      id="progress-container"
      hx-get="/progress"
      hx-trigger={percentComplete < 100 ? 'load delay:1s' : ''}
      hx-swap="outerHTML"
      role="progressbar"
      aria-valuenow={percentComplete}
    >
      <div id="progress-text">{percentComplete.toFixed(1)}%</div>
      {/* This div MUST have an id in order for the CSS transition to work! */}
      <div id="progress-bar" style={`width: ${percentComplete}%`} />
    </div>
  );
}

const app = new Hono();

// This serves static files from the public directory.
app.use('/*', serveStatic({root: './public'}));

app.get('/progress-bar', (c: Context) => c.html(<ProgressBar />));

app.get('/progress', (c: Context) => {
  // Determine what DOM element triggered this request.
  const trigger = c.req.header('hx-trigger');
  // If it was the reset button, reset the progress to zero.
  if (trigger === 'reset-btn') {
    percentComplete = 0;
  } else {
    // Increase the progress by a random amount.
    const delta = Math.random() * 30;
    percentComplete = Math.min(100, percentComplete + delta);
  }
  // Replace the current progress bar with a new one
  // that has a different percentComplete value.
  return c.html(<ProgressBar />);
});

export default app;
