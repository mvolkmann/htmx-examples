import { type Context, Hono } from "hono";
import { serveStatic } from "hono/bun";

const app = new Hono();

// Serve static files from the public directory.
app.use("/*", serveStatic({ root: "./public" }));

app.get("/version", async (c: Context) => {
  return c.text(Bun.version);
});

export default app;
