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
    
      function getDataFieldName(d) {
        for( var k in d )
          if( ',page,total_pages,total_entries,next_page,previous_page,links,'.indexOf(','+k+',') < 0 )
            return k;
      }

      params = params || {};
      var page = params['page'];
      
      var data = this.connection.execute(path, 'get', params);
      
      if( data.total_pages > 1 && isUndefined(page) ) {
        var dataName = getDataFieldName(data);
        var chunk = data;
        while( chunk.page < chunk.total_pages ) {
          params.page = chunk.next_page;
          chunk = this.connection.execute(path, 'get', params);
          data[dataName] = data[dataName].concat(chunk[dataName]);
        }
        data.total_pages = 1;
        data.next_page = null;
        data.previous_page = null;
      }

      return data;
    }
  },

  whoAmI: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function() {
      return this.execute('users/me');
    }
  },
  
  fetchProjects: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(userid,forceRequest) {
      var cachekey = this.name + '_Harvest_v2.projects';
      var data;
      
      if( !forceRequest ) 
        data = CacheService.getUserCache().get(cachekey);
      if( !isUndefined(data) ) {
        data = JSON.parse(data);
      }
      else {
        var path = 'users/' + userid + '/project_assignments';
        data = this.execute(path,{per_page:1});
        CacheService.getUserCache().put(cachekey,JSON.stringify(data));
      }
      return data;
    }
  },
  fetchTimeEntries: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(userid,date) {
      var path = 'time_entries';
      var fromDate = new Date(date);
      var toDate = new Date(date);
      toDate.setDate(toDate.getDate() + 1);
      return this.execute(path,
                          {'user_id':userid,
                          'from': fromDate.format('YYYY-MM-dd'),
                          'to': toDate.format('YYYY-MM-dd')
                         });
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
