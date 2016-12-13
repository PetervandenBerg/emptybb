Wrts.views.Subscriptions.ExpiredSubscription = Wrts.BaseView.extend({
  templateName: 'subscriptions/expired_subscription',
  decorator: Wrts.decorators.Subscriptions.ExpiredSubscription,

  init: function() {
    this.render();
  },

  events: {
    'click .language-trigger'       : 'toggleLanguages',
    'click .exercise-trigger'       : 'toggleExercises',
    'click .visiblity-trigger'      : 'toggleVisibilities'
  },

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
