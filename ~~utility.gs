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
