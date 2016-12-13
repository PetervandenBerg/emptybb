Wrts.models.SchoolPlace = Backbone.Model.extend({
  urlRoot: "/school_place.json",

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
