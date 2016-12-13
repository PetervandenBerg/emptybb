/**
* @class BaseView
* @description
* Every BaseView renders by default
* Also, every BaseView needs at least a template or templateName
* if a decorator + model is available it will pass the getdata() params to the view
* If a model is available it will pass the model to the view
*/
App.BaseView = Backbone.View.extend({
  initialize: function() {
    // Prechecks
    if (!this.template && !this.templateName && !this.partialName) {
      Wrts.helpers.throwError("Missing template or templateName in BaseView");
    }

    if (!this.template && this.templateName) {
      if (!HandlebarsTemplates[this.templateName]) {
         Wrts.helpers.throwError("Missing HandlebarsTemplate " + this.templateName + " in BaseView");
      }

      this.template = HandlebarsTemplates[this.templateName];
      this.template = function() {
        // conversion to array to make it editable
        var args = Array.prototype.slice.call(arguments);
        args[0] = $.extend({}, args[0], {
          globals: {
            profile: {
              fullName: "full name",
              email: "test@test.nl"
            }
          }
        });
        return HandlebarsTemplates[this.templateName].apply(this, args);
      };
    }

    if (!this.template && this.partialName){
      if (!Handlebars.partials[this.partialName]) {
         Wrts.helpers.throwError("Missing Handlebars.partials " + this.partialName + " in BaseView");
      }
      this.template = Handlebars.partials[this.partialName];
    }

    // Map navigator for easy access
    this.navigate = Wrts.app.getRouter().navigate;

    // Initialize or render
    if (this.init) {
      this.init.apply(this, arguments);
    } else {
      this.render();
    }
  },

  render: function() {
    this.$el.html(
      this.template(this.getTemplateData())
    );
  },

  // Default Getters
  getTemplateData: function() {
    var data = {},
        instance;
    if (this.decorator) {
      instance = this.getDecorator();
      data = instance.getData.apply(instance, arguments);
    } else if (this.model) {
      data = this.model.toJSON();
    } else if (this.collection) {
      data = this.collection.toJSON();
    }
    return data;
  },

  getDecorator: function() {
    if (this.decoratorInstance) return this.decoratorInstance;
    var options = _.pick(this, 'model', 'collection', 'viewState');
    this.decoratorInstance = new this.decorator(options);
    return this.decoratorInstance;
  },

});
