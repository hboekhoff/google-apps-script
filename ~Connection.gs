function Connection(url,headers) {
  this.name = this.url = url;
  if( url.charAt(url.length-1) != '/' )
    this.url += '/';
    
  this.headers = headers || {};
}
Object.defineProperties(Connection.prototype,{
  contentType: {
    enumerable: true,
    writable: true,
    configurable: false,
    value: 'application/json'
  },
  /*
  *  Syntax
  *     execute(path[, method[, payload[, successHandlerName[, errorHandlerName[, customData]]]]])
  *
  *  Parameters
  *     path
  *       the relative path to the remote-method
  *     method
  *       the http-method default: 'get'
  *     payload
  *       request-data to be passed with the request
  *     successHandlerName: 
  *         successHandler(connectionName,responsecode,responseobj,customData)
  *     errorHandlerName: 
  *         errorHandler(connectionName,responsecode,responsetext,customData)
  *     customData
  *       any custom-data that will be passed through to thehandler functions
  *       since this data will be serialized and deserialized in an asynchronous 
  *       call, some functionality might not be available on the object, that is 
  *       ultimately passed to the handler funcitons.
  *
  * Return value
  *   if the method is executed asynchronously, the result is undefined
  *   if it is executed synchronously, the function returns the result of 
  *   either the successHandler or the errorHandler.
  *   if no handler-function is provided, the function will return the result 
  *   of the remote-call
  *
  * Exceptions
  *   if an errorHandler is not provided the function will throw an
  *   exception in case of an error. if the errorHandler exists, all
  *   error processing is passed to the errorHandler. 
  *
  * Remarks
  *   the function by default follows an asynchronous execution-plan.
  *   The asynchronous mode is necessary because the authentification 
  *   procedure may require user input. If the authentification can do 
  *   without user input, however it will be executed synchronously and 
  *   so will the successHandler or errorHandler.
  *   
  */
  execute: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function(path, method, payload, successHandlerName, errorHandlerName, customData) {
      var params = new ConnectionRequestData(this.url,
                                             path,
                                             method,
                                             successHandlerName,
                                             errorHandlerName,
                                             payload,
                                             this.headers,
                                             customData);
      params.contentType = this.contentType;
      return this.authentification
                .authentifyAndExecute(this.name,params,'Connection.execute','Connection.failure');
    }
  },
  /*
  *  Parameters
  *     successHandlerName: 
  *         successHandler(connectionName,customData)
  *     errorHandlerName: 
  *         errorHandler(connectionName,messageCode,messageText,customData)
  */
  open: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function(successHandlerName, errorHandlerName, customData) {
      var params = new ConnectionRequestData(this.url,
                                             null,
                                             'open',
                                             successHandlerName,
                                             errorHandlerName,
                                             null,
                                             this.headers,
                                             customData);
      params.contentType = this.contentType;
      return this.authentification
                .authentifyAndExecute(this.name,params,'Connection.open','Connection.failure');
    }
  },
  authentification: {
    enumerable: true,
    writable: true,
    configurable: false,
    value: {
      authentifyAndExecute: function(connectionName,requestData,executeCallback,failureCallback){
        return Connection.execute(connectionName,requestData,{});
      }
    }
  }
});

Object.defineProperties(Connection,{
  execute: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function(connectionName,requestData,authentification) {
      // requestData may not be of type ConnectionRequestData. So use Function.prototype.apply() 
      var url = ConnectionRequestData.prototype.getUrl.apply(requestData);
      var fetchparams = ConnectionRequestData.prototype.getFetchParameters.apply(requestData,[authentification]);
      var response = UrlFetchApp.fetch(url, fetchparams);
  
      var responsecode = response.getResponseCode();
      var responsetext = response.getContentText();

      if( responsecode >= 200 && responsecode < 300 ) {
        var responseobj = responsetext == ''? {} : JSON.parse( responsetext );
        var execResult = executeIfExists(requestData.successHandlerName,null,[connectionName,responsecode,responseobj,requestData.customData]);
        if( execResult.hasExecuted )
          return execResult.returnValue;
        else
          return responseobj;
      }
      else {
        var execResult = executeIfExists(requestData.errorHandlerName,null,[connectionName,responsecode,responsetext,requestData.customData]);
        if( execResult.hasExecuted )
          return execResult.returnValue;
        else
          throw {'responseCode': responsecode,
                 'message': responsetext,
                 'url': requestData.baseUrl + requestData.path,
                 'method': requestData.method};
      }
    }
  },
  failure: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function(connectionName,requestData,messageCode,messageText) {
      var execResult = executeIfExists(requestData.errorHandlerName,null,[connectionName,messageCode,messageText,requestData.customData]);
      if( execResult.hasExecuted )
        return execResult.returnValue;
      else
        throw {'responseCode': messageCode,
               'message': messageText,
               'url': requestData.baseUrl + requestData.path,
               'method': requestData.method};
    }
  },
  open: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function(connectionName,requestData,authentification) {
      // requestData may not be of type ConnectionRequestData. So use Function.prototype.apply() 
      var url = ConnectionRequestData.prototype.getUrl.apply(requestData);
      var fetchparams = ConnectionRequestData.prototype.getFetchParameters.apply(requestData,[authentification]);

      var execResult = executeIfExists(requestData.successHandlerName,null,[connectionName,requestData.customData]);
      return execResult.hasExecuted? execResult.returnValue : true;
    }
  }
});