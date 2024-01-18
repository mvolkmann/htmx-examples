import {Hono} from 'hono';
import type {Context} from 'hono';
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
        <Dog name={dog} />
      ))}
    </Layout>
  )
);

let selectedName = 'Comet';

type DogProps = {name: string};
function Dog({name}: DogProps) {
  const classes = 'name' + (name === selectedName ? ' selected' : '');
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
  const isSelected = name === selectedName;
  const previousSelectedName = selectedName;
  selectedName = isSelected ? '' : name;
  const html = c.html(
    <>
      <Dog name={name} />
      {!isSelected && <Dog name={previousSelectedName} />}
    </>
  );
  return html;
});

// The browser code connects to this
// so it can detect when the server is restarted.
// On restart, the browser reloads the page.
new WebSocket.Server({port: 3001});

export default app;
