function _xx(accessor, label, name, formatFunction, numberFormat) {
  this.label = label;
  Logger.log('constructor');
  Logger.log(this.label);
  Logger.log(this.prop2);
  
  for( var key in this ) {
    Logger.log(key + ':' + this[key]);
  }
  Logger.log('constructor done');
  this.prop2 = 4;
}
Object.defineProperties(_xx.prototype, {
  label:{configurable:false,
        enumerable:true,
        value: undefined,
        writable:true,
        //get:function(){return undefined;},
        //set:function(value){},
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