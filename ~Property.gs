/**  
 *  Property class provides an alternative way to handle document properties
 *  Bundled with the property-dialog they are easily displayed and editable.
 *  Each Property defines a name (the actual internal name of the document-property),
 *  a label, a description and a type specification that define how the property
 *  is displayed in the property dialog
 *
 *  Parameters
 *   name - the name of the document-property
 *   label - the label, displayed in the property-dialog
 *   defaultValue - optional default-value
 *
 *   the other parameters are optional and can appear in any order
 *    visible - Determines if the property is displayed in the edit-dialog. 
 *              if set to false, the property is only displayed if the variable 
 *              Globals.DEVELOPER_MODE is set to true.
 *              any boolean value will be interpreted as the visible-flag
 *              default: true 
 *    type - defines how the property is formattet in the edit-dialog
 *           any string, that matches one of the following, is interpreted 
 *           as the type parameter
 *            text - a simple text input, this is the default
 *            checkbox - a checkbox
 *            date - a date-value with the format "yyyy-MM-dd"
 *            month - a date-value with the format "yyyy-MM"
 *            week - a date-value with the format "yyyy-'W'ww"
 *            time - a date-value with the format "hh:mm:ss"
 *            datetime-local - a date-value with the format "yyyy-MM-dd'T'hh:mm:ss"
 *            color - a color-picker
 *            range - a numeric-value limited to a range. this type is applied 
 *                    automatically, if the range parameter is set
 *            url - a text input-field that expects an URL
 *            email - a text input-field that expects an E-Mail address
 *            password - a password input-field
 *            select - a dropdown or select-list. Applied automatically if the
 *                     list parameter is provided
 *    description - a description, that is displayed in the edit-dialog. 
 *                  Any string, that does not match one of the types 
 *                  specified above, will be interpreted as the description
 *    list - the list parameter must contain an array of objects with the
 *           properties value, label and group (opt) 
 *           any array will be identified as the list-parameter
 *            [{value:'1',label:'some value'},
 *             {value:'2',label:'other value',group:'with group'},
 *             ...]
 *    range - an object that defines the range of a numerical value
 *            any object with a max-property will be identified as a 
 *            range specifier
 *            {max:100,min:0,step:10} (default values: min=1, step=1)
 *
 *  Remarks:
 *  contradictions between the optional parameters (e.g. type=checkbox and 
 *  a range-object) don't throw errors but result in undefined behaviour
 *
 *  Examples:
 *   new Property('name','label',defaultValue, false, ...);
 *      property will not be visible in dialog
 *   new Property('name','label',defaultValue,'checkbox'); 
 *      creates checkbox-property
 *   new Property('name','label',defaultValue,'some description');
 *      creates property with description
 *   new Property('name','label',defaultValue,'checkbox','some description');
 *      creates checkbox-roperty with description
 *   new Property('name','label',defaultValue,[{value:'some',label:'some label'},{value:'other value',label:'other label'},...]); 
 *      creates dropdown-property
 *   new Property('name','label',defaultValue'some description',[{value:'some',label:'some label'},{value:'other value',label:'other label'},...]);
 *      creates dropdown-roperty with description
 */
 
function Property(name,label,defaultValue,x1,x2,x3) {
  function setVisible(prop,visible) {
    prop.isVisible = visible;
  } 
  function setTypeDate(prop,type,format) {
    prop.type = {'type': type,'format':format};
  }
  function setTypeSelect(prop,list,multiple) {
    prop.type = prop.type || {};
    prop.type.type = 'select';
    prop.type.multiple = multiple || prop.type.multiple || false;
    prop.type.items = list || prop.type.items;
  }
  function setTypeRange(prop,range) {
    prop.type = {'type':'range',
                 'max':range['max'],
                 'min':range['min'] || 1,
                 'step':range['step'] || 1};
  }

  function setOptionalArguments(prop) {
    for( var cnt = 1 ; cnt < arguments.length ; cnt++ ) {
      if( isUndefined(arguments[cnt]) ) 
        continue;
      else if( typeof arguments[cnt] == 'boolean' ) 
        setVisible(arguments[cnt]);
      else if( isArray(arguments[cnt]) )
        setTypeSelect(prop,arguments[cnt]);
      else if( isObject(arguments[cnt]) && !isUndefined(arguments[cnt]['max']) )
        setTypeRange(prop,arguments[cnt]);
      else if( isString(arguments[cnt]) )
        switch( arguments[cnt] ) {
          case 'date':
            setTypeDate(prop,arguments[cnt],'yyyy-MM-dd');
            break;
          case 'month':
            setTypeDate(prop,arguments[cnt],'yyyy-MM');
            break;
          case 'week':
            setTypeDate(prop,arguments[cnt],"yyyy-'W'ww");
            break;
          case 'time':
            setTypeDate(prop,arguments[cnt],'hh:mm:ss');
            break;
          case 'datetime-local':
            setTypeDate(prop,arguments[cnt],"yyyy-MM-dd'T'hh:mm:ss");
            break;

          case 'checkbox':
          case 'color':
          case 'range':
          case 'url':
          case 'email':
          case 'password':
            prop.type = {'type': arguments[cnt]};
            break;

          case 'multiple':
            setTypeSelect(prop,undefined,true);
            break;

          default:
            prop.description = arguments[cnt];
        }
    }
  }

  this.name = name;
  this.label = label;
  this.defaultValue = defaultValue;
  this.isVisible = true;
  this.description = '';
  this.type = {'type':'text'}; 
  setOptionalArguments(this,x1,x2,x3);
}

Object.defineProperties(Property.prototype,{
  value: {
    enumerable: false,
    configurable: false,
    get: function() {
      var value = this.rawValue || this.defaultValue;
      try {
        if( value.substring(0,5)== "JSON:" )
          value = JSON.parse(value.substring(5));
      }
      catch(e) {
      }
      return value;
    },
    set: function(value) {
      if( isUndefined(value) )
        this.clear();
      else
        PropertiesService
          .getDocumentProperties()
          .setProperty(this.name, 
                       (isObject(value) || isArray(value))?
                          "JSON:" + JSON.stringify(value) : value );
    }
  },
  rawValue: {
    enumerable: false,
    configurable: false,
    get: function() {
      return PropertiesService.getDocumentProperties().getProperty(this.name);
    }
  },
  clear: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function() {
      PropertiesService.getDocumentProperties().deleteProperty(this.name);
    }
  },
  hasValue: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function() {
     return !isUndefined(this.rawValue);
    }
  },
//  edit: {
//    enumerable: false,
//    writable: false,
//    configurable: false,
//    value: function() {
//      showPropertiesDialog([this]);
//    }
//  }
});
