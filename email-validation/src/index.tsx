import {Elysia} from 'elysia';
import {html} from '@elysiajs/html'; // enables use of JSX
import {staticPlugin} from '@elysiajs/static'; // enables static file serving
import {Html} from '@kitajs/html';

const existingEmails = [
  'old@aol.com',
  'existing@gmail.com',
  'test@hotmail.com'
];

const app = new Elysia();
app.use(html());
// This causes link and script tags to look for files in the public directory.
app.use(staticPlugin({prefix: ''}));

const BaseHtml = ({children}: {children: Html.Children}) => (
  <html>
    <head>
      <title>htmx email validation</title>
      <script src="https://unpkg.com/htmx.org@1.9.9"></script>
    </head>
    <body class="p-8">{children}</body>
  </html>
);

app.get('/', () => {
  return (
    <BaseHtml>
      <h2>Sign Up</h2>
      <form hx-post="/account" hx-target="#result">
        <div>
          <label for="email">Email</label>
          <input
            id="email"
            hx-get="/email-validate"
            hx-target="#result"
            hx-trigger="keyup changed delay:200ms"
            name="email"
            placeholder="email"
            required
            size="30"
            type="email"
          />
        </div>
        <div>
          <label for="password">Password</label>
          <input
            id="password"
            hx-get="/password-validate"
            hx-target="#result"
            hx-trigger="blur"
            minlength="8"
            name="password"
            placeholder="password"
            required
            size="20"
            type="password"
          />
        </div>
        {/* HTML form validation will not work if the hx-post attribute
            is moved from the form to this button. */}
        <button>Submit</button>
        <div id="result" />
      </form>
    </BaseHtml>
  );
});

type Context = {
  query: {
    email: string;
    password: string;
  };
};

function emailContent(message: string, isError: boolean) {
  return isError ? <span style="color: red">{message}</span> : message;
}

app.get('/email-validate', ({query}: Context) => {
  const {email} = query;
  const used = existingEmails.includes(email);
  return emailContent(used ? 'email in use' : '', used);
});

app.get('/password-validate', ({query}: Context) => {
  const {password} = query;
  const valid = password.length >= 8;
  return emailContent(valid ? '' : 'invalid password', !valid);
});

app.post('/account', ({body}: any) => {
  const {email, password} = body;
  const usedEmail = existingEmails.includes(email);
  const badPassword = password.length < 8;
  const message = usedEmail
    ? 'That email is already in use.'
    : badPassword
    ? 'That password is invalid.'
    : 'A new account was created.';
  const invalid = usedEmail || badPassword;
  // TODO: If not invalid, clear the two inputs.
  return emailContent(message, invalid);
});

app.listen(1919);
console.log('listening on port', app.server?.port);
