function updateProjectReport() {
  var epics = getProjectData(Globals.Properties.get('JiraProjects').value, 
                             Globals.Properties.get('JiraEpics').value);

  updateReportSheet(epics);
  updateTrackingSheet(collectBookingData(epics));
}

function getProjectData(projects, epicKeys) {
  var fields = JiraFields.getSubset('project','key','summary','assignee','status','aggregatetimeestimate','aggregatetimespent','worklog', 'customfield_10705', 'customfield_10706');
  var epics = getEpics(projects, epicKeys, fields);

  for( var cnt = 0 ; cnt < epics.length ; cnt++ ) 
    epics[cnt].connectedIssues = getTicketsForEpic(epics[cnt].key,fields);

  return epics;
}

function getEpics(projects, epicKeys, fields) {
  var issues;
  if( projects != '' ) 
    issues = TheJiraConnection.search("project in (" + projects + ") and issuetype=epos", fields).issues;
    
  if( epicKeys != '' ) {
    if( isUndefined(issues) ) {
      issues = TheJiraConnection.search("issuekey in (" + epicKeys + ") and issuetype=epos", fields).issues;
    }
    else {
      var keys = epicKeys.split(',').map(function(v){return v.trim();});
      // avoid duplicates in epicKeys Parameter
      issues.forEach(function(issue){
                       var ix = keys.indexOf(issue.key);
                       if(ix >= 0) keys.splice(ix,1);
                     });
      if( keys.length > 0  != '' )
        issues = issues.concat(TheJiraConnection.search("issuekey in (" + keys.join(',') + ") and issuetype=epos", fields).issues);
    }
  }
  return issues;
}

function getTicketsForEpic(epic, fields) {
  var issues = TheJiraConnection.search("cf[10705]=" + epic, fields,"changelog").issues;
  return issues;
}



function collectBookingData(epics) {
  var bookings = new BookingSummary();
  for ( var cnt = 0 ; cnt < epics.length ; cnt++ ) {
    bookings.addWorklogs(epics[cnt].connectedIssues, epics[cnt] );
  }
  return bookings;
}

function updateReportSheet(epics) {
  var epicDisplayFields = JiraFields.getSubset('key','EMPTY', 'summary','assignee','status');
  var subTicketDisplayFields = JiraFields.getSubset('EMPTY', 'key','summary','assignee','status','aggregatetimeestimate','aggregatetimespent');

  Globals.ReportSheet.clearContents();
  Output.writeTableHeader(Globals.ReportSheet,1,1,subTicketDisplayFields);
  //Globals.ReportSheet.getRange(1,epicDisplayFields.length+1,1,2).setValues([['','']])
  
  var rowCount = 2;
  for( var cnt = 0 ; cnt < epics.length ; cnt++ ) {
    if( epics[cnt].connectedIssues.length > 0 ) {
      writeEpicLine(rowCount++,epics[cnt],epicDisplayFields);
      Output.writeToTable(Globals.ReportSheet,rowCount,1,epics[cnt].connectedIssues,subTicketDisplayFields);
      rowCount += epics[cnt].connectedIssues.length + 1;
    }
  }
}

function updateTrackingSheet(bookings) {
  Globals.TrackingSheet.clearContents();

  Output.writeTableHeader(Globals.TrackingSheet,1,1,bookings.Fields);
  Globals.TrackingSheet.getRange(1,bookings.Fields.length+1,1,4).setValues([['KST Nr. NEU','Plst. Nr.','Position','Pers.- Nr.']]);
  
  if( bookings.length > 0 ) {
    Output.writeToTable(Globals.TrackingSheet,2,1,bookings,bookings.Fields);
    
    Globals.TrackingSheet.getRange(2,bookings.Fields.length+1,bookings.length,1).setFormulaR1C1('=VLOOKUP(RC9;Personaldaten;4;false)');
    Globals.TrackingSheet.getRange(2,bookings.Fields.length+2,bookings.length,1).setFormulaR1C1('=VLOOKUP(RC9;Personaldaten;5;false)');
    Globals.TrackingSheet.getRange(2,bookings.Fields.length+3,bookings.length,1).setFormulaR1C1('=VLOOKUP(RC9;Personaldaten;6;false)');
    Globals.TrackingSheet.getRange(2,bookings.Fields.length+4,bookings.length,1).setFormulaR1C1('=VLOOKUP(RC9;Personaldaten;7;false)');
  }
}

function writeEpicLine(row, epic, fields) {
  Output.writeToTable(Globals.ReportSheet,row,1,[epic],fields);
  Globals.ReportSheet.getRange(row,fields.length+1,1,2).setFormulaR1C1("=sum(R[1]C:R[" + epic.connectedIssues.length + "]C)");
}




