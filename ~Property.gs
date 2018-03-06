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
 *              DEVELOPER_MODE is set to true.
 *              default: true 
 *    type - defines how the property is formattet in the edit-dialog
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
 *            select - a dropdown-list. Applied automatically if the
 *                     list parameter is provided
 *            multiple - a multi-select-list. requires a list-parameter to 
 *                       define the lists content.
 *    description - a description, that is displayed in the edit-dialog. 
 *    list - the list parameter must contain an array of objects with the
 *           properties value, label and group (opt) 
 *            [{value:'1',label:'some value'},
 *             {value:'2',label:'other value',group:'with group'},
 *             ...]
 *    range - an object that defines the range of a numerical value
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
 
function Property(name,type,label,description,defaultValue,visible,rangeMaxOrList,rangeMin,rangeStep) {

  Property.registerForDevMode(this);

  this.name = name;
  this.type = {'type': type || 'text'}; 
  this.label = label;
  this.description = description || '';
  this.defaultValue = defaultValue;
  this.isVisible = visible || true;

  switch( this.type.type ) {
    case 'date':
      this.type['format'] = 'yyyy-MM-dd';
      break;

    case 'month':
      this.type['format'] = 'yyyy-MM';
      break;

    case 'week':
      this.type['format'] = "yyyy-'W'ww";
      break;

    case 'time':
      this.type['format'] = 'hh:mm:ss';
      break;

    case 'datetime-local':
      this.type['format'] = "yyyy-MM-dd'T'hh:mm:ss";
      break;

    case 'range' :
      this.type['max'] = rangeMaxOrList || 100;
      this.type['min'] = rangeMin || 1;
      this.type['step'] = rangeStep || 1;
      break;
                     
    case 'multiple' :
    case 'select' :
      this.type['items'] = rangeMaxOrList;
      break;

    //case 'text' :
    //case 'checkbox' :
    //case 'color' :
    //case 'url' :
    //case 'email' :
    //case 'password' :
    //  break;
  }
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
  hasDescription: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function() {
     return this.description != '';
    }
  }
//  edit: {
//    enumerable: false,
//    writable: false,
//    configurable: false,
//    value: function() {
//      showPropertiesDialog([this]);
//    }
//  }
});
Object.defineProperties(Property,{
  _allProperties: {
    enumerable: false,
    configurable: false,
    writable: false,
    value: DEVELOPER_MODE? [] : undefined
  },
  registerForDevMode: {
    configurable: false,
    enumerable: false,
    writable: false,
      value: DEVELOPER_MODE? 
              function(prop){Property._allProperties.push(prop);} :
              function(){}
  }
});
