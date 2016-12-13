App.BaseModel = (function() {
  return {
    extend: function(modelMethods) {
      var validator, model;

      // if a validator is supplied, overwrite the validate function
      if (modelMethods.validator) {
        validator = new modelMethods.validator();
        modelMethods.validate = function() { return validator.validate.apply(validator, arguments); };
      }

      model = Backbone.Model.extend(modelMethods);

      return function(attributes, options) {
        var instance = new model(attributes, options);
        if (validator) {
          validator.model = instance;
        }
        return instance;
      };
    }
  };
})();
