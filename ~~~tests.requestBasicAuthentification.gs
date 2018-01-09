function test_requestBasicAuthentification() {

  var checkLoginPath = 'rest/api/2/myself';
  var additionalHeaders;
  var rba = new RequestBasicAuthentification(checkLoginPath,additionalHeaders);

  var connectionName = 'test_requestBasicAuthentification';
  var requestData = new ConnectionRequestData('https://sjira.funkemedien.de/',
                                              'rest/api/2/issue/FDC-1000',
                                              'get',
                                              'test_requestBasicAuthentificationSuccessHandler',
                                              'test_requestBasicAuthentificationErrorHandler');
  var callbackName = 'test_requestBasicAuthentificationCallback';
  rba.authentifyAndExecute(connectionName,requestData,callbackName);

  
}

function test_requestBasicAuthentificationCallback(connectionName, requestData, authHeader) {
  LogData( {connectionName:connectionName, 
            requestData:requestData, 
            authHeader:authHeader} );
}

function test_requestBasicAuthentificationSuccessHandler() {
LogData();
}
function test_requestBasicAuthentificationErrorHandler() {
LogData();
}


