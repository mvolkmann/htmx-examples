import { type Context, Hono } from "hono";
import { serveStatic } from "hono/bun";

const app = new Hono();

// Serve static files from the public directory.
app.use("/*", serveStatic({ root: "./public" }));

app.get("/time/:count", async (c: Context) => {
  const count = c.req.param("count");
  console.log("server.ts: count =", count);
  const time = new Date().toLocaleTimeString();
  return c.text(`The count at ${time} was ${count}.`);
});

export default app;
