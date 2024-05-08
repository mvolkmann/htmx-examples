import {Glob} from 'bun';
import {type Context, Hono} from 'hono';
import {serveStatic} from 'hono/bun';
import './reload-server';

const ROWS_PER_PAGE = 5;

const glob = new Glob('*');
const allFilenames = [...glob.scanSync('./public/images')];
allFilenames.sort();

async function ImageRow(filename: string, isLast: boolean) {
  return (
    <tr>
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

  Bun.sleepSync(500); // simulates long-running query

  const offset = (page - 1) * ROWS_PER_PAGE;
  const pageFilenames = allFilenames.slice(offset, offset + ROWS_PER_PAGE);
  return c.html(
    <>
      {/* It doesn't work to put the headings in index.html
          and replace tbody instead of table. */}
      <table id="image-table">
        <tr>
          <th>File Name</th>
          <th>Image</th>
        </tr>
        {pageFilenames.map((filename, index) => {
          const isLast = index === ROWS_PER_PAGE - 1;
          return ImageRow(filename, isLast);
        })}
      </table>

      {/* The hx-indicator and hx-target attributes are
          inherited by the buttons inside this span. */}
      <span
        id="pagination-buttons"
        hx-swap-oob="true"
        hx-indicator=".htmx-indicator"
        hx-target="#image-table"
      >
        <button disabled={page === 1} hx-get={`/image-rows?page=${page - 1}`}>
          Previous
        </button>
        <button hx-get={`/image-rows?page=${page + 1}`}>Next</button>
      </span>
    </>
  );
});

export default app;
