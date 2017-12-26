function Field(accessor, label, name, formatFunction, numberFormat) {
  this.accessor = accessor;
  this.name = name;
  this.label = label;
  this.numberFormat = numberFormat || this.numberFormat;
  this.formatFunction = formatFunction || this.formatFunction;
}

Object.defineProperties(Field.prototype, {
  accessor:
    { configurable:false,
      enumerable:true,
      value: undefined,
      writable:true
    },
  label:
    { configurable:false,
      enumerable:true,
      value: undefined,
      writable:true
    },
  name:
    { configurable:false,
      enumerable:true,
      value: undefined,
      writable:true
    },
  numberFormat:
    { configurable:false,
      enumerable:true,
      value: undefined,
      writable:true
    },
  formatFunction:
    { configurable:false,
      enumerable:false,
      value: function(v){return v;},
      writable:true,
    },
  extractValue:
    { configurable:false,
      enumerable:false,
      value: function(obj){
        return obj.getNestedValue(this.accessor);
      }
    },
  extractFormattedValue:
    { configurable:false,
      enumerable:false,
      value: function(obj){
        return this.formatFunction(this.extract(obj));
      }
    }
});
