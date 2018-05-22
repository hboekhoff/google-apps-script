function autoCloseRecoveredMonitisMessages() {
  var started = new Date();
  var issues = getRecoveredMonitisIssues();
  
  LogData('erledigte Monitis-Meldungen',issues,true);

  for( var cnt = 0 ; cnt < issues.length ; cnt++ ) {
    var key = issues[cnt].key;
    doTransitionEdit(key);
    doTransitionClose(key);
  }
  var finished  = new Date();
  LogData('erledigte Monitis-Meldungen', issues.length + ' Meldungen aufgeräumt in ' + new Date(finished - started).format('mm:ss,SSS') + ' Minuten.', true);
}

function getRecoveredMonitisIssues() {
  return TheJiraConnection.search('project = "fdsupport" and status = "neu" and ((summary ~ "\\\\[Monitis: PROBLEM\\\\]" and description ~ "| RECOVERY |") or summary ~ "\\\\[Monitis: RECOVERY\\\\]")', JiraFields.getSubset('key')).issues;
}
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

