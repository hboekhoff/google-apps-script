function autoCloseRecoveredMonitisMessages() {
  autoCloseIssues('project = "fdsupport" and status = "neu" and ((summary ~ "\\\\[Monitis: PROBLEM\\\\]" and description ~ "| RECOVERY |") or summary ~ "\\\\[Monitis: RECOVERY\\\\]")',
                  'erledigte Monitis-Meldungen');
}
function autoClosePruefroutineMessages() {
  autoCloseIssues('project = "fdsupport" and status = "neu" and summary ~ "Funke NORD Prüfroutine" and summary ~ "keine fehler"',
                  'Prüfroutine Meldungen "Keine Fehler"');
}
function autoCloseIssues(jql,message) {
  var started = new Date();
  var fields = JiraFields.getSubset('key');
  var issues = TheJiraConnection.search(jql, fields).issues;

  LogData(message,issues.map(function(issue){return fields[0].extractFormattedValue(issue)}),true);
  
  for( var cnt = 0 ; cnt < issues.length ; cnt++ ) {
    var key = issues[cnt].key;
    doTransitionEdit(key);
    doTransitionClose(key);
  }
  var finished = new Date();
  LogData(message, issues.length + ' Tickets aufgeräumt in ' + new Date(finished - started).format('mm:ss,SSS') + ' Minuten.', true);
}
/*
function getRecoveredMonitisIssues() {
  return TheJiraConnection.search('project = "fdsupport" and status = "neu" and ((summary ~ "\\\\[Monitis: PROBLEM\\\\]" and description ~ "| RECOVERY |") or summary ~ "\\\\[Monitis: RECOVERY\\\\]")', JiraFields.getSubset('key')).issues;
}
function getPruefroutineIssues() {
  return TheJiraConnection.search('project = "fdsupport" and status = "neu" and summary ~ "Funke NORD Prüfroutine" and summary ~ "keine fehler"', JiraFields.getSubset('key')).issues;
}
*/
function doTransitionEdit(key) {
  try {
    TheJiraConnection.doTransition(key, 51);
  }
  catch(e) {
    LogData('Error during edit-transition',{'key': key, 'message': e});
  }
}
function doTransitionClose(key){
  try {
    TheJiraConnection.doTransition(key, 71, 
                                   "Monitis Recovery - automatisch geschlossen.", 
                                   {"resolution": {"name": "Fertig"}}
                                  );
  }
  catch(e) {
    LogData('Error during close-transition',{'key': key, 'message': e});
  }
}

