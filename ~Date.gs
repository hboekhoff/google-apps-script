Object.defineProperties(Date.prototype,   { 
  isLeapYear: {
     configurable: false,
     enumerable: false,
     writable: false,
     value: function() {
        var year = this.getFullYear();
        return (year & 3) != 0? 
                  false : 
                  (year % 100) != 0 || (year % 400) == 0;
     }
  },
  getDayOfYear: { 
     configurable: false,
     enumerable: false,
     writable: false,
     value: function() {
        var dayCount = [0,31,59,90,120,151,181,212,243,273,304,334];
        var m = this.getMonth();
        return dayCount[m] + this.getDate() + (m > 1 && this.isLeapYear())? 1 : 0;
     }
  },
  format: {
      configurable: false,
      enumerable: false,
      writable: false,
      value: function(f) {
        return Utilities.formatDate(this, Session.getScriptTimeZone(), f);
      }        
  }
 });