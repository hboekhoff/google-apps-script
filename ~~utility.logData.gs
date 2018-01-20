//function LogData([key,] data [,sheet] [,force])
function LogData() {
  function resolveArguments(args) {
    if( args.length == 1 )
      return {key:undefined,data:args[0],sheet:undefined,force:undefined};
    else if( args.length >= 4 )
      return {key:args[0],data:args[1],sheet:args[2],force:args[3]};
    else if( args.length == 2 && !isString(args[0]) && typeof args[1] == 'boolean')
      return {key:undefined,data:args[0],sheet:undefined,force:args[1]};
    else if( !isString(args[0]) )
      return {key:undefined,data:args[0],sheet:args[1],force:args[2]};
    else if( typeof args[2] == 'boolean' )
      return {key:args[0],data:args[1],sheet:undefined,force:args[2]};
    else
      return {key:args[0],data:args[1],sheet:args[2],force:undefined};
  }
  function getLoggingSheet() {
    return SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Log') ||
           SpreadsheetApp.getActiveSpreadsheet().insertSheet('Log');
  }
  
  var args = resolveArguments(arguments);
  if(!DEVELOPER_MODE && !args.force) return;

  if( isUndefined(args.key) )
    args.key = getCallPosition(1);

  var d = {};
  d[args.key] = args.data;
  var d2 = {};
  d2[new Date().toString()] = d;

  Output.writeObject(d2, args.sheet || getLoggingSheet());
}
