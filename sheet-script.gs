// Paste this into the Google Sheet's own script (Extensions > Apps Script),
// then deploy it as a web app: Execute as "Me", who has access "Anyone".
// It adds each email address as a new row, with the date and time added.
function doPost(e) {
  var email = ((e.parameter && e.parameter.email) || '').trim();
  if (email && email.length < 255 && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].appendRow([email, new Date()]);
  }
  return ContentService.createTextOutput('ok');
}
