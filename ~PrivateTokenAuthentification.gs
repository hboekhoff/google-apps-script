/* var harvestAuthentification = 
          new PrivateTokenAuthentification('...',
                                           { 'Harvest-Account-Id': '...',
                                             'User-Agent': '...' 
                                           }
                                          );
*/
function PrivateTokenAuthentification(accessToken,additionalHeaders) {
  this.accessToken = accessToken;
  this.additionalHeaders = additionalHeaders || {};
}
Object.defineProperties(PrivateTokenAuthentification.prototype, {
  getAuthentificationHeader: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function() {
      return { 'Authorization': 'Bearer ' + this.accessToken };
    }
  },
  authentifyAndExecute: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function(connectionName,requestData,callbackName) {
      var authHeader = getAuthentificationHeader();
      authHeader = Object.assign(authHeader, this.additionalHeaders);

      var result = executeIfExists(callbackName,undefined,[connectionName,requestData,authHeader]);
      return result.returnValue;
    }
  }  
});
