/* var jiraConnection = new BasicAuthentication('hans','123456');
*/
var LOGIN_CACHE_DURATION = 21600; // sekunden

function RequestBasicAuthentication(checkLoginPath,additionalHeaders) {
  this.checkLoginPath = ceckLoginPath;
  this.additionalHeaders = additionalHeaders || {};
}
Object.defineProperties(RequestBasicAuthentication.prototype, {
  authenticateAndExecute: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function(connectionName,requestData,callbackName) {
      1. trygetfromcache
      2. trygetpersisted
      3. openlogindialog
      
      var customData = {'checkLoginPath': this.checkLoginPath,
                        'additionalHeaders': this.additionalHeaders,
                        'requestData': requestData,
                        'callback': callbackName
                        };
      showLoginDialog(connectionName,
                      'RequestBasicAuthentication.resumeLoginDialog',
                      'RequestBasicAuthentication.abortLoginDialog',
                      'RequestBasicAuthentication..checkLoginData',
                      username,
                      customData)
      
      4. cache
      5. persistifchecked
    }
  }  
});
Object.defineProperties(RequestBasicAuthentication, {
  readCache: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(context) {
      var userdata = JSON.parse(CacheService.getUserCache().get('RequestBasicAuthentication') || '{}');
      return userdata[context];
    }
  },
  writeCache: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(context,username,password) {
      var userdata = JSON.parse( CacheService.getUserCache().get('RequestBasicAuthentication') || '{}' );
      userdata[context] = {'username':username,'password':password};
      CacheService.getUserCache().put('RequestBasicAuthentication', 
                                      JSON.stringify(userdata), 
                                      LOGIN_CACHE_DURATION);
    }
  },
  readPersisted: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(context) {
      var username = PropertiesService.getUserProperties().getProperty('RequestBasicAuthentication.' + context + '.username');
      var password = PropertiesService.getUserProperties().getProperty('RequestBasicAuthentication.' + context + '.password');
    
      if( isUndefined(username) || isUndefined(password) ) return undefined;
    
      return {'username':username, 'password':password};
    }
  },
  writePersisted: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(context,username,password) {
      PropertiesService.getUserProperties().setProperty('RequestBasicAuthentication.' + context + '.username', username);
      PropertiesService.getUserProperties().setProperty('RequestBasicAuthentication.' + context + '.password', password);
    }
  },
  removePersisted: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(context) {
      PropertiesService.getUserProperties().deleteProperty('RequestBasicAuthentication.' + context + '.username');
      PropertiesService.getUserProperties().deleteProperty('RequestBasicAuthentication.' + context + '.password');
    }
  },
  checkLoginData: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(connectionName,username,password,customData) {
            var customData = {'checkLoginPath': this.checkLoginPath,
                              'additionalHeaders': this.additionalHeaders,
                              'requestData': requestData,
                              'callback': callbackName
                              };
    }
  },
  resumeLoginDialog: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(connectionName,username,password,persist,customData) {
      writeCache(connectionName,username,password);
      if( persist ) 
        writePersisted(connectionName,username,password);
      else
        removePersisted(connectionName);

      var authHeader = BasicAuthentication.getBasicAuthenticationHeader(username,password);
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
