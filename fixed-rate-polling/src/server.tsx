import {type Context, Hono} from 'hono';
import {serveStatic} from 'hono/bun';

let team1HasBall = true;
let score1 = 0;
let score2 = 0;
const team1 = 'Chiefs';
const team2 = '49ers';

function getPoints() {
  const number = Math.floor(Math.random() * 10);
  const touchdown = 7;
  const fieldGoal = 3;
  return number >= 8 ? touchdown : number >= 5 ? fieldGoal : 0;
}

const app = new Hono();

// This serves static files from the public directory.
app.use('/*', serveStatic({root: './public'}));

app.get('/score', async (c: Context) => {
  if (team1HasBall) {
    score1 += getPoints();
  } else {
    score2 += getPoints();
  }
  team1HasBall = !team1HasBall;

  // Returning a status of 286 terminates fixed rate polling.
  c.status(score1 > 30 || score1 > 30 ? 286 : 200);

  return c.text(`${team1}: ${score1}, ${team2}: ${score2}`);
});

export default app;
