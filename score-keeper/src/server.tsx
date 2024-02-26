import {type Context, Hono} from 'hono';
import {serveStatic} from 'hono/bun';
import './reload-server.js';

type Team = {
  name: string;
  score: number;
  like: boolean;
};

const team1: Team = {name: 'Chiefs', score: 25, like: true};
const team2: Team = {name: '49ers', score: 22, like: false};

//-----------------------------------------------------------------------------

function report(): string {
  return team1.score > team2.score
    ? `The ${team1.name} are winning.`
    : team2.score > team1.score
    ? `The ${team2.name} are winning.`
    : 'The score is tied.';
}

function teamHtml(number: string): JSX.Element {
  const team = number === '1' ? team1 : team2;
  const borderColor = team.like ? 'red' : 'white';
  return (
    <section class="column team" style={`border-color: ${borderColor}`}>
      <label>
        Team <input type="text" name={'team' + number} value={team.name} />
      </label>
      <label>
        Score <input type="number" name={'score' + number} value={team.score} />
      </label>
      <input
        type="checkbox"
        name={'like' + number}
        checked={team.like}
        hx-get={'/toggle-like/' + number}
      />
    </section>
  );
}

//-----------------------------------------------------------------------------

const app = new Hono();

// Serve static files from the public directory.
app.use('/*', serveStatic({root: './public'}));

app.get('/team/:number', async (c: Context) => {
  const number = c.req.param('number');
  return c.html(teamHtml(number));
});

app.get('/report', async (c: Context) => c.text(report()));

app.get('/toggle-like/:number', async (c: Context) => {
  const number = c.req.param('number');
  const team = number === '1' ? team1 : team2;
  team.like = !team.like;
  return c.html(teamHtml(number));
});

app.post('/update', async (c: Context) => {
  const formData = await c.req.formData();
  team1.name = (formData.get('team1') as string) || '';
  team2.name = (formData.get('team2') as string) || '';
  team1.score = Number(formData.get('score1'));
  team2.score = Number(formData.get('score2'));
  team1.like = Boolean(formData.get('like1'));
  team2.like = Boolean(formData.get('like2'));
  return c.text(report());
});

export default app;
