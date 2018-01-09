function Output() {
}

Object.defineProperties(Output,{
  clearSheet: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function(sheet,firstRow,firstColumn) {
      firstRow = firstRow || 0;
      firstColumn = firstColumn || 0;

      var dr = sheet.getDataRange();
      sheet.showRows(dr.getRow(),dr.getNumRows());
      sheet.showColumns(dr.getColumn(),dr.getNumColumns());

      if( dr.getNumRows() <= firstRow || dr.getNumColumns() <= firstColumn ) 
        return;
      
      sheet.getRange(dr.getRow() + firstRow, dr.getColumn() + firstColumn,
                     dr.getNumRows() - firstRow, dr.getNumColumns() - firstColumn)
              .clearContent();
    }
  },
  writeToTable: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function(sheet, row, column, dataArray, fields) {
      var resultData = dataArray.map(function(v){
                         return fields.extractFormattedValues(v);
                       });
      sheet.getRange(row,column,resultData.length,fields.length)
           .setValues(resultData);
    }
  },
  writeTableHeader: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function(sheet, row, column, fields) {
      sheet.getRange(row,column,1,fields.length).setValues( [fields.labels] );
    }
  },
  writeObject: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function(obj, sheet, row, column) {
      var MAX_OBJECT_DEPTH = 15;
      var maxcols;
      var dataArray = [];
      
      function getMaxDepth(o) {
        var history = [];
        var maxdepth = 1;

        function getMaxDepthRecursive(o,t) {
          history.push(o)
          if( maxdepth < t ) maxdepth = t;
          if( maxdepth >= MAX_OBJECT_DEPTH ) return;
          
          for( var k in o ) {
            var val = o[k];
            if(( isObject(val) || isArray(val) ) &&
                history.indexOf(val) == -1 ) 
              getMaxDepthRecursive(val,t+2);
          }
          history.pop();
        }

        if( isObject(o) || isArray(o) ) getMaxDepthRecursive(o,2);

        return maxdepth;
      }
      function prepareDataArray(obj,maxcols,row,col) {
        for( k in obj ) {
          if(row == dataArray.length) dataArray.push(new Array(maxcols));
          dataArray[row][col] = k;
          if(col+1 < maxcols) {
            var val = obj[k];
            if( isUndefined(val) )
              dataArray[row][col+1] = '';
            else if( isDate(val) )
              dataArray[row][col+1] = val.toString();
            else if( isObject(val) || isArray(val) )
              row = prepareDataArray(val, maxcols, row, col+1 ) - 1;
            else 
              dataArray[row][col+1] = val;
          }
          ++row;
        }
        return row;
      }
      
      
      if( isUndefined(row) || isUndefined(col) ) {
        var r = sheet.getDataRange();
        row = r.getLastRow()+1;
        col = 1;
      }
      
      maxcols = getMaxDepth(obj);
      if( 0 == prepareDataArray(obj,maxcols,0,0) )
        return;

      sheet.getRange(row,col,dataArray.length,maxcols).setValues(dataArray);
    }
  }
});


//function LogData([key,] data [,sheet] [,force])
function LogData(key,data,sheet,force) {
  function resolveArguments(args) {
    var param;
    if( args.length == 1 ) {
      param = [undefined,args[0],undefined,undefined];
    }
    else if( args.length >= 4 ) {
      param = [key,data,sheet,force];
    }
    else if( args.length == 3 ) {
      if( !isString(key) )
        param = [undefined,key,data,sheet];
      else if( typeof sheet == 'boolean' )
        param = [key,data,undefined,sheet];
      else
        param = [key,data,sheet,undefined];
    }
    else {
      if( !isString(key) && typeof data == 'boolean')
        param = [undefined,key,undefined,data];
      else if( !isString(key) )  
        param = [undefined,key,data,undefined];
      else 
        param = [key,data,undefined,undefined];
    }
    return param;
  }

  var args = resolveArguments(arguments);
  key = args[0] || 'Funktion: ' + getCallerFunction(1) + '()';
  data = args[1];
  sheet = args[2];
  force = args[3];

  if(!Globals.DEVELOPER_MODE && !force) return;
  
  function getSheet() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Log');  
    if( isUndefined(sheet) )
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Log');

    return sheet;
  }

  var d = {};
  var d2 = {};
  d2[key]=data;
  d[new Date().toString()] = d2;
  
  writeObject(d, sheet || getSheet());
}

