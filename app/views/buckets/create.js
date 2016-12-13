Wrts.views.Buckets.Create = Wrts.views.Buckets._FormActions.extend({
  templateName: 'buckets/create',
  decorator: Wrts.decorators.Buckets.Create,

  events: _.extend(Wrts.views.Buckets._FormActions.prototype.events, {
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
    var id = this.model.get('id');
    Wrts.data.buckets.push(this.model.toJSON());
    Wrts.app.getRouter().navigate('#/buckets/' + id, {trigger: true});
  }

});
