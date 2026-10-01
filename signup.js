// The sign-up sends the email address to a Google Sheet, through a small
// Google Apps Script web app (see sheet-script.gs). The address of that web
// app goes in the form's data-endpoint in index.html.
(function () {
  var form = document.querySelector('.signup');
  if (!form) return;
  var note = form.querySelector('.signup-note');
  var button = form.querySelector('button');
  var field = form.querySelector('input[type="email"]');
  var label = button.textContent;                    // "Notify me on launch"

  // Back to the ordinary button, for a new address or a new try.
  function reset() {
    form.classList.remove('is-done');
    button.textContent = label;
    button.disabled = false;
    note.classList.remove('visually-hidden');
    note.textContent = '';
  }

  // Someone starting a second address brings the button back.
  field.addEventListener('input', function () {
    if (form.classList.contains('is-done')) reset();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    reset();
    if (form.website.value) return;                   // a robot filled the trap
    if (!field.checkValidity()) { field.reportValidity(); return; }
    var endpoint = form.getAttribute('data-endpoint');
    if (!endpoint) { note.textContent = 'This is not connected yet.'; return; }

    button.disabled = true;
    // no-cors: Google answers with a redirect a page cannot read, so a
    // request that leaves without a network error is taken as sent.
    fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      body: new URLSearchParams({ email: field.value.trim() })
    }).then(function () {
      form.reset();
      form.classList.add('is-done');
      button.textContent = 'Thank you';
      // The button is the thanks to look at; this says it aloud.
      note.classList.add('visually-hidden');
      note.textContent = 'Thank you. You’re on the list.';
    }).catch(function () {
      button.disabled = false;
      note.textContent = 'That didn’t go through. Please try again.';
    });
  });
})();
