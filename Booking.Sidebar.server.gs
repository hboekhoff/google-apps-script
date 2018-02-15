function showBookingSidebar() {
  var sidebar = HtmlService.createTemplateFromFile('Booking.Sidebar');
  
  if( !Globals.DISABLE_HARVEST )
    //ToDo: sidebar.harvestProjects = toSimpleObjectArray(Harvest.getUserProjects(Harvest.getMyself().user.id), HarvestFields.clientprojecttasks);
    ;
  else
    sidebar.harvestProjects = [];
    
  LogData('sidebar.harvestProjects',sidebar.harvestProjects);

  var html = sidebar.evaluate().setTitle('Buchungen');
  
  SpreadsheetApp.getUi().showSidebar(html);
}

function getSidebarData(oldHashcode) {
  var bookingDate = Globals.BookingDate.get('BookingDate').value;
  var result;
  if( isUndefined(bookingDate) ) {
    result = {'type': 'notInitialized'};
  }
  else {
    result = getSelectedData();
    result['bookingDate'] = bookingDate;
  }
//LogData(result);
 var newHashcode = getHashCode(result);

  if( oldHashcode == newHashcode )
    return "unchanged";
  
  result["hashcode"] = newHashcode;
  return result;
}

function getSelectedData() {
  if( SpreadsheetApp.getActiveSheet().getName() != Globals.MyTrackingSheet.getName() )
    return {'type': 'none'};

  var active = Globals.MyTrackingSheet.getActiveRange();
  var row = active.getRow();
  var col = active.getColumn();
  
  if( row < Globals.FIRST_REPORT_ROW || 
      col > Globals.HARVEST_LAST_COLUMN || 
      col == Globals.JIRA_LAST_COLUMN + 1 ||
      active.getNumColumns() > 1 || 
      active.getNumRows() > 1 ) {
    return {'type': 'none'};
  }
  else if( col <= Globals.JIRA_LAST_COLUMN ) {
    return getSelectedJiraData(row);
  }
  else {
    return getSelectedHarvestData(row);
  }
}
function getSelectedJiraData(row) {
  var result = {};
  var data  = Globals.MyTrackingSheet.getRange(row,Globals.JIRA_FIRST_COLUMN,row,Globals.JIRA_LAST_COLUMN).getValues()[0];
  if( data[1] == '' ) {
    result['type'] = 'none';
  }
  else {
    result['type'] = 'jira';
    result['jira'] = JSON.parse(data[0]);
    result['jira']['summary'] = data[2];
  }
  return result;
}
function getSelectedHarvestData(row) {
  if( Globals.DISABLE_HARVEST ) return {'type':'none'};
  
  var result = {};
  var data  = Globals.MyTrackingSheet.getRange(row,Globals.HARVEST_FIRST_COLUMN,row,Globals.HARVEST_LAST_COLUMN).getValues()[0];
  if( data[0] == '' ) {
    result['type'] = 'none';
  }
  else {
    result['type'] = 'harvest';
    result['harvest'] = JSON.parse(data[0]);
  }
  return result;
}



// =======================================================
/* Click-Handler für Buttons der Sidebar */

function createJiraWorklog(data) {
  putJiraWorkLog(data.id,data.time,data.comment);
  //putJiraWorkLog('FUNT-10',data.time,data.comment);
  return false;
}

function createHarvestBooking(data) {
  if(Globals.DISABLE_HARVEST) throw "nicht aktiv.";

  createHarvestTimeEntry(data.projectid, data.taskid, data.hours, data.notes, data.spentat);
  return false;
}

function updateHarvestBooking(data) {
  if(Globals.DISABLE_HARVEST) throw "nicht aktiv.";

LogData('updateHarvest',data);
  updateHarvestTimeEntry(data.id, data.projectid, data.taskid, data.hours, data.notes, data.spentat);
  return false;
}

function deleteHarvestBooking(id) {
  if(Globals.DISABLE_HARVEST) throw "nicht aktiv.";

  deleteHarvestTimeEntry(id)
  return false;
}


