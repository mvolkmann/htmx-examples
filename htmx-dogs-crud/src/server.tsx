import {type Context, Hono} from 'hono';
import {serveStatic} from 'hono/bun';
import './reload-server';

type Dog = {id: string; name: string; breed: string};

let selectedId = '';

const dogMap = new Map<string, Dog>();

addDog('Comet', 'Whippet');
addDog('Oscar', 'German Shorthaired Pointer');

function addDog(name: string, breed: string): Dog {
  const id = crypto.randomUUID(); // standard web API
  const dog = {id, name, breed};
  dogMap.set(id, dog);
  return dog;
}

function dogRow(dog: Dog, updating = false) {
  const attrs: {[key: string]: string} = {};
  if (updating) attrs['hx-swap-oob'] = 'true';
  return (
    <tr class="on-hover" id={`row-${dog.id}`} {...attrs}>
      <td>{dog.name}</td>
      <td>{dog.breed}</td>
      <td class="buttons">
        <button
          class="show-on-hover"
          hx-confirm="Are you sure?"
          hx-delete={`/dog/${dog.id}`}
          hx-target="closest tr"
          hx-swap="delete"
          type="button"
        >
          ✕
        </button>
        {/* This selects the dog which triggers a selection-change event,
            which causes the form to update. */}
        <button
          class="show-on-hover"
          hx-get={'/select/' + dog.id}
          hx-swap="none"
          type="button"
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

// Deletes the dog with a given id.
app.delete('/dog/:id', (c: Context) => {
  const id = c.req.param('id');
  const existed = dogMap.delete(id);
  if (!existed) c.status(404);
  return c.body(null);
});

// Deselects the currently selected dog.
app.get('/deselect', (c: Context) => {
  selectedId = '';
  c.header('HX-Trigger', 'selection-change');
  return c.body(null);
});

// Gets the proper form for either adding or updating a dog.
app.get('/form', (c: Context) => {
  const selectedDog = dogMap.get(selectedId);

  const attrs: {[key: string]: string} = {
    'hx-on:htmx:after-request': 'this.reset()'
  };
  if (selectedId) {
    // Update an existing row.
    // A new table row will replace the current one
    // using an out-of-band swap.
    attrs['hx-put'] = '/dog/' + selectedId;
  } else {
    // Add a new row.
    // A new table row will be added after the beginning of the
    // `tbody` element, making it the new, first child element.
    attrs['hx-post'] = '/dog';
    attrs['hx-target'] = 'tbody';
    attrs['hx-swap'] = 'afterbegin';
  }

  return c.html(
    <form hx-disabled-elt="#submit-btn" {...attrs}>
      <div>
        <label for="name">Name</label>
        <input
          id="name"
          name="name"
          required
          size={30}
          type="text"
          value={selectedDog?.name ?? ''}
        />
      </div>
      <div>
        <label for="breed">Breed</label>
        <input
          id="breed"
          name="breed"
          required
          size={30}
          type="text"
          value={selectedDog?.breed ?? ''}
        />
      </div>
      <div class="buttons">
        <button id="submit-btn">{selectedId ? 'Update' : 'Add'}</button>
        {selectedId && (
          <button hx-get="/deselect" hx-swap="none" type="button">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
});

// Selects a dog.
app.get('/select/:id', (c: Context) => {
  selectedId = c.req.param('id');
  c.header('HX-Trigger', 'selection-change');
  return c.body(null);
});

// Gets table rows for all the dogs.
app.get('/table-rows', (c: Context) => {
  const dogs = Array.from(dogMap.values());
  dogs.sort((a: Dog, b: Dog) => a.name.localeCompare(b.name));
  return c.html(<>{dogs.map(dog => dogRow(dog))}</>);
});

// Creates a dog.
app.post('/dog', async (c: Context) => {
  const formData = await c.req.formData();
  const name = (formData.get('name') as string) || '';
  const breed = (formData.get('breed') as string) || '';
  const dog = addDog(name, breed);
  return c.html(dogRow(dog), 201);
});

// Updates a dog
app.put('/dog/:id', async (c: Context) => {
  const id = c.req.param('id');
  const formData = await c.req.formData();
  const name = (formData.get('name') as string) || '';
  const breed = (formData.get('breed') as string) || '';
  const updatedDog = {id, name, breed};
  dogMap.set(id, updatedDog);

  selectedId = '';
  c.header('HX-Trigger', 'selection-change');
  return c.html(dogRow(updatedDog, true));
});

export default app;
