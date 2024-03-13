let quota = 3;

function maybeSend() {
  if (quota > 0) {
    quota--;
    htmx.ajax('GET', '/result', '#result');
  } else {
    const result = document.getElementById('result');
    result.innerText = 'The call quota has been reached.';
  }
}
