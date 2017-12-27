function evaltest() {
  
}

Object.defineProperty(evaltest,'testfunction',{
                      writable: false,
                      enumerable: false,
                      configurable: false,
                      value: function() {Logger.log('evaltest.testfunction is running');}
                      });
                      
                      
function test222() {
  evaltest.testfunction();
  Logger.log(ensureFunctionName('evalest.testfunction'));
  

}