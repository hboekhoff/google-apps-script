function Field(name, accessor, label, formatFunction, numberFormat) {
  this.accessor = accessor;
  this.name = name;
  this.label = label;
  this.numberFormat = numberFormat;
  this.formatFunction = formatFunction || this.formatFunction;
}

Object.defineProperties(Field.prototype, {
  numberFormat: { 
    configurable:false,
    enumerable:true,
    value: undefined,
    writable:true
  },
  formatFunction: { 
    configurable:false,
    enumerable:false,
    writable:true,
    value: function(v){return v;}
  },
  extractValue: { 
    configurable:false,
    enumerable:false,
    writable:false,
    value: function(obj){
      return obj.getNestedValue(this.accessor);
    }
  },
  extractFormattedValue: { 
    configurable:false,
    enumerable:false,
    writable:false,
    value: function(obj){
      return this.formatFunction(this.extractValue(obj));
    }
  }  
});
