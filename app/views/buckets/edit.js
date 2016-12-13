Wrts.views.Buckets.Edit = Wrts.views.Buckets._FormActions.extend({
  templateName: 'buckets/edit',
  decorator: Wrts.decorators.Buckets.Edit,

  events: _.extend(Wrts.views.Buckets._FormActions.prototype.events, {
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
    var id = this.model.get('id');
    Wrts.app.getRouter().navigate('#/buckets/' + id, {trigger: true});
  },

  destroy: function(ev) {
    var bucket = this.model;

    if (bucket.get('user_id') !== Wrts.data.user.attributes.id) {
      var text = 'Weet je het zeker? De overgenomen map wordt verwijderd'
    } else {
      var text = 'Weet je het zeker? Let op: alleen de map wordt verwijderd, de lijsten blijven aanwezig onder ‘mijn lijsten.'
    }

    res = confirm(text);

    if (bucket && res === true) {
      this.model.destroy({
        wait: true,
        success: function() {
        }.bind(this)
      });

      Wrts.data.buckets.remove(this.model);
      this.navigateToLists();
    }
  },

});
