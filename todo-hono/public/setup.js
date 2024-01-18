// This triggers a page refresh every time the server is restarted.
// That happens automatically when changes to index.tsx are saved.
//
// This needs to be a .js file, not a .ts file,
// because it's loaded by the browser.

const ws = new WebSocket('ws://localhost:3001');
ws.addEventListener('close', event => {
  setTimeout(() => {
    window.location.reload();
  }, 500); // gives the server time to restart
});

/*
document.body.addEventListener('htmx:load', () => {
  htmx.logAll();
  console.log('setup.js: logging enabled');
});
*/
