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
    if( !isFunction(f) ) 
      return result;
  }
  catch(e) {
    LogData('executeIfExists - not executed',{functionName:functionName,message:e});
  }
  try {
    result.hasExecuted = true;
    result.returnValue = f.apply(thisValue, parameters); 
  }
  catch(e) {
    LogData('executeIfExists - execution error',{functionName:functionName,message:e});
    throw e;
  }
  return result;
}
function getCallPosition(up) {
  try{
    throw new Error();
  }
  catch(e) {
    return e.stack.split('\n')[(up || 0)+1].trim();
  }
}
