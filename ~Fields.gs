function Fields() {
  var arr = isArray(this)? this : [];
  arr.push.apply(arr, arguments);
  arr._internalMap = arr.reduce(function(m,f){
                                  if( !isUndefined(f.name) ) 
                                    m[f.name] = f;
                                  return m;
                                },{});
  defineMissingMethods(arr,Fields.prototype);
  return arr;
}

Object.defineProperties(Fields.prototype, {
  get: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function(name) {
      return this._internalMap[name];
    }
  },
  filterByName: {
    enumerable:false,
    writable:false,
    configurable:false,
    value: function() {
      var names = isArray(arguments[0])? arguments[0] : arguments;
      return Fields.apply(this.filter(function(f){return names.indexOf(f.name)>=0;}));
    }        
  },
  getSubset: {
    enumerable:false,
    writable:false,
    configurable:false,
    value: function() {
      var names = isArray(arguments[0])? arguments[0] : arguments;
      var result = [];
      for( var cnt = 0 ; cnt < names.length ; cnt++ ) {
        var tmp = this._internalMap[names[cnt]];
        if( !isUndefined(tmp) )
          result.push(tmp);
      }
      return Fields.apply(result);
    }        
  },
  labels: {
    enumerable: false,
    configurable:false,
    get: function() {
      return this.map(function(v){return v.label;});
    }
  },
  names: {
    enumerable: false,
    configurable:false,
    get: function() {
      return this.map(function(v){return v.name;});
    }
  },
  extractValues: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function(obj) {
      return this.map(function(f){return f.extractValue(obj);});
    }    
  },
  extractFormattedValues: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function(obj) {
      return this.map(function(f){return f.extractFormattedValue(obj);});
    }    
  },
  mapValuesToObject: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(obj) {
      var result = {};
      for( var cnt = 0 ; cnt < this.length ; cnt++ ) {
        var f = this[cnt];
        result[f.name] = f.extractValue(obj);
      }
      return result;
    }
  },
  mapFormattedValuesToObject: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(obj) {
      var result = {};
      for( var cnt = 0 ; cnt < this.length ; cnt++ ) {
        var f = this[cnt];
        result[f.name] = f.extractFormattedValue(obj);
      }
      return result;
    }
  }
});
