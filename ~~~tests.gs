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
                      
                      

function testdateformatter() {
  var d = new Date();
  Logger.log(d.format('YYYY-MM-dd hh:mm:ss.SSS'));
}

function testHashcode() {
  Logger.log(getHashCode({}));
  Logger.log(getHashCode([]));
  Logger.log(getHashCode({a:1}));


}

function test_retrieveharvestentry() {
  var id = 749132929;
  LogData('123',"hallo");
  Logger.log(id);
  var x = TheHarvestConnection_v1.fetchTimeEntry(id);
  Logger.log(x);
}


function abcde(a) {
  this.a = a;
}
Object.defineProperties(abcde.prototype, {
  incrementstatic: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function() {
      this.incrementstatic.variable = (this.incrementstatic.variable || 0)+1;
      return this.incrementstatic.variable;
    }
  },
  getstuff: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function() {
      return this.a + ': ' + this.incrementstatic();//.variable;
    }
  },
  internalstore: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function() {
      function _internal() {
        var c = this.c;
        if( isUndefined(c) ) c = this.c = {i:0};
        return c.i++;
      }
      return _internal();
    }
  },
});
function testabcde() {
  var a = new abcde('a');
  var b = new abcde('b');
  var c = new abcde('c');
  Logger.log(a.incrementstatic());
  Logger.log(b.incrementstatic());
  Logger.log(c.incrementstatic());
  Logger.log(a.getstuff());
  Logger.log(b.getstuff());
  Logger.log(c.getstuff());
  Logger.log('final: ' + abcde.prototype.incrementstatic.variable);
  Logger.log(a.internalstore());
  Logger.log(b.internalstore());
  Logger.log(c.internalstore());
  Logger.log(a.internalstore());
  
}