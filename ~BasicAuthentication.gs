/* var jiraConnection = new BasicAuthentication('hans','123456');
*/
function BasicAuthentication(username,password,additionalHeaders) {
  this.username = username;
  this.password = this.password;
  this.additionalHeaders = additionalHeaders || {};
}
Object.defineProperties(BasicAuthentication.prototype, {
  getAuthenticationHeader: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function() {
      return {'Authorization': 'Basic ' + Utilities.base64Encode(this.username + ':' +  this.password)};
    }
  },
  authenticateAndExecute: {
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
  }  
});
