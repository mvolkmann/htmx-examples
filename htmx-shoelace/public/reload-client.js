// The port here must match the port used in src/reload-server.js.
const ws = new WebSocket('ws://localhost:3001');

ws.addEventListener('close', event => {
  // This assumes the server will restart and create a new WebSocket server.
  setTimeout(() => {
    location.reload();
  }, 500); // gives the server time to restart
});

ws.addEventListener('message', event => {
  if (event.data === 'reload') location.reload();
});
