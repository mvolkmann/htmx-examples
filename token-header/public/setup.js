document.body.addEventListener('htmx:configRequest', event => {
  console.log('setup.js : event.detail =', event.detail);
  event.detail.headers['x-token'] = 'my-token';
});
