Wrts.models.Subscription = Backbone.Model.extend({
  urlRoot: "/show_subscription_for_user.json",

  initialize: function() {
  },

  toJSON: function() {
    var json = Backbone.Model.prototype.toJSON.call(this);
    return json;
  },

  parse: function (json) {
    return json;
  }

});
