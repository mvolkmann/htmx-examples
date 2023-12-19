// This needs to be a .js file, not a .ts file,
// because it's loaded by the browser.

const ws = new WebSocket('ws://localhost:1920');
ws.addEventListener('close', event => {
  setTimeout(() => {
    window.location.reload();
  }, 500); // gives the server time to restart
});
