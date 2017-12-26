function Properties() {
  var arr = isArray(this)? this : [];
  arr.push.apply(arr, arguments);
  arr._internalMap = arr.reduce(function(m,p){
                                  if( !isUndefined(p.name) )
                                    m[p.name] = p;
                                  return m;
                                },{});
  defineMissingMethods(arr,Properties.prototype);
  return arr;
}

Object.defineProperties(Properties.prototype, {
  get: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function(name) {
      return this._internalMap[name];
    }
  },

  checkInitialValues: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function() {
      var uninitialized = this.reduce(function(p,c) {
                                        if(c.isVisible && c.hasValue) 
                                          p.push(c);
                                        return p;
                                      },[]);
       if( uninitialized.length > 0 ) 
         showPropertiesDialog(uninitialized);
    }
  }

});
