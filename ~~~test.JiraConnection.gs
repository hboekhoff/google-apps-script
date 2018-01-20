function test_jiraOpen() {
  var j = new JiraConnection('test_jira');
  j.open('test_jiraOpenCallback','test_jiraAbortCallback',{a:123});
}
function test_jiraExec() {
  var j = new JiraConnection('test_jira');
  var r = j.execute('api/2/search',{jql:'issuekey=fdsupport-1001'});
  LogData('result',r);
  r = j.fetchIssuesByKey(['fdsupport-1002','fdsupport-1003']);
  LogData(r);
}

function  test_jiraOpenCallback(name,data) {
  LogData({name:name,data:data});
}
function  test_jiraAbortCallback(name,messageCode,messageText,data) {
  LogData({name:name,code:messageCode,message:messageText,data:data});
  
}
