function Connection(name,url,contentType,loginCheckOrCredentials){
  this.name = name;
  this.baseUrl = url;
  this.contentType = contentType || 'application/json';
  if( isString(loginCheckOrCredentials) )
    this.loginCheck = loginCheckOrCredentials;
  else if( isObject(loginCheckOrCredentials) )
    this.credentials = loginCheckOrCredentials;
  
  this.open = function(){
    if( !isUndefined(this.credentials) ) return;
    
    var customData = { 'data': {},
                       'method': 'get',
                       'contentType': this.contentType,
                       'url': this.baseUrl + this.loginCheck,
                       'testUrl': this.baseUrl + this.loginCheck,
                       'onSuccess': undefined,
                       'onError': undefined };
 
     CredentialProvider
      .requestCredentials(this.name, 
                          'ConnectionLoginCheck', 
                          '',
                          '',
                           customData);
  };
  this.openAndRun = function(callback){
    var customData = { 'data': { 'params': argumentsToArray(arguments) },
                       'method': 'get',
                       'contentType': this.contentType,
                       'url': this.baseUrl + this.loginCheck,
                       'testUrl': this.baseUrl + this.loginCheck,
                       'onSuccess': ensureFunctionName(callback),
                       'onError': undefined };

    if( !isUndefined(this.credentials) ) 
      ConnectionOpened(this.name,
                       this.credentials.username,
                       this.credentials.password,
                       customData);
    else    
     CredentialProvider
      .requestCredentials(this.name, 
                          'ConnectionLoginCheck', 
                          'ConnectionOpened',
                          '',
                           customData);
  };
  
  this.execute = function(path,method,data) {
    var cred = this.credentials || 
               CredentialProvider.getCredentials(this.name, 
                                                 'ConnectionLoginCheck',
                                                 {'contentType': this.contentType,
                                                  'testUrl': this.baseUrl + this.loginCheck}
                                                );
    if( isUndefined(cred) ) {
      throw {'responseCode': 401,
             'message': 'authorization required',
             'url': this.baseUrl,
             'method': 'get' };
    }
    return ConnectionExecute(getBasicAuthHeader(cred.username,cred.password),
                             this.baseUrl + path,
                             method || 'get', 
                             this.contentType,
                             data);
  };
  this.executeAsync = function(path,method,data,successHandlerName,errorHandlerName){
    var customData = { 'data': data,
                       'method': method || 'get',
                       'contentType': this.contentType,
                       'url': this.baseUrl + path,
                       'testUrl': this.baseUrl + this.loginCheck,
                       'onSuccess': ensureFunctionName(successHandlerName),
                       'onError': ensureFunctionName(errorHandlerName) };
    if( !isUndefined(this.credentials) )
      ConnectionResume(this.name,
                       this.credentials.username,
                       this.credentials.password,
                       customData);
    else
      CredentialProvider.
        requestCredentials(this.name, 
                           'ConnectionLoginCheck', 
                           'ConnectionResume',
                           'ConnectionAbort',
                           customData);
   };
} 
 
//-- globale Callback-Funktionen ----------------
 
function ConnectionLoginCheck(context,username,password,customData) {
  try {
    ConnectionExecute(getBasicAuthHeader(username,password),
                      customData.testUrl,
                      'get',
                      customData.contentType,
                      {});
    return true;
  }
  catch(e) {
    return false;
  }
}
function ConnectionOpened(context,username,password,customData) {
  var resumeFunction = eval(customData.onSuccess);
  if( !isFunction(resumeFunction) ) return;
  
  resumeFunction.apply(null, customData.data.params)
}
function ConnectionResume(context,username,password,customData) {
  ConnectionExecute(getBasicAuthHeader(username,password),
                    customData.url,
                    customData.method,
                    customData.contentType,
                    customData.data,
                    eval(customData.onSuccess),
                    eval(customData.onError));
}
function ConnectionExecute(authHeader, url, method, contentType, data, success, error) {
  if( method.toLowerCase() === 'get' ) {
    url = appendJsonToQueryString(url, data);
    data = '';
  } 
  else if( isObject( data ) ) {
    data = JSON.stringify( data );
  }
  var headers = shallowCopy(authHeader);
  headers['Accept'] = contentType;
  
  var options = { 'muteHttpExceptions': true, 
                  'headers': headers,
                  'contentType': contentType,
                  'method': method,
                  'payload': data };
  
  var response = UrlFetchApp.fetch(url, options);

  if( response.getResponseCode() >= 200 && response.getResponseCode() < 300 ) {
    var responsetext = response.getContentText();

    var responseobj = responsetext == ''? {} : JSON.parse( responsetext );
    if( isFunction(success) ) 
      success(responseobj, response.getResponseCode());
    return responseobj;
  }
  else {
    if( isFunction(error) ) 
      error(response.getContentText(),response.getResponseCode()); 
    else {
      var cd = response.getResponseCode();
      var txt = response.getContentText();
      throw {'responseCode': response.getResponseCode(),
             'message': response.getContentText(),
             'url': url,
             'method': method };
    }
  }
} // ConnectionExecute
function ConnectionAbort(context,customData) {
  // nix
}

