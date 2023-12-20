import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static";

const app = new Elysia();
app.use(html());
app.use(staticPlugin({ prefix: "" }));

const ROWS_PER_PAGE = 20;
let ROWS = [...Array(ROWS_PER_PAGE)];
let lastRow = 0;

function TableRow(page: number, index: number) {
  const isLast = index === ROWS_PER_PAGE - 1;
  const id = (page - 1) * ROWS_PER_PAGE + index + 1;
  const nextPage = page + 1;
  return isLast ? (
    <tr
      hx-trigger="revealed"
      hx-get={"/rows?page=" + nextPage}
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

app.get("/rows", ({ query }) => {
  const page = query.page ? Number(query.page) : 1;
  const result = (
    <>
      {ROWS.map((_, index) => {
        return TableRow(page, index);
      })}
    </>
  );
  lastRow += ROWS_PER_PAGE;
  return result;
});

app.listen(1919);
console.log("listening on port", app.server?.port);
