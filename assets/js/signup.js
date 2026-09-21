const form = document.querySelector('#signup-form');
if (form) form.addEventListener('submit', async event => {
  event.preventDefault();
  const button = form.querySelector('button[type="submit"]');
  const status = document.querySelector('#signup-status');
  button.disabled = true;
  status.textContent = 'Sending confirmation…';
  try {
    const response = await fetch(form.action, { method: 'POST', headers: { accept: 'application/json', 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)) });
    const result = await response.json();
    status.textContent = result.message || 'Signup is temporarily unavailable. Please try again shortly.';
    if (response.ok) form.reset();
  } catch { status.textContent = 'Could not reach the signup service. Please try again. You can still download Proof.'; }
  finally { button.disabled = false; }
});
