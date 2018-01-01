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
      for( var k in this.additionalHeaders )
        authHeader[k] = this.additionalHeaders[k];

      var result = executeIfExists(callbackName,undefined,[requestData,authHeader]);
      return result.returnValue;
    }
  }  
});
