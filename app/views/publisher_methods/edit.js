Wrts.views.PublisherMethods.Edit = Wrts.views.PublisherMethods._FormActions.extend({
  templateName: 'publisher_methods/edit',
  decorator: Wrts.decorators.PublisherMethods.Edit,

  events: _.extend(Wrts.views.PublisherMethods._FormActions.prototype.events, {
    'click .delete-pm' : 'destroy',
  }),

  init: function(){
    this.cloneModel();

    this.viewState = new Backbone.ViewState();
    this.listenTo(this.clone,     'add',                       this.render);
    this.listenTo(this.viewState, 'change:locked',             this.updateComponents);
    this.listenTo(this.viewState, 'change:validationMessages', this.updateComponents);
    this.listenTo(this.model,     'error',                     this.handleError);
    this.listenTo(this.model,     'sync',                      this.afterSync);

    this.render();
  },

  afterSync: function () {
    window.location = '/publishers/' + Wrts.data.user.get('publisher_slug');
  },

  updatePublisherMethodInCollection: function (edittedMethod) {
    _(Wrts.data.PublisherMethods).each(function(method) {
      if (method.id === edittedMethod.get('id')) {
        method.name = edittedMethod.get('name');
        method.subject = edittedMethod.get('subject');
        method.description = edittedMethod.get('description');
      }
    });
    this.sortPublisherMethods();
  },

  destroy: function(ev) {
    var res = confirm(Wrts.I18n.translate("are_you_sure")),
        publisherMethod = this.model;

    if (publisherMethod && res === true) {
      this.model.destroy({
        wait: true,
        success: function() {
          Wrts.data.PublisherMethods.remove(this.model);
        }.bind(this)
      });

      var newPublisherMethodData = Wrts.data.PublisherMethods.filter(function(pm) {
        return (pm.id !== publisherMethod.id);
      });

      Wrts.data.PublisherMethods = newPublisherMethodData;
      if (Wrts.data.Publisher) { Wrts.data.Publisher.set('methods', newPublisherMethodData) }
      Wrts.app.getRouter().navigate('#/publisher_methods/');
    }
  },

});
