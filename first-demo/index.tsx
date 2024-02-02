import { type Context, Hono } from "hono";
import { serveStatic } from "hono/bun";

const app = new Hono();

// Serve static files from the public directory.
app.use("/*", serveStatic({ root: "./public" }));

// TODO: Instead of this, use an endpoint that returns data not available in the client.
// TODO: You can open multiple clients and let each change the value.
app.get("/time/:count", async (c: Context) => {
  const count = c.req.param("count");
  const time = new Date().toLocaleTimeString();
  return c.text(`The count at ${time} was ${count}.`);
});

export default app;
