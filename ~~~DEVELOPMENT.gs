function DEV_clearPropertiesAndCaches() {
  var props = new Properties(
    new Property('userProperties', 'Properties', false,'checkbox', 'User Properties zurücksetzen'),
    new Property('documentProperties','',false,'checkbox', 'Document Properties zurücksetzen'),
    new Property('scriptProperties', '', false,'checkbox', 'Script Properties zurücksetzen'),
    new Property('cache', 'Caches', '', 'Kommaseparierte Liste der zu löschenden Cache-Keys') );

    showPropertiesDialog('Gespeicherte Daten zurücksetzen', props, 'DEV_deletePropertiesAndCacheCallback');
}

function DEV_deletePropertiesAndCacheCallback(props) {
  for( var cnt = 0 ; cnt < props.length ; cnt++ ) {
    var value = props[cnt].value;

    switch( props[cnt].name ) {
      case 'userProperties':
        if(value == true ) PropertiesService.getUserProperties().deleteAllProperties();
        break;
      case 'documentProperties':
        if(value == true ) PropertiesService.getDocumentProperties().deleteAllProperties();
        break;
      case 'scriptProperties':
        if(value == true ) PropertiesService.getScriptProperties().deleteAllProperties();
        break;
        
      case 'cache':
        CacheService.getUserCache().removeAll(value.split(','));
        CacheService.getDocumentCache().removeAll(value.split(','));
        CacheService.getScriptCache().removeAll(value.split(','));
        break;
    }
  }
  return false;
}
