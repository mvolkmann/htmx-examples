import {Context, Hono} from 'hono';
import {serveStatic} from 'hono/bun';

const POKEMON_URL = 'https://pokeapi.co/api/v2/pokemon-species';

type Pokemon = {
  name: string;
  url: string;
};

type PokemonData = {
  results: Pokemon[];
};

const app = new Hono();

// Serve static files from the public directory.
app.use('/*', serveStatic({root: './public'}));

app.get('/pokemon', async (c: Context) => {
  await Bun.sleep(1000); // simulates a long-running request
  const response = await fetch(POKEMON_URL);
  const json = (await response.json()) as PokemonData;
  const pokemonList = json.results as Pokemon[];

  return c.html(
    <>
      {pokemonList.map(pokemon => {
        return <div>{pokemon.name}</div>;
      })}
    </>
  );
});

export default app;
