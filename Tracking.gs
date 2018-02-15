function getBookings() {
  var date = Globals.BookingDate.get('BookingDate').value;

  writeDate(date);

  getJiraBookings(date);
  getHarvestBookings(date);
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
  var bookings = fetchBookings(date);

  Output.writeTableHeader(Globals.MyTrackingSheet, Globals.REPORT_HEADER_ROW, Globals.HARVEST_FIRST_COLUMN, HarvestFields.BookingFields );
  Output.writeToTable(Globals.MyTrackingSheet, Globals.FIRST_REPORT_ROW, Globals.HARVEST_FIRST_COLUMN, bookings.day_entries, HarvestFields.BookingFields );
}

function getJiraBookings(date) {
   clearJiraContent();
try{
  var issues = TheJiraConnection.fetchIssuesByChangeDate(date,Globals.Properties.get('JiraProjects').value, JiraFields).issues;
  var user = RequestBasicAuthentification.readCache('JIRA').username;

  collectEvents(user, date, issues);
  issues = issues.filter(function(v){return v.bookingsToday > 0 || v.aggregated != ''});

  var oputputfields = JiraFields.getSubset('issuedata', 'key', 'summary', 'bookingsToday', 'aggregatedActions');
LogData(oputputfields);
  Output.writeTableHeader(Globals.MyTrackingSheet, Globals.REPORT_HEADER_ROW, Globals.JIRA_FIRST_COLUMN, oputputfields);
  Output.writeToTable(Globals.MyTrackingSheet, Globals.FIRST_REPORT_ROW, Globals.JIRA_FIRST_COLUMN, issues, oputputfields);
} catch(e) {
  LogData(e,true);
}
}

function collectEvents(user, date, issues) {
//LogData(issues);
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
//LogData(issue);
//  LogData(JiraFields.get('comment').extractFormattedValue( issue ));
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








