// Google Apps Script — вставить в Extensions > Apps Script в Google Sheets
// Deploy as Web App (Execute as: Me, Who has access: Anyone)

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Create headers if first row is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Дата', 'Telegram ID', 'Имя', 'Username',
        'Уровень', 'Название уровня', 'Баллы %',
        'Опыт', 'Частота запросов', 'Инструменты', 'VPN', 
        'Техскиллы', 'Применение', 'Промптинг', 'Бюджет',
        'Самооценка', 'Докажи (текст)'
      ]);
    }
    
    sheet.appendRow([
      new Date().toLocaleString('ru-RU', {timeZone: 'Europe/Moscow'}),
      data.tg_id || '',
      data.tg_name || '',
      data.tg_username || '',
      data.level || '',
      data.title || '',
      data.pct || '',
      data.answers?.experience || 0,
      data.answers?.frequency || 0,
      data.answers?.tools || 0,
      data.answers?.vpn || 0,
      data.answers?.techskill || 0,
      data.answers?.usage || 0,
      data.answers?.prompting || 0,
      data.answers?.budget || 0,
      data.answers?.selfassess || 0,
      data.proof || ''
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({status: 'ok'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput('AI Level Test API is running')
    .setMimeType(ContentService.MimeType.TEXT);
}
