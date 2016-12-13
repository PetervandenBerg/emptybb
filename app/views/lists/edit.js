Wrts.views.Lists.Edit = Wrts.views.Lists._FormActions.extend({
  templateName: 'lists/edit',
  decorator: Wrts.decorators.Lists.Edit,

  events: _.extend(Wrts.views.Lists._FormActions.prototype.events, {
  }),

  init: function() {
    this.cloneModel();

    // Set a default value for the shared flag to make sure it exists
    if (Wrts.helpers.isEmpty(this.clone.get('shared'))) {
      this.clone.set('shared', false);
    }

    this.viewState = new Backbone.ViewState();
    this.listenTo(this.clone,     'add',                       this.render);
    this.listenTo(this.viewState, 'change:locked',             this.updateComponents);
    this.listenTo(this.viewState, 'change:validationMessages', this.updateComponents);
    this.listenTo(this.model,     'error',                     this.handleError);
    this.listenTo(this.model,     'sync',                      this.afterSync);

    this.render();
    _.defer(function(){ 
      $('[data-toggle="tooltip"]').tooltip();
    });
  },

  afterSync: function () {
    Wrts.data.lists.sort();
    if (this.model.get('cover_id')) {
      this.navigate('/covers/' + this.model.get('cover_id'), { trigger:true, replace:true });
    } else {
      this.navigateToList(this.model.attributes.id);
    }
  }

});
