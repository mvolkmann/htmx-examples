import { Hono } from "hono";
import type { Context } from "hono";
import { serveStatic } from "hono/bun";
import type { FC } from "hono/jsx";

const app = new Hono();

// This serves static files from the public directory.
app.use("/*", serveStatic({ root: "./public" }));

const BaseHtml: FC = ({ children }) => (
  <html>
    <head>
      <title>Polling</title>
      <link rel="stylesheet" href="/styles.css" />
      <script src="https://unpkg.com/htmx.org@1.9.9"></script>
    </head>
    <body>{children}</body>
  </html>
);

app.get("/", (c: Context) => {
  return c.html(
    <BaseHtml>
      <h1>Fixed Rate Polling</h1>
      <h2 hx-get="/score" hx-trigger="load, every 5s" />
    </BaseHtml>
  );
});

let chiefsHaveBall = true;
let bills = 0;
let chiefs = 0;

function getPoints() {
  const number = Math.floor(Math.random() * 10);
  const touchdown = 7;
  const fieldGoal = 3;
  return number >= 8 ? touchdown : number >= 5 ? fieldGoal : 0;
}

app.get("/score", async (c: Context) => {
  if (chiefsHaveBall) {
    chiefs += getPoints();
  } else {
    bills += getPoints();
  }
  chiefsHaveBall = !chiefsHaveBall;

  // Returning a status of 286 terminates fixed rate polling.
  c.status(chiefs > 30 || bills > 30 ? 286 : 200);

  return c.text(`Chiefs: ${chiefs}, Bills: ${bills}`);
});

export default app;
