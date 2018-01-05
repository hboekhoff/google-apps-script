var CUSTOM_DATA_CACHE_DURATION = 300; // sekunden

function showLoginDialog(context,resumeHandlerName,abortHandlerName,checkHandlerName,username,customData) {
  var dialog = HtmlService.createTemplateFromFile('~Login.dialog');

  var cachekey = Utilities.getUuid();
  CacheService.getUserCache().put(cachekey, 
                                  JSON.stringify(customData), 
                                  CUSTOM_DATA_CACHE_DURATION);  

  dialog.data = {'context':context,
                 'checkHandler': checkHandlerName,
                 'resumeHandler': resumeHandlerName,
                 'abortHandler': abortHandlerName,
                 'customData': cachekey };
  dialog.username = username;
  dialog = dialog.evaluate()
                 .setWidth(300)
                 .setHeight(150);

  SpreadsheetApp.getUi().showModalDialog(dialog, context + ' Anmeldung');
}
function loginDialogOnOkButton(context,user,password,checkHandler,cachekey) {
  var customData = CacheService.getUserCache().get(cachekey);
  if( !isUndefined(customData) )
    customData = JSON.parse(customData);

  var result = executeIfExists(checkHandler,null,[context,user,password,customData]);

  if( !isUndefined(customData) )
    CacheService.getUserCache().put(cachekey,
                                    JSON.stringify(customData),
                                    CUSTOM_DATA_CACHE_DURATION);

  if( result.hasExecuted && result.returnValue != true ) 
    return false;
  
  CacheService.getUserCache().put(cachekey+'u',user,CUSTOM_DATA_CACHE_DURATION);
  CacheService.getUserCache().put(cachekey+'p',password,CUSTOM_DATA_CACHE_DURATION);
  return true;
}
function loginDialogOnSuccess(context,persist,resumeHandler,cachekey) {
  var user = CacheService.getUserCache().get(cachekey+'u');
  var password = CacheService.getUserCache().get(cachekey+'p');
  var customData = CacheService.getUserCache().get(cachekey);

  if( !isUndefined(customData) )
    customData = JSON.parse(customData);

  executeIfExists(resumeHandler,null,[context,user,password,persist,customData]);

  CacheService.getUserCache().removeAll([cachekey,cachekey+'u',cachekey+'p']);
}
function loginDialogOnCancelButton(context,abortHandler,cachekey) {
  var customData = CacheService.getUserCache().get(cachekey);
  CacheService.getUserCache().remove(cachekey);

  if( !isUndefined(customData) )
    customData = JSON.parse(customData);

  executeIfExists(abortHandler,null,[context,customData]);
}