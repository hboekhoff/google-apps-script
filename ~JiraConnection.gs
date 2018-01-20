function Jira(name,auth) {
  var jiraDomain = Globals.Properties.jiraDomain.value;
  this.connection = new Connection(jiraDomain);
  this.connection.name = name || 'JIRA';
  this.connection.authentification = auth || new RequestBasicAuthentification('rest/api/2/myself');
}
Object.defineProperties(Jira.prototype,{
	/*
	*  Parameters
	*     openedCallbackName: 
	*					openedCallbackName(connectionName,data)
	*     errorCallbackName: 
	*					errorCallbackName(connectionName,data)
	*/
  open: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(openedCallbackName,errorCallbackName,data) {
      return this.connection.open(openedCallbackName,errorCallbackName,data);
    }
  },
  execute: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(path,params,fields,expand,chunkSize) {
      params = params || {};
      var maxResults = params['maxResults'];
      params['maxResults'] = chunkSize || maxResults || 1000;
      params['expand'] = (params['expand'] || '') + ',' + (expand || ''); //+ ',names';

      if( !isUndefined(fields) )
        params['fields'] = fields.names;

      var data = this.connection.execute(path, 'get', params);

      if( !isUndefined(chunkSize) ) {
        if( isUndefined(maxResults) || maxResults > chunk.total )
          maxResults = chunk.total;
          
        var chunk = data;
        while( chunk.startAt + chunk.maxResults < maxResults ) {
          params.startAt = chunk.startAt + chunk.maxResults;
          if( startAt + chunkSize > maxResults )
            params['maxResults'] = maxResults - startAt;
          chunk = Globals.JiraConnection.execute( path, 'get', params );
          data.issues = data.issues.concat(chunk.issues);
        }
      }
      return data;
    }
  },

  fetchIssuesByKey: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function(keys, fields) {
      return this.execute('api/2/search', 
                          {'jql': 'issuekey in (' + keys.join() + ')'},
                          fields);
    }
  }
  
  
});


