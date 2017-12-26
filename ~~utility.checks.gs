function isObject(t) {
  return typeof t === 'object' && t.length === undefined;
}
function isArray(t) {
  return !isUndefined(t) && t.constructor === Array;
}
function isFunction(t) {
  return typeof t === 'function';
}
function isString(t) {
  return typeof t === 'string';
}
function isNumber(t) {
  return typeof t === 'number';
}

function isUndefined(t){
  return t == undefined || t == null;
}
function isEmpty(obj) {
  for( var x in obj )
    return false;
  return true;
}
