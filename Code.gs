/**
 * Google Apps Script - Web App backend for the landing page form
 * Usage:
 * 1) Create a new Apps Script project.
 * 2) Add this file as Code.gs
 * 3) Replace SHEET_ID or set via script property.
 * 4) Deploy > Web app > Execute as: Me, Who has access: Anyone with the link.
 */

// === CONFIG ===
const SHEET_ID = '1N5aGY1Ewcz4Zex_9EQ6GOCpSQM5xSN6OhtHb0zwBE5U'; // e.g., 1AbCdEfGh... from the Google Sheet URL
const SHEET_NAME = 'Submissions';          // Sheet tab name

function doGet(e) {
  return ContentService.createTextOutput('OK');
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    // Prepare header
    const header = ['timestamp','name','phone','courseId','courseTitle','note','source','ip'];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(header);
    }

    // Basic IP capture if available
    const ip = e?.parameter?.['x-forwarded-for'] || '';

    const row = [
      payload.timestamp || new Date().toISOString(),
      payload.name || '',
      payload.phone || '',
      payload.courseId || '',
      payload.courseTitle || '',
      payload.note || '',
      payload.source || 'landing-page',
      ip
    ];
    sheet.appendRow(row);

    return _json({ ok: true, saved: true });
  } catch (err) {
    return _json({ ok: false, error: String(err) }, 500);
  }
}

function _json(obj, code) {
  const out = ContentService.createTextOutput(JSON.stringify(obj));
  out.setMimeType(ContentService.MimeType.JSON);
  return HtmlService.createHtmlOutput()
    .setContent(out.getContent())
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL); // allow CORS via HTML wrapper
}
