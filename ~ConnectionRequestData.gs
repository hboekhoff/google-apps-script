function ConnectionRequestData(baseUrl, path, method, successHandlerName, errorHandlerName, payload, headers) {
  this.baseUrl = baseUrl;
  this.path = path || '';
  this.method = method || this.method;
  this.successHandlerName = successHandlerName;
  this.errorHandlerName = errorHandlername;
  this.payload = payload;
  this.headers = headers || {};
}

Object.defineProperties(ConnectionRequestData.prototype,{
  muteHttpExceptions: {
    writable: true,
    configurable: false,
    enumerable: true,
    value: true
  },
  contentType: {
    writable: true,
    configurable: false,
    enumerable: true,
    value: 'application/json'
  },
  method: {
    writable: true,
    configurable: false,
    enumerable: true,
    value: 'get'
  },
  getHeader: {
    writable: false,
    configurable: false,
    enumerable: false,
    value: function(key) {
      return this.headers[key];
    }
  },
  setHeader: {
    writable: false,
    configurable: false,
    enumerable: false,
    value: function(key,value) {
      this.headers[key] = value;
    }
  },
  removeHeader: {
    writable: false,
    configurable: false,
    enumerable: false,
    value: function(key) {
      delete this.headers[key];
    }
  },
  getAllHeaders: {
    writable: false,
    configurable: false,
    enumerable: false,
    value: function() {
      return this.headers;
    }
  },
  removeAllHeaders: {
    writable: false,
    configurable: false,
    enumerable: false,
    value: function() {
      this.headers = {};
    }
  },
  setAllHeaders: {
    writable: false,
    configurable: false,
    enumerable: false,
    value: function(newheaders) {
      this.headers = Object.assign(this.headers,newheaders);
    }
  },
  getUrl: {
    writable: false,
    configurable: false,
    enumerable: false,
    value: function() {
      var url = this.baseUrl + path;
      return (this.method.toLowerCase() == 'get')? 
                appendJsonToQueryString(url,this.payload) :
                url;
      }
    }
  },
  getFetchParameters: {
    writable: false,
    configurable: false,
    enumerable: false,
    value: function(additionalHeaders) {
      var params = {
        'contentType': this.contentType,
        'method': this.method,
        'headers': this.headers || {},
        'muteHttpExceptions': this.muteHttpExceptions
      };
      params.headers['Accept'] = this.contentType;
      params.headers = Object.assign(params.headers, additionalHeaders[k]);

      if( this.method.toLowerCase() != 'get' )
        params.payload = JSON.stringify(this.payload);

      return params;
    }
  }
});