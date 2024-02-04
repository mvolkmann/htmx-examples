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

function dogForm(id: string = '') {
  const dog = dogs.get(id);
  const name = dog?.name || '';
  const breed = dog?.breed || '';

  const attr = dog ? 'hx-put' : 'hx-post';
  const url = dog ? `/dog/${dog.id}` : '/dog';
  const attrs: {[key: string]: string} = {
    'hx-on:htmx:after-request': 'this.reset()',
    [attr]: url
  };

  return (
    <div hx-swap-oob="true" id="dog-form">
      <form
        hx-disabled-elt="#add-btn"
        hx-swap="afterbegin"
        hx-target="table tbody"
        {...attrs}
      >
        <div>
          <label for="name">Name</label>
          <input name="name" required size={30} type="text" value={name} />
        </div>
        <div>
          <label for="breed">Breed</label>
          <input name="breed" required size={30} type="text" value={breed} />
        </div>
        <button id="add-btn">{id ? 'Update' : 'Add'}</button>
      </form>
    </div>
  );
}

function dogRow(dog: Dog, oob: boolean = false) {
  const attrs: {[key: string]: string} = {
    id: `row${dog.id}`
  };
  if (oob) {
    attrs['hx-swap-oob'] = 'true';
  }
  return (
    <tr class="on-hover" {...attrs}>
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

app.get('/dog-form', async (c: Context) => c.html(dogForm()));

app.get('/dog-form/:id', async (c: Context) =>
  c.html(dogForm(c.req.param('id')))
);

app.get('/dog', async (c: Context) => {
  const sortedDogs = Array.from(dogs.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  return c.html(<>{sortedDogs.map(dog => dogRow(dog))}</>);
});

app.post('/dog', async (c: Context) => {
  const formData = await c.req.formData();
  const name = (formData.get('name') as string) || '';
  const breed = (formData.get('breed') as string) || '';
  const dog = addDog(name, breed);
  return c.html(dogRow(dog), 201);
});

app.put('/dog/:id', async (c: Context) => {
  const id = c.req.param('id');
  const dog = dogs.get(id);
  if (!dog) return c.html('dog not found', 404);

  const formData = await c.req.formData();
  dog.name = (formData.get('name') as string) || '';
  dog.breed = (formData.get('breed') as string) || '';
  return c.html(dogRow(dog, true));
});

app.delete('/dog/:id', async (c: Context) => {
  const id = c.req.param('id');
  dogs.delete(id);
  return c.html('');
});

export default app;
