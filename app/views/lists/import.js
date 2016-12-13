Wrts.views.Lists.Import = Wrts.BaseView.extend({
  templateName: 'lists/import',
  decorator: Wrts.decorators.Lists.Import,

  init: function(options){
    this.viewState = new Backbone.ViewState({
      'showArchivedLists': false
    });
    this.render();
  },

  events: {
    'click .buttons input' : 'toggleImportForm',
  },

  // Event functions
  // ====================================================
  toggleImportForm: function(ev){
    var value = $(ev.target).val()
    if (value === "excel") {
      $('#import-form').show();
      $('.file-button').show();
      $('.text-button').hide();
    } else {
      $('#import-form').show();
      $('.file-button').hide();
      $('.text-button').show();
    }
  },

});
