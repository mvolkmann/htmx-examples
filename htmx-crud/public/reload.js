ws = new WebSocket('ws://localhost:3001');

ws.addEventListener('close', event => {
  // This assumes the server will restart and create a new WebSocket server.
  setTimeout(() => {
    window.location.reload();
  }, 500); // gives the server time to restart
});

ws.addEventListener('message', event => {
  if (event.data === 'reload') location.reload();
});

// TODO: Do you need this? It doesn't make the htmx:swapError go away.
window.onload = () => {
  htmx.config.useTemplateFragments = true;
  console.log('reload.js onload: htmx.config =', htmx.config);
};
