/* var jiraConnection = new BasicAuthentication('hans','123456');
*/
var LOGIN_CACHE_DURATION = 21600; // sekunden

function RequestBasicAuthentication(checkLogin,additionalHeaders) {
  this.checkLogin = ceckLogin;
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
      
      var customData = {'requestData': requestData,
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
    value: function(context,username,password) {
      PropertiesService.getUserProperties().deleteProperty('RequestBasicAuthentication.' + context + '.username');
      PropertiesService.getUserProperties().deleteProperty('RequestBasicAuthentication.' + context + '.password');
    }
  },
  executeCallback: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function(connectionName,requestData,callbackName) {
      var authHeader = getAuthenticationHeader();
      for( var k in this.additionalHeaders )
        authHeader[k] = this.additionalHeaders[k];

      var result = executeIfExists(callbackName,undefined,[requestData,authHeader]);
      return result.returnValue;
    }
  },
  checkLoginData: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function() {
    }
  },
  resumeLoginDialog: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function() {
    }
  },
  abortLoginDialog: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function() {
    }
  }  
});
