Wrts.views.Covers.Edit = Wrts.views.Covers._FormActions.extend({
  templateName: 'covers/edit',
  decorator: Wrts.decorators.Covers.Edit,

  events: _.extend(Wrts.views.Covers._FormActions.prototype.events, {
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
    Wrts.data.Covers.sort();
    this.navigateToCover(this.model.get('id'));
  }

});
