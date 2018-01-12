/* var jiraConnection = new BasicAuthentification('hans','123456');
*/
function BasicAuthentification(username,password,additionalHeaders) {
  this.username = username;
  this.password = this.password;
  this.additionalHeaders = additionalHeaders || {};
}
Object.defineProperties(BasicAuthentification.prototype, {
  getAuthentificationHeader: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function() {
      return BasicAuthentification.getBasicAuthentificationHeader(this.username, this.password);
    }
  },
  authentifyAndExecute: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function(connectionName,requestData,executeCallback,failureCallback) {
      var authHeader = this.getAuthentificationHeader();
      authHeader = Object.assign(authHeader, this.additionalHeaders);

      var result = executeIfExists(executeCallback,null,[connectionName,requestData,authHeader]);
      return result.returnValue;
    }
  }  
});
Object.defineProperties(BasicAuthentification, {
  getBasicAuthentificationHeader: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function(username,password) {
      return {'Authorization': 'Basic ' + Utilities.base64Encode(username + ':' + password)};
    }
  }
});