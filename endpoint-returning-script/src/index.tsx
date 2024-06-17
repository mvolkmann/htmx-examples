import {Context, Hono} from 'hono';
import type {FC} from 'hono/jsx';

const app = new Hono();

const BaseHtml: FC = ({children}) => (
  <html>
    <head>
      <title>Endpoint Returning Script</title>
      <script src="https://unpkg.com/htmx.org@2.0.0"></script>
      <script>console.log('Hello, World!');</script>
    </head>
    <body>{children}</body>
  </html>
);

app.get('/', (c: Context) => {
  return c.html(
    <BaseHtml>
      <h1>Endpoint Returning Script</h1>
    </BaseHtml>
  );
});

export default app;
