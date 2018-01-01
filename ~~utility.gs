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
  var result = {isFunction:false,
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
  result.isFunction = true;
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
