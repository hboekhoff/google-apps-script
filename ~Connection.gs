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
      var params = new ConnectionRequestData(this.url,path,method,successHandlerName,errorHandlerName,data);
      params.contentType = this.contentType;
      
      return this.authentification
                .authenticateAndExecute(this.name,params,'Connection.execute');
    }
  },
  authentification: {
    enumerable: true,
    writable: true,
    configurable: false,
    value: {
      authenticateAndExecute: function(connectionName,requestData,callbackName){
        return Connection.execute(connectionName,requestData,{});
      }
    }
  }
});

Object.defineProperties(Connection,{
  execute: {
    enumerable: false,
    writable: false,
    configurable: true,
    value: function(connectionName,requestData,authentication) {
      var response = UrlFetchApp.fetch(requestData.getUrl(), 
                                       requestData.getFetchParameters(authentication));

      var responsecode = response.getResponseCode();
      var responsetext = response.getContentText();

      if( responsecode >= 200 && responsecode < 300 ) {
        var responseobj = responsetext == ''? {} : JSON.parse( responsetext );
        var execResult = executeIfExists(requestData.successHandler,null,[connectionName,responseobj,responsecode]);
        if( execResult.hasExecuted )
          return execResult.returnValue;
        else
          return responseobj;
      }
      else {
        var execResult = executeIfExists(requestData.errorHandler,null,[connectionName,responsetext,responsecode]);
        if( execResult.hasExecuted )
          return execResult.returnValue;
        else
          throw {'responseCode': responsecode,
                 'message': responsetext,
                 'url': requestData.url,
                 'method': requestData.method };
      }
    }
  }
});