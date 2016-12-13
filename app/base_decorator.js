/**
* @class BaseDecorator
*/
App.BaseDecorator = (function(){
  var defaultDecorator = {};

  defaultDecorator.initialize = function(options) {
    if (options) {
      if (options.model) {
        this.model = options.model;
      }

      if (options.collection) {
        this.collection = options.collection;
      }

      if (options.viewState) {
        this.viewState = options.viewState;
      }
    }
  };

  defaultDecorator.extend = function(extension) {
    if (!extension.getData) {
      return Wrts.helpers.throwError("Decorators need a getData function!");
    }
    var newDecorator = function() { this.initialize.apply(this, arguments); };
    _.extend(newDecorator.prototype, defaultDecorator, extension);
    newDecorator.extend = function(obj) {
      return _.extend(this, obj);
    };

    return newDecorator;
  };

  return defaultDecorator;
})();
