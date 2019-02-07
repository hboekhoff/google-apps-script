function onOpen() {
 
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu('Report')
              .addItem('aktualisieren', 'startUpdateReport')
              .addSeparator()
              .addItem('Optionen ...', 'showPropertyDialog');
  menu.addToUi();

  if( DEVELOPER_MODE ) DEV_createMenu();
}


function showPropertyDialog() {
  showPropertiesDialog(null,Globals.Properties);
}

function startUpdateReport() {
  updateProjectReport();
}


