import {type Context, Hono} from 'hono';
import {serveStatic} from 'hono/bun';

let chiefsHaveBall = true;
let bills = 0;
let chiefs = 0;

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
  if (chiefsHaveBall) {
    chiefs += getPoints();
  } else {
    bills += getPoints();
  }
  chiefsHaveBall = !chiefsHaveBall;

  // Returning a status of 286 terminates fixed rate polling.
  c.status(chiefs > 30 || bills > 30 ? 286 : 200);

  return c.text(`Chiefs: ${chiefs}, Bills: ${bills}`);
});

export default app;
