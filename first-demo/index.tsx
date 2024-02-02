import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import type { Context } from "hono";

const app = new Hono();

// Serve static files from the public directory.
app.use("/*", serveStatic({ root: "./public" }));

app.get("/date", async (c: Context) => {
  return c.text(new Date().toLocaleDateString());
});

export default app;
