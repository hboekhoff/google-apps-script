function getHashCode(data){
  var sdata = JSON.stringify(data);
  if (sdata.length == 0) return 0;

  return sdata.split().reduce(function(p,c){
                                var code = c.charCodeAt(0);
                                p = ( (p<<5) - p ) + code;
                                return p &= p; // Convert to 32bit integer
                              }, 0);
}

function include(filename, data) {
  var result;
  if( isUndefined(data) ) {
    result = HtmlService.createHtmlOutputFromFile(filename).getContent();
  }
  else {
    var template = HtmlService.createTemplateFromFile(filename);
    template.data = data;
    result = template.evaluate().getContent();
  }
  return result;
}

function pushCustomData(data) {
  var key = Utilities.getUuid();
  CacheService.getUserCache().put(key,JSON.stringify(data),3600);
  return key;
}
function popCustomData(key,remove) {
  var data = CacheService.getUserCache().get(key);
  if( !isUndefined(data) ) {
    data = JSON.parse(data);
    if(remove) CacheService.getUserCache().remove(key);
  }
  return data;
}

function ensureFunctionName(name) {
  if( !isUndefined(name) && name != "" && isFunction(eval(name)) ) 
  return name;
  return 'dummyFunction';
}
function dummyFunction() {
  return true;
}
