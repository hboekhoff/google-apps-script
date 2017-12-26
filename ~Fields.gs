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
  }
});
