function test_showProperties() {
  showPropertiesDialog('überschrift', test_properties_getProperties(3));
}


function test_properties_getProperties(n) {
  var props = new Properties();
  var desc;
  desc = 'dies ist die Beschreibung';
  for( var cnt = 0 ; cnt < n ;  ) {
    props.push(test_properties_getTextProperty('Option ' + ++cnt, desc));
  }
  return props;
}




function test_properties_getdata() {
  var test_properties = new Properties(
    new Property('hallo','Hallo', '123', 'dies ist der Hallo-Wert'),
    new Property('listtest','Liste','k',
                 [{value:'a',label:'AAA',group:'ga'},
                  {value:'j',label:'JJJJJ'},
                  {value:'ä',label:'äää',group:'ga'},
                  {value:'f',label:'FFF',group:'ff'},
                  {value:'ae',label:'AeAeAe',group:'ga'},
                  {value:'w',label:'www',group:'ff'},
                  {value:'v',label:'VVVVVV',group:'ff'},
                  {value:'k',label:'K'}], 'multiple', 'Soek er mar een uit.'),
    new Property('datval','Datum', new Date(), 'datetime-local', false,'hier ist ein Datum',false),
    new Property('cbval','checkbox', true, 'checkbox', false,'hier ist eine checkbox',false)
   );
   return test_properties;
} 

function test_properties_getTextProperty(name,description) {
  return new Property(name,name,'',description);
}
function test_properties_getCheckboxProperty(name,description) {
  return new Property(name,name,false,'checkbox', false,description);
}
function test_properties_getColorProperty(name,description) {
  return new Property(name,name,'#ff0000','color',description);
}
function test_properties_getListProperty(name,description) {
  return new Property(name,name,'k',
                      [{value:'a',label:'AAA',group:'ga'},
                       {value:'j',label:'JJJJJ'},
                       {value:'ä',label:'äää',group:'ga'},
                       {value:'f',label:'FFF',group:'ff'},
                       {value:'ae',label:'AeAeAe',group:'ga'},
                       {value:'w',label:'www',group:'ff'},
                       {value:'v',label:'VVVVVV',group:'ff'},
                       {value:'k',label:'K'}], 
                     'multiple', description);
}
function test_properties_getDropdownProperty(name,description) {
  return new Property(name,name,'k',
                      [{value:'a',label:'AAA',group:'ga'},
                       {value:'j',label:'JJJJJ'},
                       {value:'ä',label:'äää',group:'ga'},
                       {value:'f',label:'FFF',group:'ff'},
                       {value:'ae',label:'AeAeAe',group:'ga'},
                       {value:'w',label:'www',group:'ff'},
                       {value:'v',label:'VVVVVV',group:'ff'},
                       {value:'k',label:'K'}], 
                     description);
}

function test_logProperties() {
  var props =  test_properties_getdata();
  for( var cnt = 0 ; cnt < props.length ; cnt++ )
    Logger.log(props[cnt].value);
}