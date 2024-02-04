import {type Context, Hono} from 'hono';
import {serveStatic} from 'hono/bun';
import {watch} from 'fs';
import WebSocket from 'ws';

// Browser code will connect to this so it
// can detect when the server is restarted.
// On restart, the browser will reload the page.
let wss = new WebSocket.Server({port: 3001}); // choose any unused port

// If any files in or below the public directory change,
// send the client a message to tell it to reload.
watch('./public', {recursive: true}, (event, filename) => {
  console.log(`detected ${event} in ${filename}`);
  for (const client of wss.clients) {
    client.send('reload');
  }
});

type Dog = {id: string; name: string; breed: string};

const dogs = new Map<string, Dog>();

function addDog(name: string, breed: string): Dog {
  const id = crypto.randomUUID(); // standard web API
  const dog = {id, name, breed};
  dogs.set(id, dog);
  return dog;
}

addDog('Comet', 'Whippet');
addDog('Oscar', 'German Shorthaired Pointer');

function dogRow(dog: Dog) {
  return (
    <tr class="on-hover">
      <td>{dog.name}</td>
      <td>{dog.breed}</td>
      <td class="buttons">
        <button
          class="show-on-hover"
          hx-confirm="Are you sure?"
          hx-delete={`/dog/${dog.id}`}
          hx-swap="outerHTML"
          hx-target="closest tr"
        >
          ✕
        </button>
        <button
          class="show-on-hover"
          hx-get={`/dog-form/${dog.id}`}
          hx-swap="none"
        >
          ✎
        </button>
      </td>
    </tr>
  );
}

const app = new Hono();

// Serve static files from the public directory.
app.use('/*', serveStatic({root: './public'}));

app.get('/dog', (c: Context) => {
  const sortedDogs = Array.from(dogs.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  return c.html(<>{sortedDogs.map(dogRow)}</>);
});

app.post('/dog', async (c: Context) => {
  const formData = await c.req.formData();
  const name = (formData.get('name') as string) || '';
  const breed = (formData.get('breed') as string) || '';
  const dog = addDog(name, breed);
  return c.html(dogRow(dog), 201);
});

app.delete('/dog/:id', (c: Context) => {
  const id = c.req.param('id');
  dogs.delete(id);
  return c.html('');
});

export default app;
