Wrts.views.Transactions.Plans = Wrts.BaseView.extend({
  templateName: 'transactions/plans',
  decorator: Wrts.decorators.Transactions.Plans,

  init: function() {
    this.render();
  },

  events: {
    'click .language-trigger'                 : 'toggleLanguages',
    'click .exercise-trigger'                 : 'toggleExercises',
    'click .subscr-collection .type'          : 'toggleSelected',
    'click .visiblity-trigger'                : 'toggleVisibilities',
  },

  // Event functions
  // ===================================
  //

  toggleLanguages: function(ev) {
    if ($('.languages li').is(':visible')) {
      $('.languages li').fadeOut();
      $(ev.target).html('Toon talen'); 
    } else {
      $('.languages li').fadeIn();
      $(ev.target).html('Verberg talen');
    }
    return false;
  },

  toggleVisibilities: function(ev) {
    if ($('.visiblities li').is(':visible')) {
      $('.visiblities li').fadeOut();
      $(ev.target).html('Toon extra weergavefuncties'); 
    } else {
      $('.visiblities li').fadeIn();
      $(ev.target).html('Verberg extra weergavefuncties');
    }
    return false;
  },

  toggleExercises: function(ev) {
    if ($('.exercises li').is(':visible')) {
      $('.exercises li').fadeOut();
      $(ev.target).html('Toon extra overhoorfuncties'); 
    } else {
      $('.exercises li').fadeIn();
      $(ev.target).html('Verberg extra overhoorfuncties');
    }
    return false;
  }

});
