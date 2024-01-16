import {Elysia} from 'elysia';
import {html} from '@elysiajs/html'; // enables use of JSX
import {staticPlugin} from '@elysiajs/static'; // enables static file serving
import {Html} from '@kitajs/html';

// TODO: FINISH THIS APP which should render a table of weather data lazily.
const URL_PREFIX = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
const city = "st.%20louis";
const API_KEY =  "NZCR34SGFNM56AL2WMWJC3ERU";
const URL_SUFFIX = "unitGroup=metric&key=${API_KEY}&contentType=json";
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
        <div hx-get="submit"
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
          hx-push-url="/greeting"
          hx-vals='js:{"planet": "Earth", "year": new Date().getFullYear()}'
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

app.get('/search', ({query}) => {
  return (
    <p>
      Hello, {query.firstName} {query.lastName}.
    </p>
  );
});

type Body = {firstName: string; lastName: string};
app.post('/search', ({body}) => {
  console.log('index.tsx search: body =', body);
  return (
    <p>
      Hello, {body.firstName} {body.lastName}.
    </p>
  );
});

app.listen(1919);
console.log('listening on port', app.server?.port);
