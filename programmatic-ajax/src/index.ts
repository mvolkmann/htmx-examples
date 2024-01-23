import {Hono} from 'hono';
import type {Context} from 'hono';
import {serveStatic} from 'hono/bun';

const app = new Hono();

// This serves static files from the public directory.
app.use('/*', serveStatic({root: './public'}));

let count = 0;
app.get('/result', async (c: Context) => {
  count++;
  return c.text(`result #${count}`);
});

export default app;
