// See https://github.com/elysiajs/elysia/issues/125.
(function () {
  const socket = new WebSocket('ws://localhost:5000/live-reload');
  socket.onmessage = msg => {
    if (msg.data === 'live-reload') location.reload();
  };
  console.log('Live reload is enabled.');
})();
