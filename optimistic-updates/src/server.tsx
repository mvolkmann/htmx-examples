import {type Context, Hono} from 'hono';
import {serveStatic} from 'hono/bun';
import './reload-server';

const breeds = [
  'Beagle',
  'Bulldog',
  'Dachshund',
  'French Bulldog',
  'German Shepard',
  'German Shorthaired Pointer',
  'Golden Retriever',
  'Labrador',
  'Poodle',
  'Rottweiler',
  'Whippet'
];
const dogs = new Map<string, boolean>();
for (const breed of breeds) {
  dogs.set(breed, false);
}

function dogRow(breed: string) {
  return (
    <tr>
      <td>{breed}</td>
      <td
        class="center"
        hx-put={`/dog/${breed}`}
        hx-target="this"
        hx-indicator=".htmx-indicator"
        hx-on:click="optimisticLike(event)"
      >
        {getHeart(dogs.get(breed) ?? false)}
      </td>
    </tr>
  );
}

const getHeart = (like: boolean) => (like ? '❤️' : '🤍');

const app = new Hono();

// Serve static files from the public directory.
app.use('/*', serveStatic({root: './public'}));

app.get('/dogs', (c: Context) => {
  return c.html(<>{breeds.map(dogRow)}</>);
});

app.put('/dog/:breed', async (c: Context) => {
  Bun.sleepSync(1000);
  const breed = c.req.param('breed');
  const like = !(dogs.get(breed) ?? false);
  dogs.set(breed, like);
  return c.text(getHeart(like));
});

export default app;
