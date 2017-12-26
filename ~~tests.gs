function ConstructorTest() {
  var arr = isArray(this)? this : [1,2,3];
  Array.prototype.push.apply(arr,arguments);
  defineMissingMethods(arr,ConstructorTest.prototype);
  return arr;
}

Object.defineProperty(ConstructorTest.prototype,'sum',{
                        enumerable:true,
                        get: function() {return this.reduce(function(p,c){return p+c;});}
                      });

function dotests() {
  var t = new ConstructorTest();
  Logger.log(t.sum);
  Logger.log(t);
  
  var u = ConstructorTest.apply([4,5,6]);
  Logger.log(u);
  Logger.log(u.sum);
} 