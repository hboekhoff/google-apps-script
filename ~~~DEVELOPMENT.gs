function clearPropertiesAndCaches() {
  var props = new Properties(
    new Property('userProperties', 'Properties', false,'checkbox', 'User Properties zurücksetzen'),
    new Property('documentProperties','',false,'checkbox', 'Document Properties zurücksetzen'),
    new Property('scriptProperties', '', false,'checkbox', 'Script Properties zurücksetzen'),
    new Property('userCache', 'User Cache', '', 'Kommaseparierte Liste der zu löschenden Cache-Keys'),
    new Property('documentCache', 'Document Cache', '', 'Kommaseparierte Liste der zu löschenden Cache-Keys'),
    new Property('scriptCache', 'Script Cache', '', 'Kommaseparierte Liste der zu löschenden Cache-Keys') );

    showPropertiesDialog('Gespeicherte Daten zurücksetzen', props, 'deletePropertiesAndCacheCallback');
}

function deletePropertiesAndCacheCallback(props) {
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
        
      case 'userCache':
        CacheService.getUserCache().removeAll(value.split(','));
        break;
      case 'documentCache':
         CacheService.getDocumentCache().removeAll(value.split(','));
         break;
      case 'scriptCache':
         CacheService.getScriptCache().removeAll(value.split(','));
        break;
    }
  }
  return false;
}
