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
                {value:'k',label:'K'}])
 );
 
function test_showProperties() {
  showPropertiesDialog('überschrift',test_properties);
}

function test_logProperties() {
  for( var cnt = 0 ; cnt < test_properties.length ; cnt++ )
    Logger.log(test_properties[cnt].rawValue);
}