/**
* @class BaseValidator
*/
App.BaseValidator = (function(){
  var defaultValidator = {};

  defaultValidator.initialize = function() {};
  defaultValidator.extend = function(extension) {
    var newValidator = function() { this.initialize.apply(this, arguments); };
    _.extend(newValidator.prototype, defaultValidator, extension);
    return newValidator;
  };

  return defaultValidator;
})();
