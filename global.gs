var Globals = new function () {
  // aktiviert vermehrtes Logging und in Dialogen werden zusätzliche Felder angezeigt 
  this.DEVELOPER_MODE = true;
s  
  this.Properties = new Properties(
    new Property('jiraDomain','JIRA Domain','https://sjira.funkemedien.de','Domain des JIRA-Systems.')
  );
  
}();
