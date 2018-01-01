Object.defineProperties(Object.prototype, 
  {   
  /**  getNestedValue(accessor,...)
   *   Gets the nested property of an object as defined by a chain of accessors.
   *
   *   Parameters:
   *    accessor
   *        one or more arguments containing either a string, an array, 
   *        an object or a function, that are subsequently used to 
   *        resolve the value.
   *        If the accessor is a function, the function is called and the object 
   *        that should be resolved is passed as an argument. The result of 
   *        that function will be the subject of subsequent resolving.
   *        If the accessor is a string, it defines a list of keys, separated by '.',
   *        that will be used to subsequently resolve the value.
   *        If the accessor-string is a number, the number will be used as an index 
   *        to an array. If the accessor-string is '*', then the results will 
   *        be an array with all the elements of the respective object. 
   *        If accessor is an array, every element will be treated as an accessor 
   *        itself and tey will be resolved recursively.
   *        If accessor is an object, the value of every enumerable 
   *        member will be treated as an accessor and will be resolved recursively. 
   *        In this case, the result will be an object with the same list of members 
   *        but the members values will contain the resolved values.
   *                
   *   Return value: the value of the nested property or undefined, if the value 
   *   or an intermediate value, defined by the accessor-chain, does not exist
   *
   *   Exceptions: If an accessor-function throws an error, the exception is passed on
   *
   *   Example: given the object
   *   var x = { a: { ab: '1', 
   *                  ac: '3' }, 
   *             d: [5,6,7,8]
   *             e: [{f: 'hello'},
   *                 {f: 'bye'},
   *                 {f: 'hi'}]
   *           }
   *   x.getNestedValue('a'); // string-accessor
   *   // returns {ab:'1',ac:'3'}
   *   x.getNestedValue('a.ac'); // multiple string-accessor
   *   // returns '3'
   *   x.getNestedValue(['a','ac']); // array-accessor
   *   // returns '3'
   *   x.getNestedValue('d.1'); // string-accessor for array
   *   // returns 6
   *   x.getNestedValue('d.*'); // *-accessor for array
   *   // returns [5,6,7,8]
   *   x.getNestedValue('e.0.f'); // accessing member of array-element
   *   // returns 'hello'
   *   x.getNestedValue('e.*.f');  // extracting members of all array-elements
   *   // returns ['hello','bye','hi']
   *   x.getNestedValue('a',function(v){return v.ac+5;}); // string-accessor and function-accessor
   *   // returns 8
   *   x.getNestedValue(function(v){return {zb:v.a.ab,zc:v.a.ac};}); // function-accessor
   *   // returns {zb:'1',zc:'3'}
   *   x.getNestedValue(function(v){return {zb:v.a.ab,zc:v.a.ac};},'zb'); // function-accessor and string-accessor
   *   // returns '1'
   *   x.getNestedValue({zb:'a.ab',zc:['a','ac']}); // object-accessor
   *   // returns {zb:'1',zc:'3'}
   *   x.getNestedValue('a.ac.x.y.z'); 
   *   // returns undefined
   *   x.getNestedValue(['a','ac','x','y','z']); 
   *   // returns undefined
   *   x.getNestedValue(function(v){return v['c'];},'x'); 
   *   // returns undefined
   *   x.getNestedValue(function(v){throw 'some error';}); 
   *   // returns undefined
  */
  getNestedValue: {
    configurable: false,
    enumerable: false,
    writable: false,
    value: function() {
      function getNestedValueByArray(obj,accArray,start) {
        var tmpObj = obj;
        var acc;
        for( var cnt = start ; tmpObj != null && cnt < accArray.length ; cnt++ ) {
          acc = accArray[cnt];
          if( acc == null )
            continue;
          else if( acc == '*' )
            return getMultipleNestedValues( tmpObj, accArray, cnt + 1 );
          else if( isArray( acc ) ) 
            tmpObj = getNestedValueByArray( tmpObj, acc, 0 );
          else if( isFunction( acc ) )
            tmpObj = acc( tmpObj );
          else if( isObject( acc ) )
          	tmpObj = mapNestedValuesToObject( obj, acc );
          else {
            var aacc = acc.split('.');
            if( aacc.length > 1 ) 
              tmpObj = getNestedValueByArray( tmpObj, aacc, 0 );
            else
              tmpObj = tmpObj[acc];
          }
        }
        return tmpObj;
      } // getNestedValueByArray()
      function getMultipleNestedValues(obj,accArray,start) {
        var results = [];
        for( var key in obj ) {
          results.push( getNestedValueByArray(obj[key],accArray,start) );
        }
        return results;
      } // getMultipleNestedValues()
      function mapNestedValuesToObject(obj,t) {
        var result = {};
        for( var k in t ) {
          var tmpObj = getNestedValueByArray(obj, [t[k]], 0);
          if( !isUndefined(tmpObj) ) result[k] = tmpObj;
        }
        return result;
      }
      // -- hier gehts los ----------------------
      return getNestedValueByArray( this, arguments, 0 );
    }
  },
  shallowCopy: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function() {
      var copy = {};
      for( var k in this )
        copy[k] = this[k];
      return copy;
    }
  }
});