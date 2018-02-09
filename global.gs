var Globals = new function () {
  this.Properties = new Properties(
    new Property('jiraDomain','text','JIRA Domain','Domain des JIRA-Systems.','https://sjira.funkemedien.de'),
    new Property('harvestDomain','text','Harvest Domain','Domain des FunkeDigital Harvest Accounts.','https://funke.harvestapp.com'),
    new Property('harvestAccountId','text','Harvest Account','Account-ID des FunkeDigital Harvest Accounts.','706343'),
    new Property('harvestPrivateKey','text','Harvest Key','Authorisierungs-Schlüssel für den Zugriff auf Harvest.','')
  );
  
}();
