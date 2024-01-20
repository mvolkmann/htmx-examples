import {Context, Hono} from 'hono';
import {serveStatic} from 'hono/bun';
import type {FC} from 'hono/jsx';
import WebSocket from 'ws';

const app = new Hono();

// This serves static files from the public directory.
app.use('/*', serveStatic({root: './public'}));

const dogs = ['Comet', 'Maisey', 'Oscar', 'Ramsay'];

const Layout: FC = ({children}) => (
  <html lang="en">
    <head>
      <title>Toggle Selection</title>
      <link rel="stylesheet" href="/styles.css" />
      <script
        src="https://unpkg.com/htmx.org@1.9.10"
        integrity="sha384-D1Kt99CQMDuVetoL1lrYwg5t+9QdHe7NLX/SoJYkXDFfX37iInKRy5xLSi8nO7UC"
        crossorigin="anonymous"
      ></script>
      <script defer src="setup.js"></script>
    </head>
    <body>{children}</body>
  </html>
);

app.get('/', (c: Context) =>
  c.html(
    <Layout>
      {dogs.map(dog => (
        // The Dog component is defined below.
        <Dog name={dog} />
      ))}
    </Layout>
  )
);

// This holds the name of the one selected dog.
let selectedName = '';

type DogProps = {name: string};
function Dog({name}: DogProps) {
  // It changes the background color to cornflowerblue.
  const classes = 'dog' + (name === selectedName ? ' selected' : '');

  // All swaps for these divs are performed out-of-band.
  // This is why hx-swap is set to none.
  return (
    <div
      class={classes}
      hx-get={`/toggle/${name}`}
      hx-swap="none"
      hx-swap-oob="true"
      hx-trigger="click"
      id={name}
    >
      {name}
    </div>
  );
}

app.get('/toggle/:name', (c: Context) => {
  const name = c.req.param('name');
  const previousDog = selectedName ? <Dog name={selectedName} /> : null;
  const thisDog = <Dog name={name} />;
  selectedName = name === selectedName ? '' : name;

  // If a dog was previously selected, two Dog components are returned.
  // Otherwise only one is returned.
  // Both will have hx-swap-oob set to true.
  return c.html(
    <>
      {previousDog}
      {thisDog}
    </>
  );
});

// The browser code connects to this
// so it can detect when the server is restarted.
// On restart, the browser reloads the page.
new WebSocket.Server({port: 3001});

export default app;
