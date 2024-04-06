import {type Context, Hono} from 'hono';
import {serveStatic} from 'hono/bun';
import './reload-server';

const app = new Hono();

// This serves static files from the public directory.
app.use('/*', serveStatic({root: './public'}));

app.get('/request1', (c: Context) => {
  const token = c.req.header('x-token');
  return c.text(`/request1 received the token "${token}".`);
});

app.post('/request2', (c: Context) => {
  const token = c.req.header('x-token');
  return c.text(`/request2 received the token "${token}".`);
});

export default app;
