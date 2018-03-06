var TheJiraConnection = new JiraConnection();

var JiraFields = new Fields(
  new Field('key','key', 'Schlüssel', function(value){return '=HYPERLINK("https://sjira.funkemedien.de/browse/'+value+'";"'+value+'")';}),
  new Field('issuetype','fields.issuetype.name','Vorgangstyp'),
  new Field('customfield_12703','fields.customfield_12703.value', 'Kontingent'),
  new Field('customfield_10714','fields.customfield_10714.*.value', 'Quelle'),
  new Field('status','fields.status.name', 'Status'),
  new Field('customfield_10604','fields.customfield_10604.*.value', 'FD-Team'),
  new Field('customfield_10705','fields.customfield_10705', 'Epos-Verknüpfung',function(value){return isUndefined(value)?value:'=HYPERLINK("https://sjira.funkemedien.de/browse/'+value+'";"'+value+'")';}),
  new Field('timeoriginalestimate','fields.timeoriginalestimate', 'Ursprüngliche Schätzung', function(value){return value/86400;},'[h]:mm'),
  new Field('timeoriginalestimate', 'fields.aggregatetimeoriginalestimate', 'Ursprüngliche Schätzung inkl. Unteraufgaben', function(value){return value/86400;},'[h]:mm'),
  new Field('timeestimate', 'fields.timeestimate', 'Verbleibende Schätzung', function(value){return value/86400;},'[h]:mm'),
  new Field('aggregatetimeestimate', 'fields.aggregatetimeestimate', 'Verbleibende Schätzung inkl. Unteraufgaben', function(value){return value/86400;},'[h]:mm'),
  new Field('timespent', 'fields.timespent', 'Benötigte Zeit', function(value){return value/86400;},'[h]:mm'),
  new Field('aggregatetimespent', 'fields.aggregatetimespent', 'Benötigte Zeit inkl. Unteraufgaben', function(value){return value/86400;},'[h]:mm'),
  new Field('summary','fields.summary', 'Zusammenfassung'),
  new Field('comment', 
            ['fields.comment.comments.*',
             {'author': 'author.key',
              'time': 'created',
              'type': function(){return 'comment';},
              'description': 'body'
             }], 'Kommentar'),
// keine echten JIRA Felder - nur zur Ausgabe der aggregierten Daten
  new Field('bookingsToday', 'bookingsToday', 'gebucht', function(value){return value/86400;}), // in Datumsformat umrechnen
  new Field('bookingsTotal', 'bookingsTotal', 'insgesamt gebucht', function(value){return value/86400;}), // in Datumsformat umrechnen
  new Field('aggregatedActions','aggregated', 'Aktionen'),
  new Field('assignee','assignee', 'Bearbeiter'),

  new Field('issuedata',
            {'key':'key', 
             'issuetype':'fields.issuetype.name',
             'issuetypeicon':'fields.issuetype.iconUrl',
             'status':'fields.status.name',
             'statuscolor': 'fields.status.statusCategory.colorName',
             'originalestimate': ['fields.timeoriginalestimate',formatSecondsToHHmm],
             'timeestimate': ['fields.timeestimate',formatSecondsToHHmm],
             'timespent': ['fields.timespent',formatSecondsToHHmm],
             'aggregateoriginalestimate': ['fields.aggregatetimeoriginalestimate',formatSecondsToHHmm],
             'aggregatetimeestimate': ['fields.aggregatetimeestimate',formatSecondsToHHmm],
             'aggregatetimespent': ['fields.aggregatetimespent',formatSecondsToHHmm],
             'mytimespenttoday':['bookingsToday',formatSecondsToHHmm],
             'mytimespenttotal':['bookingsTotal',formatSecondsToHHmm],
             'assignee':'fields.assignee.displayName',
             'assigneeAvatar':'fields.assignee.avatarUrls.32x32'
             }, 'TicketInfoData', function(v){return JSON.stringify(v);})
);
