Wrts.views.Licenses.Index = Wrts.BaseView.extend({
  templateName: 'licenses/index',
  decorator: Wrts.decorators.Licenses.Index,

  init: function(options){
    this.render();
    _.defer(function(){ 
      $('[data-toggle="tooltip"]').tooltip();
    });
  },

  events: {
  },

  // Event functions
  // ====================================================

});
