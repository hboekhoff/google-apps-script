function Jira(name,auth) {
  var jiraDomain = Globals.Properties.jiraDomain.value;
  this.connection = new Connection(jiraDomain);
  this.connection.name = name || 'JIRA';
  this.connection.authentification = auth || new RequestBasicAuthentification('rest/api/2/myself');
}
Object.defineProperties(Jira.prototype,{
  execute: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(path, data, successHandlerName, errorHandlerName) {
      var customData = {'successHandler': successHandlerName,
                        'errorHandler': errorHandlerName};
      return this.connection.execute(path,'get',data,'Jira.onSuccess','Jira.onError',customData);
    }
  }

});
Object.defineProperties(Jira,{
  onSuccess: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function(name,responsecode,responseobj,customData) {
      
    }
  },
  onError {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function(name,responsecode,responsetext,customData) {
    }
  }
});
