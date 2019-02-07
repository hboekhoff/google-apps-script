var TheJiraConnection = new JiraConnection();

var JiraFields = new Fields(
  new Field('key','key', 'Schlüssel', function(value){return '=HYPERLINK("https://sjira.funkemedien.de/browse/'+value+'";"'+value+'")';}),
  new Field('issuetype','fields.issuetype.name','Vorgangstyp'),
  new Field('customfield_12703','fields.customfield_12703.value', 'Kontingent'),
  new Field('customfield_10714','fields.customfield_10714.*.value', 'Quelle'),
  new Field('creator','fields.creator.name', ''),
  new Field('created','fields.created', 'Erstellt', function(value){return formatDate(value,'yyyy-MM-dd HH:mm:ss');}),
  new Field('reporter','fields.reporter.name', 'Reporter'),
  new Field('status','fields.status.name', 'Status'),
  new Field('customfield_10604','fields.customfield_10604.*.value', 'FD-Team'),
  new Field('customfield_10705','fields.customfield_10705', 'Epos-Verknüpfung',function(value){return isUndefined(value)?value:'=HYPERLINK("https://sjira.funkemedien.de/browse/'+value+'";"'+value+'")';}),
  new Field('customfield_10706','fields.customfield_10706', 'Epos-Name'),
  new Field('timeoriginalestimate','fields.timeoriginalestimate', 'Ursprüngliche Schätzung', function(value){return value/86400;},'[h]:mm'),
  new Field('aggregatetimeoriginalestimate', 'fields.aggregatetimeoriginalestimate', 'Ursprüngliche Schätzung inkl. Unteraufgaben', function(value){return value/86400;},'[h]:mm'),
  new Field('timeestimate', 'fields.timeestimate', 'Verbleibende Schätzung', function(value){return value/86400;},'[h]:mm'),
  new Field('aggregatetimeestimate', 'fields.aggregatetimeestimate', 'Verbleibende Schätzung inkl. Unteraufgaben', function(value){return value/86400;},'[h]:mm'),
  new Field('timespent', 'fields.timespent', 'Benötigte Zeit', function(value){return value/86400;},'[h]:mm'),
  new Field('aggregatetimespent', 'fields.aggregatetimespent', 'Benötigte Zeit inkl. Unteraufgaben', function(value){return value/86400;},'[h]:mm'),
  new Field('summary','fields.summary', 'Zusammenfassung'),
  new Field('description','fields.description', 'Beschreibung'),
  new Field('resolution','fields.resolution.name', 'Lösung'),
  new Field('resolutiondate','fields.resolutiondate', 'Lösungsdatum',  function(value){return formatDate(value,'yyyy-MM-dd HH:mm:ss');}),
  new Field('project','fields.project.name', 'Projekt'),
  new Field('assignee','fields.assignee.displayName', 'Bearbeiter'),
  new Field('worklog','fields.worklog', 'Arbeitsprotokoll'),
  new Field('worklogSummary',
            ['fields.worklog.worklogs.*',
             {'author':'author.name',
              'authorName':'author.displayName',
              'authorEmail':'author.emailAddress',
              'started':'started',
              'timespent':'timeSpentSeconds',
              'comment':'comment'
             }], 
            'Arbeitsprotokoll')
);

var JiraChangelogFields = new Fields(
  new Field('changelog.histories.*', 'History') 
);

var JiraHistoryFields = new Fields(
  new Field('created', 'created', 'Erstellt', function(value){return formatDate(value,'yyyy-MM-dd HH:mm:ss');}),
  new Field('createdDate', 'created', 'ErstelltDatum', function(value){return formatDate(value,'yyyy-MM-dd');})
);

