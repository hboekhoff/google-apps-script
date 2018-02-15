var TheHarvestConnection_v1 = new HarvestConnection_v1();
var TheHarvestConnection_v2 = new HarvestConnection_v2();

var HarvestFields_v1 = new function() {
  this.ProjectFields = new Fields( new Field("project.id", "ProjektId", "id"),
                                   new Field("project.client_id", "ClientId", "clientId"),
                                   new Field("project.name", "Name", "name"),
                                   new Field("project.code", "Kuerzel", "code"),
                                   new Field("project.active", "Aktiv", "isActive"),
                                   new Field("project.created_at", "Erstellt", "created"),
                                   new Field("project.updated_at", "Geaendert", "modified"),
                                   new Field("project.starts_on", "Start", "startDate"),
                                   new Field("project.ends_on", "Ende", "endDate"),
                                   new Field("project.is_fixed_fee", "Festpreis", "fixedFee"),
                                   new Field("project.billable", "Abrechenbar", "isBillable"),
                                   new Field("project.hint_earliest_record_at", "Erste Aktivität", "firstRecord"),
                                   new Field("project.hint_latest_record_at", "Letzter Aktivität", "latestRecord"),
                                   new Field("project.notes", "Bemerkungen", "description")
                                 );
  this.ClientFields = new Fields( new Field("client.id", "Id", "id"),
                                  new Field("client.name", "Name", "name"),
                                  new Field("client.updated_at", "Geändert", "modified"),
                                  new Field("client.created_at", "Erstellt", "created")
                                );
  this.TeamFields = new Fields( new Field("user_assignment.id", "AssignmentId", "id"),
                                new Field("user_assignment.user_id", "UserId", "userId"),
                                new Field("user_assignment.project_id", "ProjektId", "projectId"),
                                new Field("user_assignment.is_project_manager", "PM", "projectManagerId"),
                                new Field("user_assignment.deactivated", "Inaktiv", "isInactive"),
                                new Field("user_assignment.created_at", "Erstellt", "created"),
                                new Field("user_assignment.updated_at", "Geaendert", "modified")
                              );
  this.UserFields = new Fields( new Field("user.id", "UserId", "id"),
                                new Field("user.email", "EMail", "email"),
                                new Field("user.created_at", "Erstellt", "created"),
                                new Field("user.is_admin", "Administrator", "isAdmin"),
                                new Field("user.first_name", "Vorname", "firstName"),
                                new Field("user.last_name", "Nachname", "lastName"),
                                new Field("user.is_contractor", "Freier_Mitarbeiter", "isContractor"),
                                new Field("user.telephone", "Telefon", "tele  phone"),
                                new Field("user.is_active", "Aktiv", "isActive"),           
                                new Field("user.department", "Abteilung", "department"),
                                new Field("user.updated_at", "Geaendert", "modified"),
                                new Field("user.is_project_manager", "PM", "isProjectManager"),
                                new Field("user.weekly_capacity", "Wochenstunden", "weeklyCapacity")
                              );

  this.TaskFields = new Fields( new Field("task.id", "TaskId", "id"),
                                new Field("task.name", "Name", "name"),
                                new Field("task.billable_by_default", "verrechenbar", "billableByDefault"),
                                new Field("task.created_at", "Erstellt", "created"),
                                new Field("task.updated_at", "Geaendert", "modified"),
                                new Field("task.is_defalt", "Standardaufgabe", "isDefault"),
                                new Field("task.default_hourly_rate", "Standard Stundensatz", "defaultHourlyRate")
                              );

  this.ReportEntryFields = new Fields( new Field("day_entry.id", "Id", "id"),
                                       new Field("day_entry.notes", "Bemerkungen", "description"),
                                       new Field("day_entry.notes", "JIRA Ticketnummer", "issueKey",function(value){return !isString(value)? value : value.indexOf('[#') != 0 ? '' : value.substring(2,value.indexOf(']'));}),
                                       new Field("day_entry.spent_at", "Buchungsdatum", "reportDate"),
                                       new Field("day_entry.hours", "Stunden", "hours"),
                                       new Field("day_entry.user_id", "UserId", "userId"),
                                       new Field("day_entry.user_id", "User", "user",function(value){return Harvest.getUsers()[value]}),
                                       new Field("day_entry.project_id", "ProjektId", "projectId"),
                                       new Field("day_entry.project_id", "Projekt", "project",function(value){return Harvest.getProjects()[value]}),
                                       new Field("day_entry.project_id", "Client", "client",function(value){return Harvest.getClients()[Harvest.getProjects()[value].clientId]}),
                                       new Field("day_entry.task_id", "AufgabenId", "taskId"),
                                       new Field("day_entry.task_id", "Aufgabe", "task",function(value){return Harvest.getTasks()[value]}),
                                       new Field("day_entry.created_at", "Erfasst", "created"),
                                       new Field("day_entry.updated_at", "Geaendert", "modified"),
                                       new Field("day_entry.adjustment_record", "Korrektur", "isAdjustment"),
                                       new Field("day_entry.is_closed", "Geschlossen", "isClosed"),
                                       new Field("day_entry.is_billed", "Abgerechnet", "isBilled")
                                     );

/*
  this.ProjectTaskFields = new Fields( new Field("task_assignment.project_id", "ProjektId", "project_id"),
                                       new Field("task_assignment.task_id", "TaskId", "task_id"),
                                       new Field("task_assignment.billable", "Verrechenbar", "billable"),
                                       new Field("task_assignment.deactivated", "Deaktiviert", "deactivated"),
                                       new Field("task_assignment.hourly_rate", "Stundensatz", "hourly_rate"),
                                       new Field("task_assignment.budget", "Budget", "budget"),
                                       new Field("task_assignment.id", "Id", "id"),
                                       new Field("task_assignment.created_at", "Erstellt", "created_at"),
                                       new Field("task_assignment.updated_at", "Geändert", "updated_at"),
                                       new Field("task_assignment.estimate", "Schätzung", "estimate")
                                     );
*/
  this.ProjectTaskFields = new Fields( new Field("task_assignment.task_id", "TaskId", "task_id"),
                                       //new Field(["task_assignment.task_id",function(v){return Harvest.getTasks()[v];}], "Task", "task"),
                                       new Field(["task_assignment.task_id",function(v){return Harvest.getTasks()[v].name;}], "Task-Name", "taskName"),
                                       new Field("task_assignment.billable", "Verrechenbar", "billable")
                                       //new Field("task_assignment.deactivated", "Deaktiviert", "deactivated"),
                                       //new Field("task_assignment.hourly_rate", "Stundensatz", "hourly_rate"),
                                       //new Field("task_assignment.budget", "Budget", "budget"),
                                       //new Field("task_assignment.id", "Id", "id"),
                                       //new Field("task_assignment.created_at", "Erstellt", "created_at"),
                                       //new Field("task_assignment.updated_at", "Geändert", "updated_at"),
                                       //new Field("task_assignment.estimate", "Schätzung", "estimate")
                                     );

  this.BookingFields = new Fields( new Field({'id':'id',
                                              'projectid': 'project_id',
                                              'taskid': 'task_id',
                                              'notes': 'notes',
                                              'hours': 'hours',
                                              'spentat': 'spent_at'
                                             }, "BookingInfoData", "bookingdata", function(v){return JSON.stringify(v);}), 
                                   //new Field("user_id", "UserId", "userId"),
                                   //new Field(["user_id", function(value){return Harvest.getUsers()[value]}], "User", "user"),
                                   //new Field("spent_at", "Buchungsdatum", "reportDate", function(v){return new Date(v);}),
                                   //new Field("created_at", "Erfasst", "created"),
                                   //new Field("updated_at", "Geändert", "modified"),
                                   //new Field("client", "Kunde", "client"),
                                   //new Field("project_id", "ProjektId", "projectId"),
                                   //new Field(["project_id", function(value){return Harvest.getProjects()[value]}], "Projekt", "project"),
                                   //new Field(["project_id", function(value){return Harvest.getProjects()[value]}, "name"], "ProjektName", "projectName" ),
                                   new Field(["project_id", function(value){return Harvest.getProjects()[value]}], "Kunde - Projekt", "clientProjectName", function(v){return Harvest.getClients()[v.clientId].name + ' - ' + v.name;} ),
                                   //new Field("task_id", "AufgabenId", "taskId"),
                                   //new Field(["task_id", function(value){return Harvest.getTasks()[value]}], "Aufgabe", "task"),
                                   new Field(["task_id", function(value){return Harvest.getTasks()[value]}, "name"], "AufgabenName", "taskName"),
                                   new Field("notes", "Bemerkungen", "notes"),
                                   new Field("hours", "gebucht", "hours", function(v){return v/24;})
                                 );

    this.clientprojecttasks = new Fields( new Field("clientId", "Client-ID","clientId"),
                                        new Field(["clientId",function(v){return Harvest.getClients()[v];},"name"], "Kunde","clientName"),
                                        new Field("id", "Projekt-ID", "projectId"),
                                        new Field("name", "Projektname", "projectName"),
                                        new Field("description", "Beschreibung", "projectDescription"),
                                        new Field("tasks.*", "Aufgaben", "tasks", function(v){return {'taskId':v.task_id, 'name':v.taskName,'billable':v.billable};})
                                      );


  }();
