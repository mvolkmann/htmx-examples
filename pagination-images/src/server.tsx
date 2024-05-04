import {type Context, Hono} from 'hono';
import {serveStatic} from 'hono/bun';
import {readdir} from 'node:fs/promises';
import './reload-server';

const IMAGE_DIR = '/users/volkmannm/pictures/logos';
const ROWS_PER_PAGE = 5;

type Pokemon = {
  name: string;
  url: string;
};

async function ImageRow(filename: string, isLast: boolean) {
  const file = Bun.file(IMAGE_DIR + '/' + filename);
  const isSVG = filename.endsWith('.svg');
  let contents, url;
  if (isSVG) {
    contents = await file.text();
  } else {
    const arrBuf = await file.arrayBuffer();
    url = 'data:image/png;base64,' + Buffer.from(arrBuf).toString('base64');
  }
  return (
    <tr>
      <td>{filename}</td>
      <td>
        {isSVG ? (
          <div dangerouslySetInnerHTML={{__html: contents}} />
        ) : (
          <img alt={filename} src={url} />
        )}
      </td>
    </tr>
  );
}

const app = new Hono();

// Serve static files from the public directory.
app.use('/*', serveStatic({root: './public'}));

let allFilenames: string[] = [];
let imageExtensions = ['.gif', '.jpg', '.jpeg', '.png'];

app.get('/image-rows', async (c: Context) => {
  const page = Number(c.req.query('page'));
  if (!page) throw new Error('page query parameter is required');

  Bun.sleepSync(500); // simulates long-running query

  if (page === 1) {
    allFilenames = await readdir(IMAGE_DIR);
    allFilenames = allFilenames.filter(filename => {
      const file = Bun.file(filename);
      return file.type.startsWith('image');
    });
    allFilenames.sort();
  }

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
