import {Context, Hono} from 'hono';
import {serveStatic} from 'hono/bun';
import {readdir} from 'node:fs/promises';
import './reload-server';

const IMAGE_DIR = './public/images';
const ROWS_PER_PAGE = 10;

async function ImageRow(page: number, filename: string, isLast: boolean) {
  const attrs = isLast
    ? {
        'hx-trigger': 'revealed',
        'hx-get': '/image-rows?page=' + (page + 1),
        'hx-indicator': '.htmx-indicator',
        'hx-swap': 'afterend'
      }
    : {};
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
    <tr {...attrs}>
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

  // Bun.sleepSync(500); // simulates long-running query

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
      {pageFilenames.map((filename, index) => {
        const isLast = index === ROWS_PER_PAGE - 1;
        return ImageRow(page, filename, isLast);
      })}
    </>
  );
});

export default app;
