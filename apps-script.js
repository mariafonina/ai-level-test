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
  var action = (e && e.parameter && e.parameter.action) || '';
  
  if (action === 'user') {
    return getUserResult(e.parameter.tg_id || '');
  }
  
  if (action === 'leaderboard') {
    return getLeaderboard();
  }
  
  if (action === 'clear') {
    return clearResults();
  }
  
  return ContentService.createTextOutput('AI Level Test API is running')
    .setMimeType(ContentService.MimeType.TEXT);

function getUserResult(tgId) {
  if (!tgId) return jsonResponse({error: 'no tg_id'});
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var tgIdCol = headers.indexOf('Telegram ID');
  
  // Ищем последнюю запись с этим tg_id
  var result = null;
  for (var i = data.length - 1; i >= 1; i--) {
    if (String(data[i][tgIdCol]) === String(tgId)) {
      result = {};
      for (var j = 0; j < headers.length; j++) {
        result[headers[j]] = data[i][j];
      }
      break;
    }
  }
  
  if (!result) return jsonResponse({error: 'not found'});
  return jsonResponse(result);
}

function clearResults() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }
  return jsonResponse({ok: true, deleted: lastRow - 1});
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
}
