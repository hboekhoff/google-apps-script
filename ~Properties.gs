function Properties() {
  function init(props,args) {
    props._f = [];
    for( var cnt = 0 ; cnt < args.length ; cnt++ ) {
      var prop = args[cnt];
      props._f.push(prop);
      if( prop.name !== "" ) props[prop.name] = prop;
    }
  }

  this.checkInitialValues = function() {
    var uninitialized = [];
    for( var cnt = 0 ; cnt < this._f.length ; cnt++ )
      if( !this._f[cnt].hasValue() && this._f[cnt].allowInputDialog ) 
        uninitialized.push(this._f[cnt]);
        
     if( uninitialized.length > 0 ) 
       showPropertiesDialog(uninitialized);
  };

  this.editPropertyValues = function(title,customHandlerName) {
    var props = [];
    for( var cnt = 0 ; cnt < this._f.length ; cnt++ )
      if( Globals.DEVELOPER_MODE || this._f[cnt].allowInputDialog ) 
        props.push(this._f[cnt]);
        
     if( props.length > 0 ) 
       showPropertiesDialog(title, props, customHandlerName);
  };

  init(this,arguments);
}




#########################################
#########################################
#########################################
#########################################
#########################################

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
  }

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
