function getBookings() {
  var date = Globals.BookingDate.get('BookingDate').value;

  writeDate(date);
LogData('performance','start');
  getJiraBookings(date);
LogData('performance','jira');
  getHarvestBookings(date);
LogData('performance','harvest');
}

function writeDate(d) {
  var r = Globals.MyTrackingSheet.getRange(2,3,1,1);
  r.setValue(d);
}
function clearJiraContent() {
  Globals.MyTrackingSheet.getRange('A6:E').clearContent();
}
function clearHarvestContent() {
  Globals.MyTrackingSheet.getRange('G6:L').clearContent();
}
function getHarvestBookings(date) {
  if( Globals.DISABLE_HARVEST ) return;

  clearHarvestContent();
  var user = TheHarvestConnection_v1.whoAmI().user.id;
  //user = 1830688;
  var bookings = TheHarvestConnection_v2.fetchTimeEntries(user,date);

  Output.writeTableHeader(Globals.MyTrackingSheet, Globals.REPORT_HEADER_ROW, Globals.HARVEST_FIRST_COLUMN, HarvestFields_v2.TimeEntryFields );
  if( !isUndefined(bookings.time_entries) && bookings.time_entries.length > 0 )
    Output.writeToTable(Globals.MyTrackingSheet, Globals.FIRST_REPORT_ROW, Globals.HARVEST_FIRST_COLUMN, bookings.time_entries, HarvestFields_v2.TimeEntryFields );
}

function getJiraBookings(date) {
  clearJiraContent();
  try{
    var issues = TheJiraConnection.fetchIssuesByChangeDate(date,Globals.Properties.get('JiraProjects').value, JiraFields, 'changelog').issues;
    var user = RequestBasicAuthentification.readCache('JIRA').username;
    //user = 'a.kremin';

    collectEvents(user, date, issues);
    issues = issues.filter(function(v){return v.bookingsToday > 0 || v.aggregated != ''});
    var oputputfields = JiraFields.getSubset('issuedata', 'key', 'summary', 'bookingsToday', 'aggregatedActions');
    Output.writeTableHeader(Globals.MyTrackingSheet, Globals.REPORT_HEADER_ROW, Globals.JIRA_FIRST_COLUMN, oputputfields);
    Output.writeToTable(Globals.MyTrackingSheet, Globals.FIRST_REPORT_ROW, Globals.JIRA_FIRST_COLUMN, issues, oputputfields);
  } catch(e) {
    LogData(e,true);
  }
}

function collectEvents(user, date, issues) {
  for( var cnt = 0 ; cnt < issues.length ; cnt++ ) {
    collectEventsForIssue(user, date, issues[cnt]);
  }
}
function collectEventsForIssue(user, date, issue) {
  var anyEvents = !('true' == Globals.Properties.get('JiraMyActivityOnly').value);
  var collected = { bookingsToday: 0,
                    bookingsTotal: 0,
                    events: getComments(issue, user) || [],
                    assignments: []
                  };
  for( var cnt = 0 ; cnt < issue.changelog.histories.length ; cnt++ ) {
    var ev = issue.changelog.histories[cnt];
    collectBookings(user, date, ev, collected);
    collectStatusEvents(user, date, ev, collected);
    if( anyEvents || ( !isUndefined(ev.author) && ev.author.key == user ) )
      collectAssignmentEvents(user, date, ev, collected);
  }
  issue.aggregated = getAggregatedString(date, collected.events, collected.assignments);
  issue.bookingsToday = collected.bookingsToday;
  issue.bookingsTotal = collected.bookingsTotal;
}

function collectBookings(user, date, event, collector) {
  if( isModifiedBy( event, user ) ) {
    var timespent = getTimeSpent(event);
    collector.bookingsTotal += timespent;
    if( isSameDay(event.created, date) ) {
      collector.bookingsToday += timespent;
    }
  }
}
function collectStatusEvents(user, date, event, collector) {
  if( isModifiedBy( event, user ) && 
      isSameDay(event.created, date) ) {
    collector.events = collector.events.concat(getStatusChanges( event ));
  }
}
function collectAssignmentEvents(user, date, event, collector) {
  if( isSameDay(event.created, date) ) {
    for( var cnt = 0 ; cnt < event.items.length ; cnt++ ) {
      if( event.items[cnt].field == 'assignee' && 
         ( event.items[cnt].to == user || event.items[cnt].from == user ) ) {
        collector.assignments.push({'time':event.created, 
                                    'type':'assign', 
                                    'description': (event.items[cnt].fromString || '') + ' → ' + event.items[cnt].toString});
      }
    }
  }
}
function getStatusChanges( event ) {
  var changes = [];
  for( var cnt = 0 ; cnt < event.items.length ; cnt++ ) {
    if( event.items[cnt].field == 'status' )
      changes.push( {'time': event.created, 
                     'type':'status', 
                     'description': event.items[cnt].fromString + ' → ' + event.items[cnt].toString });
  }
  return changes;
}
function getComments( issue, user ) {
  var values = JiraFields.get('comment').extractFormattedValue( issue );
  if( isUndefined(values) ) return [];
  if( !isArray(values) ) values = [values];
  return values.filter(function(v){ return v.author == user });
}
function getAggregatedString(date, a1, a2 /*time:'', type: (comment|status|assign), description: '...'}, ...] */) {
  var aggregated = aggregateEvents(date, a1, a2);
  var result = '';
  for( var cnt = aggregated.length ; cnt-- ; result = '\n' + eventToString(aggregated[cnt]) + result );
  return result.substring(1);
}
function aggregateEvents(date, a1, a2 /*time:'', type: (comment|status|assign), description: '...'}, ...] */) {
  var actions = a1.concat(a2).filter(function(v){ return isSameDay(v.time,date);});
  actions.sort(function(a,b){return (a.time < b.time)? -1 : (a.time > b.time)? 1 : 0;});
  return actions;
}
function eventToString(e) {
  var result = formatDate(e.time,'HH:mm') + ' - ';
  switch(e.type) {
    case 'comment':
      result += ((e.description.length > Globals.JIRA_COMMENT_MAX_LENGTH)? e.description.substring(0,Globals.JIRA_COMMENT_MAX_LENGTH) +  ' ...' : e.description).replace(/[\r\n\t]/g, ' ');
      break;
    case 'assign':
      result += 'Zugewiesen:   ' + e.description;
      break;
    case 'status':
      result += 'Statusänderung:   ' + e.description;
      break;
  }
  return result;
}

function isModifiedBy(event, user) {
  return !isUndefined(event.author) && event.author.key == user;
}
function isAssignedTo(event, user) {
  for( var cnt = 0 ; cnt < event.items.length ; cnt++ )
    if( event.items[cnt].field == 'assignee' && event.items[cnt].to ==user )
      return true;
  return false;
}
function getTimeSpent( event ) {
  var sum = 0;
  for( var cnt = 0 ; cnt < event.items.length ; cnt++ )
    if( event.items[cnt].field == 'timespent' )
      sum += event.items[cnt].to - event.items[cnt].from;
  return sum;
}
function isSameDay( d1, d2 ) {
  return new Date(d1).setHours(0,0,0,0) == new Date(d2).setHours(0,0,0,0);
}



function initDocument() {
  if( !isUndefined( Globals.MyTrackingSheet ) ) return;

  var sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Tracking');

  // Kopfbereich
  setRangeProperties(sheet,1,1,Globals.REPORT_HEADER_ROW,null,'#d9d9d9');
  // Überschrift - JIRA
  setRangeProperties(sheet,
                     Globals.REPORT_HEADER_ROW,
                     Globals.JIRA_FIRST_COLUMN,
                     Globals.REPORT_HEADER_ROW,
                     Globals.JIRA_LAST_COLUMN,
                     '#6d9eeb','#ffffff','bold');
  // Überschrift - Harvest
  setRangeProperties(sheet,
                     Globals.REPORT_HEADER_ROW,
                     Globals.HARVEST_FIRST_COLUMN,
                     Globals.REPORT_HEADER_ROW,
                     Globals.HARVEST_LAST_COLUMN,
                     '#e06666','#ffffff','bold');
  // grauer Trennbalken
  setRangeProperties(sheet,
                     Globals.REPORT_HEADER_ROW,
                     Globals.JIRA_LAST_COLUMN+1,
                     null,
                     Globals.HARVEST_FIRST_COLUMN-1,
                     '#999999');
  // Zeitspalte - JIRA
  setRangeProperties(sheet,
                     Globals.FIRST_REPORT_ROW,
                     Globals.JIRA_TIME_COLUMN,
                     null,
                     Globals.JIRA_TIME_COLUMN,
                     '#cfe2f3','#0000ff','bold')
    .setNumberFormat('[h]:mm');
  // Zeitspalte - Harvest
  setRangeProperties(sheet,
                     Globals.FIRST_REPORT_ROW,
                     Globals.HARVEST_TIME_COLUMN,
                     null,
                     Globals.HARVEST_TIME_COLUMN,
                     '#f4cccc','#a61c00','bold')
    .setNumberFormat('[h]:mm');
  
  setRangeProperties(sheet,2,3,2,4,'#ffd966','#000000','bold')
    .merge()
    .setFontSize(18)
    .setNumberFormat('d". "mmmm" "yyyy')
    .setHorizontalAlignment('right')
    .setValue('gebucht');
  setRangeProperties(sheet,2,5,2,5,'#ffe599','#000000','bold')
    .setFontSize(18)
    .setNumberFormat('[h]:mm')
    .setFormulaR1C1('=sum(R[1]C:R[2]C)');
    
  setRangeProperties(sheet,3,3,3,4,'#6d9eeb','#ffffff','bold')
    .merge()
    .setHorizontalAlignment('right')
    .setValue('gebucht in JIRA');
  setRangeProperties(sheet,3,5,3,5,'#cfe2f3','#0000ff','bold')
    .setNumberFormat('[h]:mm')
    .setFormulaR1C1('=sum(R'+Globals.FIRST_REPORT_ROW+'C'+Globals.JIRA_TIME_COLUMN+':C'+Globals.JIRA_TIME_COLUMN+')');
  
  setRangeProperties(sheet,4,3,4,4,'#e06666','#ffffff','bold')
    .merge()
    .setHorizontalAlignment('right')
    .setValue('gebucht in Harvest');
  setRangeProperties(sheet,4,5,4,5,'#f4cccc','#a61c00','bold')
    .setNumberFormat('[h]:mm')
    .setFormulaR1C1('=sum(R'+Globals.FIRST_REPORT_ROW+'C'+Globals.HARVEST_TIME_COLUMN+':C'+Globals.HARVEST_TIME_COLUMN+')');
  
  setRangeProperties(sheet,1,1).setVerticalAlignment('top');
  
  sheet.setFrozenRows(Globals.REPORT_HEADER_ROW);
  sheet.hideColumns(Globals.JIRA_FIRST_COLUMN);
  sheet.hideColumns(Globals.HARVEST_FIRST_COLUMN);

  sheet.setColumnWidth(Globals.JIRA_FIRST_COLUMN+1,130);
    sheet.setColumnWidth(Globals.JIRA_FIRST_COLUMN+2,250);
  sheet.setColumnWidth(Globals.JIRA_TIME_COLUMN,60);
  sheet.setColumnWidth(Globals.JIRA_LAST_COLUMN,300);
  
  sheet.setColumnWidth(Globals.JIRA_LAST_COLUMN+1,10);
  
  sheet.setColumnWidth(Globals.HARVEST_FIRST_COLUMN+1,200);
  sheet.setColumnWidth(Globals.HARVEST_FIRST_COLUMN+2,100);
  sheet.setColumnWidth(Globals.HARVEST_FIRST_COLUMN+3,300);
  sheet.setColumnWidth(Globals.HARVEST_TIME_COLUMN,60);
}

function setRangeProperties(sheet,row1,col1,lastRow,lastCol,backColor,fontColor,fontWeight) {
  if( isUndefined(lastRow) || lastRow == -1 ) lastRow = sheet.getMaxRows();
  if( isUndefined(lastCol) || lastCol == -1 ) lastCol = sheet.getMaxColumns();

  var range = sheet.getRange(row1,col1,lastRow-row1+1,lastCol-col1+1);
  if( !isUndefined(backColor) ) range.setBackground(backColor);
  if( !isUndefined(fontColor) ) range.setFontColor(fontColor);
  if( !isUndefined(fontWeight) ) range.setFontWeight(fontWeight);
  
  return range;
}
