function JiraConnection(name,auth) {
  var jiraDomain = Globals.Properties.get('jiraDomain').value;
  jiraDomain += (jiraDomain.charAt(jiraDomain.length-1) == '/')? 'rest/' : '/rest/';
  this.connection = new Connection(jiraDomain);
  this.connection.name = name || 'JIRA';
  this.connection.authentification = auth || new RequestBasicAuthentification('api/2/myself');
}
Object.defineProperties(JiraConnection.prototype,{
  /*
  *  Syntax
  *   open([openedCallbackName[,errorCallbackName[,data]]])
  *
  *  Parameters
  *     openedCallbackName: 
  *         openedCallback(this.connection.name,data)
  *     errorHandlerName: 
  *         errorHandler(this.connection.name,messageCode,messageText,data)
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
  *     fields:    a list of Field objects to determine the returned JIRA fields
  *     expand:    a string to apply the JIRA expand option
  *     chunkSize: used to limit the number of results per API-call (see Remarks)
  *
  *  Renarks
  *     In some cases, the JIRA API seems to have a limited output size. This leads to a capped
  *     result-streams containing incomplete JSON strings. Since the capped JSON string cannot be 
  *     processec the operation will fail, even if the original JIRA API-call was successfull.
  *     On this occasion use the chunkSize parameter to limit the number of results per API-call. 
  *     If the chunkSize parameter is provided, the function will automatically loop over 
  *     as many API-calls as necessary to collect and return the full result.
  */
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
          chunk = this.connection.execute( path, 'get', params );
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


