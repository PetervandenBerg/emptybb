Wrts.models.Restriction = Backbone.Model.extend({
  urlRoot: "/restriction.json",

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
