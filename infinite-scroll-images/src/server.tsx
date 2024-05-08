import {Glob} from 'bun';
import {Context, Hono} from 'hono';
import {serveStatic} from 'hono/bun';
import './reload-server';

const ROWS_PER_PAGE = 10;

const glob = new Glob('*');
const allFilenames = [...glob.scanSync('./public/images')];
allFilenames.sort();

async function ImageRow(page: number, filename: string, isLast: boolean) {
  const attrs = isLast
    ? {
        'hx-trigger': 'revealed',
        'hx-get': '/image-rows?page=' + (page + 1),
        'hx-indicator': '.htmx-indicator',
        'hx-swap': 'afterend'
      }
    : {};
  return (
    <tr {...attrs}>
      <td>{filename}</td>
      <td>
        <img alt={filename} src={'./images/' + filename} />
      </td>
    </tr>
  );
}

const app = new Hono();

// Serve static files from the public directory.
app.use('/*', serveStatic({root: './public'}));

app.get('/image-rows', async (c: Context) => {
  const page = Number(c.req.query('page'));
  if (!page) throw new Error('page query parameter is required');

  const offset = (page - 1) * ROWS_PER_PAGE;
  const pageFilenames = allFilenames.slice(offset, offset + ROWS_PER_PAGE);
  return c.html(
    <>
      {pageFilenames.map((filename, index) => {
        const isLast = index === ROWS_PER_PAGE - 1;
        return ImageRow(page, filename, isLast);
      })}
    </>
  );
});

export default app;
