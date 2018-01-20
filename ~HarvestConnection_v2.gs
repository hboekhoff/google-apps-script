function HarvestConnection_v2(name,auth) {
  var harvestPrivateKey = Globals.Properties.get('harvestPrivateKey').value;
  var harvestAccountId = Globals.Properties.get('harvestAccountId').value;

  this.connection = new Connection('https://api.harvestapp.com/v2/');
  this.connection.name = name || 'Harvest';
  this.connection.authentification = auth || 
                                     new PrivateTokenAuthentification(harvestPrivateKey,
                                                                      {'Harvest-Account-Id': harvestAccountId,
                                                                       'User-Agent': 'FunkeDigital Automation'}
                                                                     );
}
Object.defineProperties(HarvestConnection_v2.prototype,{
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
    value: function() {
    
    }
  },
  
  fetchProjects: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(userid) {
      // 1. /v2/users/{USER_ID}/project_assignments
    }
  },
  fetchTimeEntries: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(userid) {
    }
  },
  updateTimeEntry: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(userid) {
    }
  },
  createTimeEntry: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(userid) {
    }
  },
  deleteTimeEntry: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(userid) {
    }
  },
  
  

});
