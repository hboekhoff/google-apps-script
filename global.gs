var Globals = new function () {
  this.DISABLE_HARVEST = true;

  this.JIRA_FIRST_COLUMN = 1;
  this.JIRA_LAST_COLUMN = 5;
  this.JIRA_TIME_COLUMN = 4;
  this.HARVEST_FIRST_COLUMN = this.JIRA_LAST_COLUMN + 2;
  this.HARVEST_LAST_COLUMN = this.HARVEST_FIRST_COLUMN + 4;
  this.HARVEST_TIME_COLUMN = this.HARVEST_LAST_COLUMN;
  this.REPORT_HEADER_ROW = 6;
  this.FIRST_REPORT_ROW = this.REPORT_HEADER_ROW + 1;
  this.JIRA_COMMENT_MAX_LENGTH = 50;


  this.Properties = new Properties(
    new Property('jiraDomain','text','JIRA Domain','Domain des JIRA-Systems.','https://sjira.funkemedien.de'),
    new Property('JiraProjects','text','JIRA Projekte','Kommaseparierte Liste der zu berücksichtigenden JIRA Projekte','FDC,FDH,FDSUPPORT,FDPB,FDA,FDB,FDCIT,FDNULL,FDEXTERN'),
    new Property('JiraMyActivityOnly','checkbox','Nur bearbeitete Tickets','Tickets ausblenden, die ich nicht selbst bearbeitet habe',false),
    new Property('JiraHideMonitis','checkbox','Monitis Meldungen ausblenden','Automatisch durch das Monitoring erzeugte und inzwischen geschlossene Tickets ausblenden',false),
    //new Property('harvestEnabled','checkbox','Harvest aktivieren',' ',true),
    new Property('harvestDomain','text','Harvest Domain','Domain des FunkeDigital Harvest Accounts.','https://funke.harvestapp.com'),
    new Property('harvestAccountId','text','Harvest Account','Account-ID des FunkeDigital Harvest Accounts.','706343'),
    new Property('harvestPrivateKey','text','Harvest Key','Authorisierungs-Schlüssel für den Zugriff auf Harvest.','')
  );
  this.BookingDate = new Properties( 
    new Property('BookingDate','date','Datum','Datum des betrachteten Arbeitstags')
  );  
  
  this.MyTrackingSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tracking');  
  this.TestSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('test');  
  
}();
