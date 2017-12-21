function Field(accessor, label, name, formatFunction, numberFormat) {
  function toAccessorArray(a) {
    var aa;
    if( isString(a) ) 
      aa = a.split(",");
    else if( isArray(a) )
      aa = a;
    else if( isFunction(a) )
      aa = [a];
    else
      return [];
 }
  
  function prepareAccessor() {
    var aacc = toAccessorArray(accessor);
    var result = [];
    for( var cnt = 0 ; cnt < aacc.length ; cnt++ ){
      if( isArray(aacc[cnt]) ) {
        
      }
      else
          result.pop(aacc[cnt]);
    }
   
  
    var aacc;
    if( isString(accesso) ) 
      aacc = accessor.split(",");
    else if( isArray(accessor) )
      aacc = accessor;
    else if( isFunction(accessor) )
      aacc = [accessor];
    else
      return [];


    
  }
  
  
  this.name = name;
  this.label = label;
  this.numberFormat = numberFormat || this.numberFormat;
  this.formatFunction = formatFunction || this.formatFunction;
  
  
}

Object.defineProperties(Field.prototype, {
  label:
    {configurable:false,
     enumerable:true,
     value: undefined,
     writable:true
    },
  prop2:{configurable:true,
         enumerable:true,
         value: 3.1415265,
         //writable:false,
         //get:function(){return undefined;},
         //set:function(value){},
         },
  f:
    {configurable:false,
     enumerable:false,
     value: function(){for(var k in this) Logger.log(k + ':' + this[k]);},
     //writable:false,
     //get:function(){return undefined;},
     //set:function(value){},
    }
  
});

function testme() {
  var f = new Field(1,2,3,4,5);
  f.f();
}