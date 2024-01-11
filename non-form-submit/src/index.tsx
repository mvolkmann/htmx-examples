import {Elysia} from 'elysia';
import {html} from '@elysiajs/html'; // enables use of JSX
import {staticPlugin} from '@elysiajs/static'; // enables static file serving
import {Html} from '@kitajs/html';

const app = new Elysia();
app.use(html());
// This causes link and script tags to look for files in the public directory.
app.use(staticPlugin({prefix: ''}));

const BaseHtml = ({children}: {children: Html.Children}) => (
  <html>
    <head>
      <title>htmx non-form submit</title>
      <script src="https://unpkg.com/htmx.org@1.9.9"></script>
    </head>
    <body class="p-8">{children}</body>
  </html>
);

app.get('/', () => {
  return (
    <BaseHtml>
      <main>
        <input
          id="firstName"
          name="firstName"
          placeholder="First Name"
          size="10"
        />
        <input
          id="lastName"
          name="lastName"
          placeholder="Last Name"
          size="10"
        />
        {/* Using hx-include removes the need to wrap the inputs in a form. */}
        <button
          hx-post="/search"
          hx-include="#firstName, #lastName"
          hx-target="#result"
          hx-swap="innerHTML"
        >
          Submit
        </button>
        <div id="result" />
      </main>
    </BaseHtml>
  );
});

type Body = {firstName: string; lastName: string};
app.post('/search', ({body}) => {
  // const name = (body as Body).name;
  console.log('index.tsx search: body =', body);
  return (
    <p>
      Hello, {body.firstName} {body.lastName}.
    </p>
  );
});

app.listen(1919);
console.log('listening on port', app.server?.port);
