function outer() {
  try {
    evaltest();
  }
  catch(e) {
    Logger.log(e.stack);
  }
}
function evaltest() {
  try {
    throw new Error();
    var x = x.run();
  }
  catch(e) {
    Logger.log(e.stack);
    Logger.log(JSON.stringify(e));
    throw e;
  }
}

Object.defineProperty(evaltest,'testfunction',{
                      writable: false,
                      enumerable: false,
                      configurable: false,
                      value: function() {Logger.log('evaltest.testfunction is running');}
                      });
                      
                      
