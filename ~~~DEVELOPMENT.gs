/*  
 *   !!!  ACHTUNG   WICHTIGER HINWEIS  !!!
 * 
 *  Die Ausführungsreihenfolge entspricht der Reihenfolge, in der die Dateien angelegt wurden 
 *  bzw. der NICHT-APHABETISCH-SORTIERTEN Ansicht.
 *  Evtl. Abhängigkeiten müssen durch Ändern der Reihenfolge aufgelöst werden. 
 *  Dazu werden entweder Name und Inhalt zweier Dateien vertauscht oder die Dateien
 *  in der richtigne Reihenfolge neu angelegt.
 *
 */

// aktiviert vermehrtes Logging und in Dialogen werden zusätzliche Felder angezeigt 
DEVELOPER_MODE = true;


function DEV_createMenu() {
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu('DEVELOPMENT')
    .addItem('Alle Optionen...', 'DEV_editAllProperties')
    .addItem('Cache löschen...', 'DEV_clearPropertiesAndCaches');

  menu.addToUi();
}
function DEV_editAllProperties() {
  showPropertiesDialog('DEVELOPMENT - Alle Optionen', Property._allProperties);
}
function DEV_clearPropertiesAndCaches() {
  var props = new Properties(
    new Property('userProperties','checkbox','Properties','User Properties zurücksetzen',false),
    new Property('documentProperties','checkbox','','Document Properties zurücksetzen',false),
    new Property('scriptProperties','checkbox', '','Script Properties zurücksetzen',false),
    new Property('cache', 'Caches','text','Kommaseparierte Liste der zu löschenden Cache-Keys','') );

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
