import {Context, Hono} from 'hono';
import {serveStatic} from 'hono/bun';
import './reload-server';

const app = new Hono();

// Serve static files from the public directory.
app.use('/*', serveStatic({root: './public'}));

const names: string[] = [
  'Amanda',
  'Gerri',
  'Jeremy',
  'Mark',
  'Meghan',
  'Pat',
  'RC',
  'Richard',
  'Tami'
];

app.post('/search', async (c: Context) => {
  const data = await c.req.formData();
  const name = (data.get('name') as string) || '';
  if (name === '') return c.html('');

  const lowerName = name.toLowerCase();
  const matches = names.filter(n => n.toLowerCase().includes(lowerName));
  return c.html(
    <>
      {matches.map(name => (
        <li>{name}</li>
      ))}
    </>
  );
});

export default app;
