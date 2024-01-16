import {Elysia} from 'elysia';
import {html} from '@elysiajs/html'; // enables use of JSX
import {staticPlugin} from '@elysiajs/static'; // enables static file serving
import {Html} from '@kitajs/html';

const URL = 'https://jsonplaceholder.typicode.com/users';

const app = new Elysia();
app.use(html());
// This causes link and script tags to look for files in the public directory.
app.use(staticPlugin({prefix: ''}));

const BaseHtml = ({children}: {children: Html.Children}) => (
  <html>
    <head>
      <title>Lazy Load</title>
      <link rel="stylesheet" href="/styles.css" />
      <script src="https://unpkg.com/htmx.org@1.9.9"></script>
    </head>
    <body>{children}</body>
  </html>
);

app.get('/', () => {
  return (
    <BaseHtml>
      <main>
        <h1>Lazy Loading</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem quos
          quae tempora ducimus suscipit aperiam facere dicta vel possimus, ullam
          fugiat laudantium soluta asperiores error labore qui optio.
          Distinctio, sit!
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt aliquam
          nam sit quas labore pariatur delectus vel velit porro a perferendis
          consequuntur optio et dolore, aliquid maxime. Ex, obcaecati officia.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Et incidunt
          voluptate voluptatibus perferendis distinctio? Ea vero perspiciatis,
          sed recusandae ab at soluta minus laborum aspernatur itaque ipsum
          maxime expedita odio.
        </p>
        <p>
          Praesentium aspernatur quibusdam consequuntur, atque ea ex ipsum
          molestiae laborum deleniti veritatis inventore reprehenderit
          voluptatem. At esse cupiditate sequi placeat consectetur. Dicta
          cupiditate numquam facilis omnis ad tempore harum eius!
        </p>
        <p>
          Assumenda error saepe sed nostrum voluptates laborum autem at natus
          similique nobis facilis repudiandae magnam molestias, consequatur eum
          ex, earum totam soluta ipsum, vitae labore numquam? Autem iure iste
          commodi.
        </p>
        <p>
          Numquam aliquid animi molestias accusamus et non quam veritatis alias
          qui aut impedit quis libero reiciendis, nesciunt blanditiis cumque
          dolorem nobis laborum necessitatibus ullam earum obcaecati. Tempora
          aspernatur libero numquam.
        </p>
        <h2>Users</h2>
        <div
          hx-get="/users"
          hx-indicator=".htmx-indicator"
          hx-trigger="revealed"
        />
        <img alt="loading..." class="htmx-indicator" src="/spinner.gif" />
      </main>
    </BaseHtml>
  );
});

app.get('/users', async () => {
  Bun.sleepSync(1000); // simulates long-running query
  const res = await fetch(URL);
  const users = await res.json();
  return (
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
        {users.map(user => (
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

app.listen(1919);
console.log('listening on port', app.server?.port);
