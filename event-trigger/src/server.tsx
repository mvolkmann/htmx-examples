import {type Context, Hono} from 'hono';
import {serveStatic} from 'hono/bun';
import './reload-server.js';

const app = new Hono();

const meals = {
  breakfast: {
    milk: 3,
    pancakes: 7
  },
  lunch: {
    coke: 3,
    pizza: 8
  },
  dinner: {
    lemonade: 4,
    tacos: 10
  }
};

function randomMealName() {
  const mealNames = Object.keys(meals);
  const index = Math.floor(Math.random() * mealNames.length);
  return mealNames[index];
}

// Serve static files from the public directory.
app.use('/*', serveStatic({root: './public'}));

app.get('/alt-order', (c: Context) => {
  // This demonstrates triggering an event with no associated data.
  c.header('HX-Trigger', 'alt-order');
  return c.body(null); // empty response body
});

app.get('/meal', (c: Context) => {
  // This demonstrates triggering an event with string data.
  // The key in this object is the event name.
  const trigger = {meal: randomMealName()};
  c.header('HX-Trigger', JSON.stringify(trigger));
  return c.body(null); // empty response body
});

app.get('/order', (c: Context) => {
  const meal = meals[randomMealName()];

  // This demonstrates triggering an event with object data.
  // The key in this object is the event name.
  const trigger = {order: {value: meal}};
  c.header('HX-Trigger', JSON.stringify(trigger));

  // This returns HTML describing the meal items and their prices.
  return c.html(
    <section>
      {Object.entries(meal).map(([item, price]) => (
        <div>
          {item}: ${price}
        </div>
      ))}
    </section>
  );
});

export default app;
