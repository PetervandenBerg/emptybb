Wrts.models.LicenseUser = Backbone.Model.extend({
  urlRoot: "/license_users.json",

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
