var Globals = new function () {
  function getSheet(name,color) {
    return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name) ||
           SpreadsheetApp.getActiveSpreadsheet().insertSheet(name).setTabColor(color);
  }
  function addSheet(obj,name,label,color) {
    Object.defineProperty(obj,name,
                          { configurable:false,
                            enumerable:true,
                            // use eval to avoid closure
                            get:eval("function(){return getSheet('" + (label || name) + "','" + color + "')}")
                          });
  }

  this.Properties = new Properties(
    new Property('JiraDomain','text','JIRA Domain','Domain des JIRA-Systems.','https://sjira.funkemedien.de'),
    new Property('JiraProjects','text','JIRA Projekte','Kommaseparierte Liste der zu berücksichtigenden JIRA Projekte',''),
    new Property('JiraEpics','text','JIRA Epics','Kommaseparierte Liste der zu berücksichtigenden JIRA Epics','')
  );
  
  addSheet(this,'ReportSheet','Report','0000ff');  
  addSheet(this,'TrackingSheet','Zeiterfassung','aaaaff');  
  //addSheet(this,'TestSheet','test','000000');

}();
