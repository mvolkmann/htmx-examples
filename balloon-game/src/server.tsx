import {Hono} from 'hono';
import {serveStatic} from 'hono/bun';
import './reload-server';

const app = new Hono();

// Serve static files from the public directory.
app.use('/*', serveStatic({root: './public'}));

export default app;
