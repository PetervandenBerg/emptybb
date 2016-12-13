window.R = {
  prop: function(key) {
    return function(item) {
      if (item instanceof Backbone.Model) {
        return item.get(key);
      } else {
        return item[key];
      }
    };
  },

  eqProp: function(key, value) {
    return function(item) {
      if (item instanceof Backbone.Model) {
        return item.get(key) === value;
      } else {
        return item[key] === value;
      }
    };
  },

  func: function(funcName){
    return function(item) {
      return item[funcName]();
    };
  },
  appl: function(func){
    return function() {
      return func.apply(this, arguments);
    };
  }

};