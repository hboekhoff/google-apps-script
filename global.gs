var Globals = new function () {
  function getSheet(name) {
    return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name) ||
           SpreadsheetApp.getActiveSpreadsheet().insertSheet(name);
  }

  this.Properties = new Properties(
    new Property('JiraDomain','text','JIRA Domain','Domain des JIRA-Systems.','https://sjira.funkemedien.de'),
    new Property('JiraProjects','text','JIRA Projekte','Kommaseparierte Liste der zu berücksichtigenden JIRA Projekte',''),
    new Property('JiraEpics','text','JIRA Epics','Kommaseparierte Liste der zu berücksichtigenden JIRA Epics','')
  );
  
  this.ReportSheet = getSheet('Report');  
  this.TrackingSheet = getSheet('Zeiterfassung');  
  //this.TestSheet = getSheet('test');  
  
}();
