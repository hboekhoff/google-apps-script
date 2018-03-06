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
    value: function(path,method,params) {
      method = method || 'get';
      params = params || {};

      var data = this.connection.execute(path, method, params);
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
  },
  createTimeEntry: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(projectid,taskid,hours,notes,date) {
      var path = "daily/add";
      var data = {'notes': notes,
                  'hours': hours,
                  'project_id': projectid,
                  'task_id': taskid,
                  'spent_at': formatDate(new Date(date || new Date()), 'YYYY-MM-dd')
                 };
      try {
        this.execute( path, 'post', data);
      }
      catch(e) {
        LogData('can not create harvest booking',e);
        throw e;
      }
    }
  },
  updateTimeEntry: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(id, projectid, taskid, hours, notes, date) {
      var path = "daily/update/" + id;
      var params = { 'project_id': projectid,
                     'task_id': taskid,
                     'notes': notes,
                     'spent_at': formatDate(new Date(date),'YYYY-MM-dd'),
                     'hours': hours };
      try {
        return this.execute( path, 'post', params );
      }
      catch(e) {
        LogData('can not update harvest booking',e);
        throw e;
      }
    }
  },
  deleteTimeEntry: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(id) {
      var path = "daily/delete/" + id;
      try {
        this.execute( path, 'delete' );
      }
      catch(e) {
        LogData('can not delete harvest booking',e);
        throw e;
      }
    }
  },
  fetchTimeEntry: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(id) {
      var path = 'daily/show/' + id;
      try {
        return this.execute( path, 'get' );
      }
      catch(e) {
        LogData('can not retrieve harvest booking',e);
        //throw e;
      }
    }
  }
});
