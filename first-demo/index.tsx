import { Hono } from "hono";
import type { Context } from "hono";
import type { FC } from "hono/jsx";

const app = new Hono();

const Layout: FC = ({ children }) => (
  <html>
    <head>
      <title>htmx First Demo</title>
      <script src="https://unpkg.com/htmx.org@1.9.10"></script>
    </head>
    <body>{children}</body>
  </html>
);

app.get("/", (c: Context) => {
  return c.html(
    <Layout>
      <button hx-get="/date" hx-target="#date">
        Get Data
      </button>
      <div id="date"></div>
    </Layout>
  );
});

app.get("/date", async (c: Context) => {
  return c.text(new Date().toLocaleDateString());
});

export default app;
