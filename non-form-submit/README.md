# email-validation

This is an example project that uses htmx
to implement a sign up web UI.

It validates that the provided email address is not already in use.

To run this:

- Install Bun
- Enter `bun install`
- Enter `bun run dev`
- Browse localhost:1919
- Open DevTools and the Network tab.
- Enter an email address in the "Email" input.
- Note that debounced GET requests to
  http://localhost:1919/email-validate?email={value} are made.
- See the list of `existingEmails` in `src/index.tsx``.
- Enter an email address from this list.
- Note that the message "email in use" is returned from the endpoint
  when you type the last character in the email address
  and that this is rendered in red after the "Email" input.
