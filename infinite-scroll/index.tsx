import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static";

const app = new Elysia();
app.use(html()); // enables use of JSX
app.use(staticPlugin({ prefix: "" })); // looks in public directory

const ROWS_PER_PAGE = 20;
// This is an array of undefined values used for mapping below.
const ROWS = [...Array(ROWS_PER_PAGE)];

function TableRow(page: number, index: number) {
  const id = (page - 1) * ROWS_PER_PAGE + index + 1;
  const isLast = index === ROWS_PER_PAGE - 1;
  return isLast ? (
    <tr
      hx-trigger="revealed"
      hx-get={"/rows?page=" + (page + 1)}
      hx-indicator="#spinner"
      hx-swap="afterend"
    >
      <td>{id}</td>
      <td>description</td>
    </tr>
  ) : (
    <tr>
      <td>{id}</td>
      <td>description</td>
    </tr>
  );
}

app.get("/rows", async ({ query }) => {
  const { page } = query;
  if (!page) throw new Error("page query parameter is required");
  Bun.sleepSync(500); // simulates long-running query
  return (
    <>
      {ROWS.map((_, index) => {
        return TableRow(Number(page), index);
      })}
    </>
  );
});

app.listen(1919);
console.log("listening on port", app.server?.port);
