Wrts.views.Results.Show = Wrts.BaseView.extend({
  templateName: 'results/show',
  decorator: Wrts.decorators.Results.Show,

  init: function() {
    this.listenTo(this.model, 'change', this.render);
    this.render();

    real_result = this.model;
    _.defer(function(){ 
      if (!real_result.get('id')) {
        if (Wrts.data.user.configuration.auto_save_results) {
          $('.save-result').click();
          $('.auto-saved').show();
        }
      }
      $('[data-toggle="tooltip"]').tooltip();
      $('.keypad-popup').hide();
    });
  },

  events: {
    'click .save-result'                      : 'submitForm',
    'click .retry-exercise'                   : 'retryExercise',
    'change .select-result'                   : 'selectResult',
    'click .subscr-collection .type'          : 'toggleSelected',
    'click .disabled-trigger'                 : 'showPremiumModal',
  },

  showPremiumModal: function(ev) {
    if ($(ev.target).hasClass('max-lists')) {
      $('.max-list-modal').click();
    } else {
      $('.premium-modal').click();
    }
    return false;
  },

  selectResult: function(ev) {
    if ($(ev.target).prop('checked')) {
      $(ev.target).closest('.result-container').removeClass('inactive').addClass('active');
      $(ev.target).parent().find('label').html('Geselecteerd');
    } else {
      $(ev.target).closest('.result-container').removeClass('active').addClass('inactive')
      $(ev.target).parent().find('label').html('Selecteren');
    }
  },

  submitForm: function(ev) {
    var attempts = this.model.get('attempts'),
        listsToSave = $('.result-container.active').map(function(i,result) {
          return $(result).data('list-id');
        }),
        joinedListArray = Array.prototype.join.call(listsToSave, "&");

    if (joinedListArray == "") {
      alert('Je hebt geen lijsten geselecteerd');
    } else {
      Wrts.app.getRouter().navigate('#/exercises/save_result/' + this.model.cid + '?&' + joinedListArray, {trigger: true});
    }
  },

  retryExercise: function(ev) {
    var attempts = this.model.get('attempts'),
        listsToSave = $('.result-container.active').map(function(i,result) {
          return $(result).data('list-id');
        }),
        joinedListArray = Array.prototype.join.call(listsToSave, "&");

    if (joinedListArray == "") {
      alert('Je hebt geen lijsten geselecteerd');
    } else {
      Wrts.app.getRouter().navigate('#/exercises/prepare_by_lists/' + joinedListArray, {trigger: true});
    }
  }
});
