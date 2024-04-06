import {type Context, Hono} from 'hono';
import {serveStatic} from 'hono/bun';
import './reload-server';

const app = new Hono();

// Serve static files from the public directory.
app.use('/*', serveStatic({root: './public'}));

app.get('/quote', async (c: Context) => {
  try {
    const res = await fetch('https://api.quotable.io/random');
    const quote = await res.json();
    return c.text(quote.content);
  } catch (error) {
    return c.text(JSON.stringify(error));
  }
});

export default app;
