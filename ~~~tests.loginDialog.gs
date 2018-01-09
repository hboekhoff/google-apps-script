function test_showLoginDialog() {
  showLoginDialog('Test-Call','test_loginDialogResumeHandler','test_loginDialogAbortHandler','test_loginDialogCheckHandler','hartmut',{a:123}); 
}

function test_loginDialogResumeHandler() {
  LogData(arguments);
}
function test_loginDialogCheckHandler(context,username,password,customData) {
  LogData(arguments);
  return password == '123';
}
function test_loginDialogAbortHandler() {
  LogData(arguments);
}
