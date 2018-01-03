/* var harvestAuthentication = 
          new PriateTokenAuthentication('...',
                                      { 'Harvest-Account-Id': '...',
                                        'User-Agent': '...' 
                                      }
                                     );
*/
function PrivateTokenAuthentication(accessToken,additionalHeaders) {
  this.accessToken = accessToken;
  this.additionalHeaders = additionalHeaders || {};
}
Object.defineProperties(PrivateTokenAuthentication.prototype, {
  getAuthenticationHeader: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function() {
      return { 'Authorization': 'Bearer ' + this.accessToken };
    }
  },
  authenticateAndExecute: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function(connectionName,requestData,callbackName) {
      var authHeader = getAuthenticationHeader();
      authHeader = Object.assign(authHeader, this.additionalHeaders);

      var result = executeIfExists(callbackName,undefined,[connectionName,requestData,authHeader]);
      return result.returnValue;
    }
  }  
});
