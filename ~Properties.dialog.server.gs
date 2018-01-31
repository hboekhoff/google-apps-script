function showPropertiesDialog(title, properties, customHandlerName) {
  function calculateDialogHeight(props) {
    var h = props.reduce(function(p,c){
                            if( c.type.type == 'checkbox' ) return p + 28;
                            if( c.description != '' ) p += 2.3;
                            switch(c.type.type) {
                              case 'select':
                                return p + (c.type.multiple? 144 : 42);
                              case 'color':
                                return p + 50;
                              default:
                                return p + 44;
                            }
                         }, 61.0);
    return h>516 ? 516 : h;
  }


  if( isUndefined(title) ) {
   title = "Dokumenteigenschaften bearbeiten";
  }
  else if( !isString(title) ) {
    //  no title parameter - shift other parameters
    customHandlerName = properties;
    properties = title;
    title = "Dokumenteigenschaften bearbeiten";
  }

  var dialog = HtmlService.createTemplateFromFile('~Properties.dialog');
  
  dialog.data = {'properties':properties};
  dialog.customHandler = customHandlerName;
  
  dialog = dialog.evaluate()
    .setWidth(500)
    .setHeight(calculateDialogHeight(properties));
  SpreadsheetApp.getUi().showModalDialog(dialog,title);
}

function propertyDialogOnCancelButton() {
}
function propertyDialogOnOkButton(data, customHandlerName) {
  var r = executeIfExists(customHandlerName,null,[data]);
  if( r.hasExecuted && r.returnValue == false ) return;

  var tempProp = new Property();
  for( var cnt = 0 ; cnt < data.length ; cnt++ ) {
    tempProp.name = data[cnt].name;
    tempProp.value = data[cnt].value;
  }
}



