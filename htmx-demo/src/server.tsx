import {type Context, Hono} from 'hono';
import {serveStatic} from 'hono/bun';
// import elements from 'js2htmlstr';
// const {img} = elements;
import './reload-server.js';

const app = new Hono();

// Serve static files from the public directory.
app.use('/*', serveStatic({root: './public'}));

app.get('/version', async (c: Context) => {
  // Return a Response whose body contains
  // the version of Bun running on the server.
  return c.text('v' + Bun.version);
  /*
  // This demonstrates using JSX to generate HTML.
  return c.html(
    <img
      alt="htmx logo"
      src="https://mvolkmann.github.io/blog/assets/htmx-logo.png"
    />
  );
  */
  /*
  // This demonstrates using js2htmlstr to generate HTML.
  return c.html(
    img({
      alt: 'htmx logo',
      src: 'https://mvolkmann.github.io/blog/assets/htmx-logo.png'
    })
  );
  */
});

export default app;
