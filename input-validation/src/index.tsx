import {Context, Hono} from 'hono';
import {serveStatic} from 'hono/bun';
import type {FC} from 'hono/jsx';
import {enhance} from './honox.ts';

const badPasswords = ['password', '12345678'];

const existingEmails = [
  'old@aol.com',
  'existing@gmail.com',
  'test@hotmail.com'
];

const app = new Hono();
enhance(app);

// Serve static files from the public directory.
app.use('/*', serveStatic({root: './public'}));

const Layout: FC = ({children}) => (
  <html>
    <head>
      <title>htmx email validation</title>
      <link rel="stylesheet" href="/style.css" />
      <script src="https://unpkg.com/htmx.org@1.9.9"></script>
    </head>
    <body>{children}</body>
  </html>
);

app.get('/', (c: Context) => {
  const reset = {
    'hx-on:htmx:after-request': `if (event.detail.pathInfo.requestPath === '/account' && event.detail.successful) this.reset()`
  };

  return (
    <Layout>
      <h2>Sign Up</h2>
      <form hx-post="/account" hx-target="#result" {...reset}>
        <div>
          <label for="email">Email</label>
          <input
            id="email"
            hx-get="/email-validate"
            hx-sync="closest form:abort"
            hx-target="#email-error"
            hx-trigger="keyup changed delay:200ms"
            name="email"
            placeholder="email"
            required
            size={30}
            type="email"
          />
          <span class="error" id="email-error" />
        </div>
        <div>
          <label for="password">Password</label>
          <input
            id="password"
            hx-get="/password-validate"
            hx-target="#password-error"
            hx-trigger="blur"
            minlength={8}
            name="password"
            placeholder="password"
            required
            size={20}
            type="password"
          />
          <span class="error" id="password-error" />
        </div>
        {/* HTML form validation will not work if the hx-post attribute
            is moved from the form to this button. */}
        <button>Submit</button>
      </form>
      <div id="result" />
    </Layout>
  );
});

function validEmail(email: string) {
  return !existingEmails.includes(email);
}

function validPassword(password: string) {
  if (!password) return true;
  return password.length >= 8 && !badPasswords.includes(password);
}

app.get('/email-validate', (c: Context) => {
  const email = c.req.query('email') || '';
  const valid = validEmail(email);
  // Setting the status to 400 prevents the message from rendering.
  // set.status = valid ? 200 : 400;
  return valid ? '' : 'email in use';
});

app.get('/password-validate', (c: Context) => {
  const password = c.req.query('password') || '';
  return validPassword(password) ? '' : 'invalid password';
});

app.post('/account', async (c: Context) => {
  const data = await c.req.formData();
  const email = (data.get('email') as string) || '';
  const password = (data.get('password') as string) || '';
  const goodEmail = validEmail(email);
  const goodPassword = validPassword(password);
  const good = goodEmail && goodPassword;
  // TODO: When JSX is returned, the response code is always 200.
  // TODO: I think this is a bug in Elysia.
  // TODO: See https://github.com/elysiajs/elysia/issues/415.
  c.status(good ? 200 : 400);
  return (
    <>
      {!goodEmail && (
        <span class="error" hx-swap-oob="true" id="email-error">
          email in use
        </span>
      )}
      {!goodPassword && (
        <span class="error" hx-swap-oob="true" id="password-error">
          invalid password
        </span>
      )}
      <span>{good ? 'A new account was created.' : ''}</span>
    </>
  );
});

export default app;
