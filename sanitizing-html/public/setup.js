const form = document.getElementById('my-form');
const result = document.getElementById('result');
if (form && result) {
  form.addEventListener('htmx:timeout', () => {
    result.textContent = 'The request timed out.';
  });
}
