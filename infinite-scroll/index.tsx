import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
// WARNING: This does not server index.html by default!  Specify that.
import { staticPlugin } from "@elysiajs/static";

const POKEMON_URL_PREFIX = "https://pokeapi.co/api/v2/pokemon-species";
const ROWS_PER_PAGE = 15;

type Pokemon = {
  name: string;
  url: string;
};

const app = new Elysia();
app.use(html()); // enables use of JSX
app.use(staticPlugin({ prefix: "" })); // looks in public directory

function TableRow(page: number, pokemon: Pokemon, isLast: boolean) {
  const attributes = isLast
    ? {
        "hx-trigger": "revealed",
        "hx-get": "/pokemon-rows?page=" + (page + 1),
        "hx-indicator": "#spinner",
        "hx-swap": "afterend",
      }
    : {};
  const { name, url } = pokemon;
  const id = url.split("/")[6];
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  return (
    <tr {...attributes}>
      <td>{id}</td>
      <td>{name}</td>
      <td>
        <img alt={name} src={imageUrl} />
      </td>
    </tr>
  );
}

app.get("/pokemon-rows", async ({ query }) => {
  const { page } = query;
  if (!page) throw new Error("page query parameter is required");

  Bun.sleepSync(500); // simulates long-running query

  const pageNumber = Number(page);
  const offset = (pageNumber - 1) * ROWS_PER_PAGE;
  const url = POKEMON_URL_PREFIX + `?offset=${offset}&limit=${ROWS_PER_PAGE}`;
  const response = await fetch(url);
  const json = await response.json();
  const pokemonList = json.results as Pokemon[];

  return (
    <>
      {pokemonList.map((pokemon, index) => {
        const isLast = index === ROWS_PER_PAGE - 1;
        return TableRow(pageNumber, pokemon, isLast);
      })}
    </>
  );
});

app.listen(1919);
console.log("listening on port", app.server?.port);
