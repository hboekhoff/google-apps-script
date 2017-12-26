function showPropertiesDialog(title, properties, customHandlerName) {
  function calculateDialogHeight(props) {
    var h = props.reduce(function(p,c){
                           return p + (c.type.multiple && c.type.type=='select'? 153 : 51);
                         }, 53);
    return h>563 ? 563 : h;
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
  dialog.customHandler = ensureFunctionName(customHandlerName);
  
  dialog = dialog.evaluate()
    .setWidth(500)
    .setHeight(calculateDialogHeight(properties));
  
  SpreadsheetApp.getUi().showModalDialog(dialog,title);
}

function propertyDialogOnCancelButton() {
}
function propertyDialogOnOkButton(data, customHandlerName) {
  if( !eval(customHandlerName)(data) )
    return;

  var tempProp = new Property();
  for( var cnt = 0 ; cnt < data.length ; cnt++ ) {
    tempProp.name = data[cnt].name;
    tempProp.value = data[cnt].value;
  }
}



