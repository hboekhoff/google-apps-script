function test_exportProjects() {
  exportProjectIssues('FDC','jira-tickets');
  exportProjectIssues('FDSUPPORT','jira-tickets',true);
  exportProjectIssues('FDA','jira-tickets',true);
  exportProjectIssues('FDB','jira-tickets',true);
  exportProjectIssues('FDO','jira-tickets',true);
  exportProjectIssues('FDV','jira-tickets',true);
  exportProjectIssues('FDH','jira-tickets',true);
  exportProjectIssues('FDF','jira-tickets',true);
  exportProjectIssues('FUNBDF','jira-tickets',true);
  exportProjectIssues('FDCIT','jira-tickets',true);
}
function test_exportOldProjects() {
  exportProjectIssues('FUNT','old-jira-tickets');
  exportProjectIssues('FUNE','old-jira-tickets',true);
  exportProjectIssues('FUNEX','old-jira-tickets',true);
}

function exportProjectIssues(projectkey,sheetname,append) {
  sheetname = sheetname || projectkey;
  fields = JiraFields.getSubset('key','issuetype','created','status','timeoriginalestimate',
                                'timeoriginalestimate','timeestimate','aggregatetimeestimate',
                                'timespent','aggregatetimespent','summary',
                                'resolution','resolutiondate', 'project');
    
  var issues = TheJiraConnection.fetchProjectIssues(projectkey,fields).issues;

  var outSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetname) ||
                 SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetname);  
  
  if(append == true) {
    var row = outSheet.getDataRange().getLastRow() + 1;
    if( row == 1 ) 
      Output.writeTableHeader(outSheet,row++,1,fields);
    Output.writeToTable(outSheet,row,1,issues,fields);
  }  
  else {
    Output.clearSheet(outSheet);
    Output.writeTableHeader(outSheet,1,1,fields);
    Output.writeToTable(outSheet,2,1,issues,fields);
  }
}
