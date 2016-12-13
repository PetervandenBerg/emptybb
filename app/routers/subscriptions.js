Wrts.helpers.registerRouter('Subscriptions', {
  routes: {
    "show_subscription": {to: "show", as: "show_subscription" },
    "expired_subscription": {to: "expired_subscription", as: "expired_subscription" }
  },

  show: function(){
    this.fetch_subscription(function(subscription) {
      Wrts.app.setView(
        Wrts.views.Subscriptions.Show, { model: subscription }
      );
    });
  },

  expired_subscription: function(id){
    Wrts.app.setView(
      Wrts.views.Subscriptions.ExpiredSubscription, { model: {} }
    );
  },

  fetch_subscription: function(callback, error) {
    $.get('/show_subscription_for_user' + '.json').done(function(data) {
      var subscription = new Wrts.models.Subscription(data);
      callback(subscription);
    }).fail(function(err) {
      this.subscription_not_found(err);
    });
  },

  subscription_not_found: function(err) {
    alert('Niet gevonden');
    Wrts.app.getRouter().navigate('/#', {trigger: true});
  }
});
