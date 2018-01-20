function HarvestConnection_v1(name,auth) {
  var harvestDomain = Globals.Properties.get('harvestDomain').value;
  if( harvestDomain.charAt(harvestDomain.length-1) != '/' )
    harvestDomain += '/';
  this.connection = new Connection(harvestDomain);
  this.connection.name = name || 'Harvest';
  this.connection.authentification = auth || new RequestBasicAuthentification('account/who_am_i');
}
Object.defineProperties(HarvestConnection_v1.prototype,{
  /*
  *  Parameters
  *     openedCallbackName: 
  *					openedCallback(this.connection.name,data)
  *     errorHandlerName: 
  *					errorHandler(this.connection.name,messageCode,messageText,data)
  */
  open: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(openedCallbackName,errorCallbackName,data) {
      return this.connection.open(openedCallbackName,errorCallbackName,data);
    }
  },
    
  /*
  *  Syntax
  *   execute(path[,params,[fields,[expand[,chunkSize]]]])
  *
  *  Parameters
  *     path:      the relative path to the api-call (e.g. https://jiradomain/rest/<path>)
  *     params:    an object with a key-value set of JIRA parameters. See JIRA API reference 
  *                for more details
  *
  *  Renarks
  */
  execute: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(path,params) {
      params = params || {};

      var data = this.connection.execute(path, 'get', params);

      return data;
    }
  },
  
  whoAmI: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(path,params) {
      var path = 'account/who_am_i';
      return this.connection.execute(path, 'get');
    }
  }

});
