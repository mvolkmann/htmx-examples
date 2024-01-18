document.body.addEventListener('htmx:timeout', () => {
  const result = document.getElementById('result');
  if (result) result.textContent = 'The request timed out.';
});
