function Jira() {
  var jiraDomain = Globals.Properties.jiraDomain.value;
  this.connection = new Connection(jiraDomain);
  this.connection.name = 'JIRA';
  this.connection.authentification = new RequestBasicAuthentification('rest/api/2/myself');
}
Object.defineProperties(Jira.prototype,{
  execute: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(path, data, successHandlerName, errorHandlerName) {
      var customData = {'successHandler': successHandlerName,
                        'errorHandler': errorHandlerName};
//      this.connection.execute(path,'get',data,'Jira.onSuccess
//    (path, method, payload, successHandlerName, errorHandlerName, customData) {
      
      
    
    }
  }

});