# lazy-laod

This is an example project that uses Bun, ElysiaJS, and htmx.
It demonstrates lazy loading of data when its HTML comes into view.

To run this:

- Install Bun
- Enter `bun install`
- Enter `bun run dev`
- Browse localhost:1919
- Open DevTools and click the Network tab.
- Scroll to the bottom of the page.
- Note that a spinner appears briefly
  while data for a user table is loaded
  AND the HTTP request to fetch the user data
  is not sent until the table comes into view.
