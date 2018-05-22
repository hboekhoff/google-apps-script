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
    value: function(path,method,params,fields,expand,chunkSize) {
      method = method || 'get';
      params = params || {};
      var maxResults = params['maxResults'];
      params['maxResults'] = chunkSize || maxResults || 1000;
      params['expand'] = (params['expand'] || '') + ',' + (expand || ''); //+ ',names';

      if( !isUndefined(fields) )
        params['fields'] = fields.names;

      var data = this.connection.execute(path, method, params);

      if( !isUndefined(chunkSize) ) {
        var chunk = data;
        if( isUndefined(maxResults) || maxResults > chunk.total )
          maxResults = chunk.total;
          
        while( chunk.startAt + chunk.maxResults < maxResults ) {
          params.startAt = chunk.startAt + chunk.maxResults;
          if( params.startAt + chunkSize > maxResults )
            params['maxResults'] = maxResults - params.startAt;
          chunk = this.connection.execute( path, method, params );
          data.issues = data.issues.concat(chunk.issues);
        }
      }
      else if( !isUndefined(data.isLast) ) {
        var chunk = data;
        while( !chunk.isLast ) {
          params.startAt = chunk.startAt + chunk.maxResults;
          chunk = Globals.JiraConnection.execute( path, 'get', params );
          data.values = data.values.concat(chunk.values);
        }
        data.total = data.maxResults = data.values.length;
        data.isLast = true;
      }
      
      return data;
    }
  },
  
  search: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function(jql, fields, expand, chunkSize) {
      return this.execute('api/2/search', 'get', {'jql': jql}, fields, expand, chunkSize);
    }
  },

  fetchIssuesByKey: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function(keys, fields, expand) {
      if( isArray(keys) ) keys = keys.join(',');
      return this.search('issuekey in (' + keys + ')', fields, expand);
    }
  },
    
  fetchIssuesByChangeDate: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function(date,projects,fields,expand) {
      var d1 = new Date(date);
      var d2 = new Date(date);
      d2.setDate(d2.getDate() + 1)  ;
      
      var d1f = d1.format('YYYY-MM-dd');
      var d2f = d2.format('YYYY-MM-dd');
      var jql = '((updated >= ' + d1f + '  and updated < ' + d2f + ')' 
                + ' or (worklogdate >= ' + d1f + ' and worklogdate < ' + d2f + '))'
                + 'and project in(' + projects + ')';
      return this.search(jql, fields, expand, 50);
    }    
  },
  
  writeWorkLog: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(key,time,comment) {
      path = 'api/2/issue/' + key + '/worklog'
      var data = {'comment': comment,
                  'timeSpent': time
                 };
      try {
        var result = this.execute(path, 'post', data);
        return result;
      }
      catch(e) {
        throw this.decodeError(e,'<br/>');
      }
    }
  },  
  
  doTransition: {
    writable: false, 
    enumerable: false,
    configurable: false,
    value: function(key,transitionId,comment,fields) {
      path = 'api/2/issue/' + key + '/transitions'
      var data = { "transition": {"id":transitionId} };
      
      if( !isUndefined(comment) )
        data["update"] = { "comment": [{ "add": { "body": comment } }] };
      
      if( !isUndefined( fields) )
        data["fields"] = fields;

      try {
        var result = this.execute(path, 'post', data);
        return result;
      }
      catch(e) {
        throw this.decodeError(e,'<br/>');
      }
    }
  },

  decodeError: {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function(e,separator) {
      separator = separator || '\n';
      if( !isUndefined(e.message)) {
        try {
          var msg = JSON.parse(e.message);
          var msgstring = msg.errorMessages.join(separator);
          for( var k in msg.errors )
            msgstring += separator + ' ' + k + ': ' + msg.errors[k];
          return msgstring;
        }
        catch(e2) {
          return e.message;
        }
      }
      else {
        return e.toString();
      }
    }  
  }  
});


