import { type Context, Hono } from "hono";
import { serveStatic } from "hono/bun";

const app = new Hono();

// Serve static files from the public directory.
app.use("/*", serveStatic({ root: "./public" }));

app.get("/version", async (c: Context) => {
  // Return a Response whose body contains
  // the version of Bun running on the server.
  return c.text(Bun.version);
});

export default app;
