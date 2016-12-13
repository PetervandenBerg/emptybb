Wrts.views.Results.Index = Wrts.BaseView.extend({
  templateName: 'results/index',
  decorator: Wrts.decorators.Results.Index,

  init: function() {
    this.render();
    _.defer(function(){ 
      $('[data-toggle="tooltip"]').tooltip();
    });
  },

  events: {
    'click .delete-result'         : 'deleteResult',
  },

  deleteResult: function(ev) {
    ev.preventDefault();
    var id = $(ev.target).closest('.delete-result').data('result-id'), 
        result = Wrts.data.results.get(id);

    if (result) {
      Wrts.data.results.remove(result);
      result.destroy({ wait: true });
      Wrts.app.getRouter().navigate('#/lists/' + result.get('list_id') + '/results', {trigger: true}) 
    }
  }
});
