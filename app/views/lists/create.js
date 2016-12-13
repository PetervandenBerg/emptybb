Wrts.views.Lists.Create = Wrts.views.Lists._FormActions.extend({
  templateName: 'lists/create',
  decorator: Wrts.decorators.Lists.Create,

  events: _.extend(Wrts.views.Lists._FormActions.prototype.events, {
  }),

  init: function() {
    var column_amount = 2;
    this.cloneModel();
    // Only add empty wordlist when the cloned model has no wordlist

    if (typeof(this.clone.listCollection) != "object" ||
        !('lists' in this.clone.listCollection)) {
      this.clone.createWordLists(column_amount, 10);
    }

    // Set a default value for the shared flag to make sure it exists
    this.clone.set('shared', false);
    this.viewState = new Backbone.ViewState();
    this.listenTo(this.clone,     'add',         this.render);
    this.listenTo(this.viewState, 'change:locked',             this.updateComponents);
    this.listenTo(this.viewState, 'change:validationMessages', this.updateComponents);
    this.listenTo(this.model,     'error',       this.handleError);
    this.listenTo(this.model,     'sync',        this.afterSync);
    this.render();
    _.defer(function(){ 
      $('[data-toggle="tooltip"]').tooltip();
    });
  },

  afterSync: function () {
    Wrts.data.lists.add(this.model);
    this.checkForStreamedList(this.model);
    this.checkForCoverList(this.model);
  },

  checkForStreamedList: function(list){
    if (list.get('streamed_list_id')) {
      var streamed_list = Wrts.data.streamed_lists.detect(function(streamed_list) {
        return (list.get('id') == streamed_list.get('id'));
      });
      Wrts.data.streamed_lists.remove(streamed_list);
    } 
  },

  checkForCoverList: function(list){
   if (list.get('cover_id')) {
      this.navigate('/covers/' + list.get('cover_id'), { trigger:true, replace:true });
    } else {
      this.navigateToList(list.attributes.id);
    } 
  }

});
