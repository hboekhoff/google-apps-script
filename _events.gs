function onOpen() {
  initDocument();
  
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu('Tracking')
              .addItem('Heute gebucht', 'startLoadingToday')
              .addItem('Gebucht am ...', 'requestBookingDate')
              .addSeparator()
              .addItem('Sidebar anzeigen', 'showBookingSidebar')
              .addSeparator()
              .addItem('Optionen ...', 'showPropertyDialog');
  menu.addToUi();

  menu = ui.createMenu('Monitis')
              .addItem('Recoveries aufräumen', 'startCleanupRecovered');
  menu.addToUi();

  if( DEVELOPER_MODE ) DEV_createMenu();
}


function showPropertyDialog() {
  showPropertiesDialog(null,Globals.Properties);
}

function startLoadingToday() {
  Globals.BookingDate.get('BookingDate').value = formatDate(new Date(),'YYYY-MM-dd');
  loadDataStep1();
}
function requestBookingDate() {
  showPropertiesDialog('Arbeitstag',Globals.BookingDate,'startLoadingDate');
}
function startLoadingDate(data) {
  Globals.BookingDate.get('BookingDate').value = data[0].value;
  loadDataStep1();
  return false;
}

function loadDataStep1() {
  // Jira-Connection öffnen und bei Bedarf den Login-Dialog aufrufen
  TheJiraConnection.open('loadDataStep2');
}
function loadDataStep2() {
  // Harvest-Connection öffnen und bei Bedarf den Login-Dialog aufrufen
  if( Globals.DISABLE_HARVEST )
    getBookings();
  else
    TheHarvestConnection_v1.open('getBookings');
}

function startCleanupRecovered() {
  TheJiraConnection.open('autoCloseRecoveredMonitisMessages');
}
