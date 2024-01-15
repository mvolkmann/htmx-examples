import {Elysia} from 'elysia';
import {html} from '@elysiajs/html';
import {staticPlugin} from '@elysiajs/static';

const POKEMON_URL_PREFIX = 'https://pokeapi.co/api/v2/pokemon-species';
const ROWS_PER_PAGE = 5;

type Pokemon = {
  name: string;
  url: string;
};

const app = new Elysia();
app.use(html()); // enables use of JSX
app.use(staticPlugin({prefix: ''})); // looks in public directory

function TableRow(page: number, pokemon: Pokemon, isLast: boolean) {
  const {name, url} = pokemon;
  const id = url.split('/')[6];
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>
        <img alt={name} src={imageUrl} />
      </td>
    </tr>
  );
}

// Elysia does not serve index.html by default.
// Instead, the following error will be displayed:
// "MacOS does not support sending non-regular files"
// This redirect fixes it.
app.get('/', ({set}) => {
  set.redirect = '/index.html';
});

app.get('/pokemon-rows', async ({headers, query}) => {
  const {page} = query;
  if (!page) throw new Error('page query parameter is required');

  Bun.sleepSync(500); // simulates long-running query

  const whichPage = headers['hx-prompt'];
  const pageNumber = Number(whichPage ? whichPage : page);
  const offset = (pageNumber - 1) * ROWS_PER_PAGE;
  const url = POKEMON_URL_PREFIX + `?offset=${offset}&limit=${ROWS_PER_PAGE}`;
  const response = await fetch(url);
  const json = await response.json();
  const pokemonList = json.results as Pokemon[];

  return (
    <>
      <table id="pokemon-table">
        <tr>
          <td>ID</td>
          <td>Name</td>
          <td>Description</td>
        </tr>
        {pokemonList.map((pokemon, index) => {
          const isLast = index === ROWS_PER_PAGE - 1;
          return TableRow(pageNumber, pokemon, isLast);
        })}
      </table>

      {/* The hx-indicator and hx-target attributes are
          inherited by the buttons inside this span. */}
      <span
        id="pagination-buttons"
        hx-swap-oob="true"
        hx-indicator=".htmx-indicator"
        hx-target="#pokemon-table"
      >
        <button
          disabled={pageNumber === 1}
          hx-get={`/pokemon-rows?page=${pageNumber - 1}`}
        >
          Previous
        </button>
        <button
          hx-get={`/pokemon-rows?page=${pageNumber + 1}`}
          hx-prompt="Which page?"
        >
          Next
        </button>
      </span>
    </>
  );
});

app.listen(1919);
console.log('listening on port', app.server?.port);
