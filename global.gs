var Globals = new function () {
  this.Properties = new Properties(
    new Property('jiraDomain','JIRA Domain','https://sjira.funkemedien.de','Domain des JIRA-Systems.'),
    new Property('harvestDomain','Harvest Domain','https://funke.harvestapp.com','Domain des FunkeDigital Harvest Accounts.'),
    new Property('harvestAccountId','Harvest Account','706343','Account-ID des FunkeDigital Harvest Accounts.'),
    new Property('harvestPrivateKey','Harvest Key','','Authorisierungs-Schlüssel für den Zugriff auf Harvest.')
  );
  
}();
