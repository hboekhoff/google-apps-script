// aktiviert vermehrtes Logging und in Dialogen werden zusätzliche Felder angezeigt 
var Globals = new function () {
  this.DEVELOPER_MODE = true;
  
  this.Properties = new Properties(
    new Property('jiraBaseUrl','JIRA Domain','https://sjira.funkemedien.de','Domain des JIRA-Systems.')
  );
  
}();
