Wrts.views.PublisherMethods.Create = Wrts.views.PublisherMethods._FormActions.extend({
  templateName: 'publisher_methods/create',
  decorator: Wrts.decorators.PublisherMethods.Create,

  events: _.extend(Wrts.views.PublisherMethods._FormActions.prototype.events, {
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
  }

});
