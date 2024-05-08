import {Glob} from 'bun';
import {Context, Hono} from 'hono';
import {serveStatic} from 'hono/bun';

const glob = new Glob('*');
const allFilenames = [...glob.scanSync('./public/images')];
allFilenames.sort();

const app = new Hono();

// Serve static files from the public directory.
app.use('/*', serveStatic({root: './public'}));

app.get('/images', async (c: Context) => {
  await Bun.sleep(1000); // simulates a long-running request
  return c.html(
    <>
      {allFilenames.map(filename => {
        return (
          <img alt="book cover" class="cover" src={'./images/' + filename} />
        );
      })}
    </>
  );
});

export default app;
