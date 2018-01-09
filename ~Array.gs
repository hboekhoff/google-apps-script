Object.defineProperties(Array.prototype,{
  fill: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function(v) {
      for( var cnt = this.length ; cnt-- > 0 ; this[cnt] = v );
      return this;
    } 
  }
});