function Connection(url) {
  this.name = this.url = url;
}
Object.defineProperties(Connection.prototype,{
  contentType: {
    enumerable: true,
    writable: true,
    configurable: false,
    value: 'application/json'
  },
  execute: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function(path, method, data, successHandlerName, errorHandlerName) {
      var params = Connection.prepareRequestParameters(this.url,path, method,this.contentType,data,successHandlerName,errorHandlerName);

      return this.authentification
                .authenticateAndExecute(this.name,params,'Connection.execute');
    }
  },
  authentification: {
    enumerable: true,
    writable: false,
    configurable: true,
    value: {
      authenticateAndExecute: function(name,requestData,callbackName){
        return Connection.execute(requestData,{});
      }
    }
  }
});

Object.defineProperties(Connection,{
  execute: {
    enumerable: false,
    writable: false,
    configurable: true,
    value: function(requestData,authentication) {
      for( var k in authentication ) {
        requestData.fetchParameters.header[k] = authentication[k];
      }

      var response = UrlFetchApp.fetch(requestData.url, 
                                       requestData.fetchParameters);

      var responsecode = response.getResponseCode();
      var responsetext = response.getContentText();

      if( responsecode >= 200 && responsecode < 300 ) {
        var responseobj = responsetext == ''? {} : JSON.parse( responsetext );
        var execResult = executeIfExists(requestData.successHandler,null,[responseobj,responsecode]);
        if( execResult.hasExecuted )
          return execResult.returnValue;
        else
          return responseobj;
      }
      else {
        var execResult = executeIfExists(requestData.errorHandler,null,[responsetext,responsecode]);
        if( execResult.hasExecuted )
          return execResult.returnValue;
        else
          throw {'responseCode': responsecode,
                 'message': responsetext,
                 'url': requestData.url,
                 'method': requestData.method };
      }
    }
  },
  prepareRequestParameters: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function(baseUrl,path,method,contentType,payload,successHandlerName,errorHandlerName) {
      var params = { 
        baseUrl: baseUrl,
        successHandler: successHandlerName,
        errorHandler: errorHandlerName,
        fetchParameters: {
          muteHttpExceptions: true, 
          contentType: contentType,
          method: method,
          headers: { Accept: contentType } 
        }
      };
  
      if( method.toLowerCase() == 'get' ) {
        params.path = appendJsonToQueryString(path, payload);
      }
      else {
        params.path = path;
        params.fetchParameters.payload = JSON.stringify( payload );
      }
      return params;
    }
  }

});