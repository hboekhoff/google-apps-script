function isObject(t) {
  return typeof t === 'object' && t.constructor != Array; //t.length === undefined;
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
function isDate(d) {
  return !isUndefined(d) && 
         d.constructor != undefined && 
         d.constructor.toString().substring(0,17) == 'function Date() {';
}

function isUndefined(t){
  return t == undefined || t == null;
}
function isEmpty(obj) {
  for( var x in obj )
    return false;
  return true;
}
