import {type Context, Hono} from 'hono';
import {serveStatic} from 'hono/bun';
import './reload-server';

type User = {
  id: number;
  name: string;
  email: string;
  company: {
    name: string;
  };
};

const URL = 'https://jsonplaceholder.typicode.com/users';

const app = new Hono();

// Serve static files from the public directory.
app.use('/*', serveStatic({root: './public'}));

app.get('/users', async (c: Context) => {
  Bun.sleepSync(1000); // simulates long-running query
  const res = await fetch(URL);
  const users = await res.json();
  return c.html(
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Company</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user: User) => (
          <tr>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.company.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});

export default app;
