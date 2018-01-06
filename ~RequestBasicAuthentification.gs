var LOGIN_CACHE_DURATION = 21600; // sekunden

function RequestBasicAuthentification(checkLoginPath,additionalHeaders) {
  this.checkLoginPath = checkLoginPath;
  this.additionalHeaders = additionalHeaders || {};
}
Object.defineProperties(RequestBasicAuthentification.prototype, {
  authentifyAndExecute: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function(connectionName,requestData,callbackName) {
      
      function execute(username, password, additionalHeaders) {
        var authHeader = BasicAuthentification.getBasicAuthentificationHeader(username,password);
        authHeader = Object.assign(authHeader, additionalHeaders);
  
        var result = executeIfExisits(callbackName,
                                      null,
                                      [connectionName, requestData, authHeader]); 
        return result.returnValue;
      }

      var auth = RequestBasicAuthentification.readCache(connectionName);
      if( !isUndefined(auth) ) {
         return execute(auth.username, auth.password, this.additionalHeaders);
      }

      var customData = {'checkLoginPath': this.checkLoginPath,
                        'additionalHeaders': this.additionalHeaders,
                        'requestData': requestData,
                        'callback': callbackName
                       };
      auth = RequestBasicAuthentification.readPersisted(connectionName);
      if( !isUndefined(auth) && 
          RequestBasicAuthentification.checkLoginData(connectionName,
                                                      auth.username,
                                                      auth.password,
                                                      customData) ) {
        RequestBasicAuthentification.writeCache(connectionName,auth.username,auth.password);
        return execute(auth.username, auth.password, this.additionalHeaders);
      }
        
      showLoginDialog(connectionName,
                      'RequestBasicAuthentification.resumeLoginDialog',
                      'RequestBasicAuthentification.abortLoginDialog',
                      'RequestBasicAuthentification.checkLoginData',
                      username,
                      customData);

      return undefined; // everything is asynchronous now
    }
  }  
});
Object.defineProperties(RequestBasicAuthentification, {
  readCache: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(context) {
      var userdata = CacheService.getUserCache().get('RequestBasicAuthentification');
      if( isUndefined(userdata) ) 
        return undefined;

      CacheService.getUserCache().put('RequestBasicAuthentification',userdata,LOGIN_CACHE_DURATION);

      return JSON.parse(userdata)[context];
    }
  },
  writeCache: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(context,username,password) {
      var userdata = JSON.parse( CacheService.getUserCache().get('RequestBasicAuthentification') || '{}' );
      userdata[context] = {'username':username,'password':password};
      CacheService.getUserCache().put('RequestBasicAuthentification', 
                                      JSON.stringify(userdata), 
                                      LOGIN_CACHE_DURATION);
    }
  },
  readPersisted: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(context) {
      var username = PropertiesService.getUserProperties().getProperty('RequestBasicAuthentification.' + context + '.username');
      var password = PropertiesService.getUserProperties().getProperty('RequestBasicAuthentification.' + context + '.password');
    
      if( isUndefined(username) || isUndefined(password) ) return undefined;
    
      return {'username':username, 'password':password};
    }
  },
  writePersisted: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(context,username,password) {
      PropertiesService.getUserProperties().setProperty('RequestBasicAuthentification.' + context + '.username', username);
      PropertiesService.getUserProperties().setProperty('RequestBasicAuthentification.' + context + '.password', password);
    }
  },
  removePersisted: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(context) {
      PropertiesService.getUserProperties().deleteProperty('RequestBasicAuthentification.' + context + '.username');
      PropertiesService.getUserProperties().deleteProperty('RequestBasicAuthentification.' + context + '.password');
    }
  },
  checkLoginData: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(connectionName,username,password,customData) {
      var authHeader = BasicAuthentification.getBasicAuthentificationHeader(username,password);
      var requestData = new ConnectionRequestData(customData.requestData.baseUrl, 
                                                  customData.checkLoginPath, 
                                                  'get');
      requestData.setAllHeaders(customData.requestData.getAllHeaders());
      requestData.setAllHeaders(customData.additionalHeaders);
      requestData.setAllHeaders(authHeader);
      
      var response = UrlFetchApp.fetch(requestData.getUrl(), requestData.getFetchParameters());
      return response.getResponseCode() == 200;
    }
  },
  resumeLoginDialog: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(connectionName,username,password,persist,customData) {
      RequestBasicAuthentification.writeCache(connectionName,username,password);
      if( persist ) 
        RequestBasicAuthentification.writePersisted(connectionName,username,password);
      else
        RequestBasicAuthentification.removePersisted(connectionName);

      var authHeader = BasicAuthentification.getBasicAuthentificationHeader(username,password);
      authHeader = Object.assign(authHeader, customData.additionalHeaders);

      var result = executeIfExisits(customData.callbackName,
                                    null,
                                    [connectionName, customData.requestData, authHeader]); 
      return result.returnValue;
    }
  },
  abortLoginDialog: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(connectionName,customData) {
      
    }
  }  
});
