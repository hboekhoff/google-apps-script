function test_connection() {
  
  var checkLoginPath = 'rest/api/2/myself';
  var additionalHeaders;
  var rba = new RequestBasicAuthentification(checkLoginPath,additionalHeaders);

  var connectionName = 'test_connection';
  var baseUrl = 'https://sjira.funkemedien.de/';
  var headers = {};
  
  var c = new Connection(baseUrl,headers);
  c.name = connectionName;
  c.authentification = rba;
  
  var path = 'rest/api/2/issue/FDC-1000';
  var successHandler = 'test_connectionSuccessHandler2';  
  var errorHandler = 'test_connectionErrorHandler2';  

  var result = c.execute(path, 'get', {expand:'names'}, successHandler, errorHandler);
  LogData(result);
}

function test_connectionSuccessHandler2(name,code,data) {
  LogData(name);
  LogData(code);
  LogData(data);
  return data;
}
function test_connectionErrorHandler2(name,code,text) {
  LogData(name);
  LogData(code);
  LogData(JSON.parse(text));
  return code;
}
