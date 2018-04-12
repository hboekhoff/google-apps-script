function ConnectionRequestData(baseUrl, path, method, successHandlerName, errorHandlerName, payload, headers, customData) {
  this.baseUrl = baseUrl;
  this.path = path || '';
  this.method = method || this.method;
  this.successHandlerName = successHandlerName;
  this.errorHandlerName = errorHandlerName;
  this.payload = payload;
  this.headers = headers || {};
  this.customData = customData;
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
    value: function(encode) {
      function nestedObjectToString(data) {
        if( encode )
          return encodeURIComponent(JSON.stringify(data));
        else
          return JSON.stringify(data);
      }
      function joinArray(key,data) {
        if( data.length == 0 ) 
          return '';
        else if( encode ) 
          return data.reduce( function(a,c){return a+'&'+key+'='+encodeURIComponent(c);}, '' )
                     .substring(key.length + 2);
        else 
          return data.join('&'+key+'=');
      }
      function toQueryString(data) {
        var result = '';
        for( var key in data ) {
          result += "&" + key;
          var value = data[key];
          if( !isUndefined(value) ) {
            if( isArray(value) )
              result += "=" + joinArray(key,value,encode);
            else if( isObject(value) )
              result += "=" + nestedObjectToString(value,encode);
            else if( encode )
              result += "=" + encodeURIComponent(value);
            else 
              result += "=" + value;
          }
        }
        return result.substring(1);
      }    
      function appendJsonToUrl(url, data) {
        if( isUndefined(data) ) 
          return url;

        var params = toQueryString(data,encode);
        if( params.length == 0 ) 
          return url;
        else if( url.indexOf("?") > 0 )
          return url + "&" + params;
        else
          return url + "?" + params;
      }
    
      if( isUndefined(encode) ) encode = true;
      
      var url = this.baseUrl + this.path;
      return (this.method.toLowerCase() == 'get')? 
                appendJsonToUrl(url,this.payload) :
                url;
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
      params.headers = Object.assign(params.headers, additionalHeaders);

      if( this.method.toLowerCase() != 'get' )
        params.payload = JSON.stringify(this.payload);

      return params;
    }
  }
});