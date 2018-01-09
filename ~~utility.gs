function defineMissingMethods(dest,src) {
  var sp = Object.getOwnPropertyNames(src);
  var dp = Object.getOwnPropertyNames(dest);
  for( var cnt = 0 ; cnt < sp.length ; ++cnt ) {
    if( sp[cnt] != 'constructor' &&
        dp.indexOf(sp[cnt]) < 0 ) {
      var prop = Object.getOwnPropertyDescriptor(src,sp[cnt]);
      if( isFunction(prop.value || prop.get || prop.set) )
        Object.defineProperty(dest,sp[cnt],prop);
    }
  }
  return dest;
}
function executeIfExists(functionName,thisValue,parameters) {
  var result = {hasExecuted:false,
                returnValue:null};
  if( isUndefined(functionName) || functionName == '') return result;
  var f;
  try {
    f = eval(functionName);
    if( !isFunction(f) ) return result;
  }
  catch(e) {
    return result;
  }
  result.hasExecuted = true;
  result.returnValue = f.apply(thisValue, parameters); 
  return result;
}
function ensureFunctionName(name) {
  try {
    if( !isUndefined(name) && name != "" && isFunction(eval(name)) ) 
      return name;
  }
  catch(e) {
    // ignore
  }
  return 'dummyFunction';
}
function dummyFunction() {
  return true;
}
function getCallerFunction(up) {
  try{
    var x = x.run(); // force exception with stacktrace
  }
  catch(e) {
    up = (up || 0)+1;
    var off = e.stack.indexOf('(');
    while( off > 0 && up-- > 0 ) 
      off = e.stack.indexOf('(',off+1);
    if( off > 0 )
      return e.stack.substring(off+1,e.stack.indexOf(')',off+1));
  }
}
