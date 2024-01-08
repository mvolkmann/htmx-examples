import {Elysia} from 'elysia';
import {html} from '@elysiajs/html'; // enables use of JSX
import {staticPlugin} from '@elysiajs/static'; // enables static file serving

const app = new Elysia();
app.use(html());
// This causes link and script tags to look for files in the public directory.
app.use(staticPlugin({prefix: ''}));

const names: string[] = [
  'Amanda',
  'Gerri',
  'Jeremy',
  'Mark',
  'Meghan',
  'Pat',
  'RC',
  'Richard',
  'Tami'
];

// TODO: What type should be used for children?
// See https://github.com/elysiajs/elysia-html/issues/72.
// Consider using https://www.npmjs.com/package/@kitajs/html.
// import type {Html} from '@kitajs/html';
// Use the type Html.Children.
const BaseHtml = ({children}: {children: any}) => (
  <html>
    <head>
      <title>HTMX Active Search</title>
      <link href="/tailwind.css" rel="stylesheet" />
      <script src="https://unpkg.com/htmx.org@1.9.9"></script>
    </head>
    <body class="p-8">{children}</body>
  </html>
);

app.get('/', () => {
  return (
    <BaseHtml>
      <main>
        <label class="font-bold mr-4" for="name">
          Name
        </label>
        <input
          autofocus="true"
          class="border border-gray-500 p-1 rounded-lg"
          hx-trigger="keyup changed delay:200ms"
          hx-post="/search"
          hx-target="#matches"
          hx-swap="innerHTML"
          name="name"
          size="10"
        />
        <ul id="matches" />
      </main>
    </BaseHtml>
  );
});

type Body = {name: string};
app.post('/search', ({body}) => {
  const lowerName = (body as Body).name.toLowerCase();
  if (lowerName == '') return '';
  const matches = names.filter(n => n.toLowerCase().includes(lowerName));
  return (
    <>
      {matches.map(name => (
        <li>{name}</li>
      ))}
    </>
  );
});

app.listen(1919);
console.log('listening on port', app.server?.port);
