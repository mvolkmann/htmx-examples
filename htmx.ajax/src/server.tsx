import {heapStats} from 'bun:jsc';
import {type Context, Hono} from 'hono';
import {serveStatic} from 'hono/bun';
import './reload-server';

const app = new Hono();

// Serve static files from the public directory.
app.use('/*', serveStatic({root: './public'}));

app.get('/heap-size', (c: Context) => {
  const stats = heapStats();
  return c.text((stats.heapSize / 1024 / 1024).toFixed(4));
});

export default app;
