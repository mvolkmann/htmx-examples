let count = 0;

function maybeSend() {
  count++;
  if (count % 3 === 0) {
    htmx.ajax('GET', '/result', '#result');
  } else {
    const result = document.getElementById('result');
    result.innerText = 'not called';
  }
}
