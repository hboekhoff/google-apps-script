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
    new Property('datval','Datum', new Date(), 'datetime-local', false,'hier ist ein Datum',false)
   );
   return test_properties;
} 
function test_showProperties() {
  showPropertiesDialog('überschrift', test_properties_getdata());
}

function test_logProperties() {
  var props =  test_properties_getdata();
  for( var cnt = 0 ; cnt < props.length ; cnt++ )
    Logger.log(props[cnt].value);
}