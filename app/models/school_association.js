Wrts.models.SchoolAssociation = Backbone.Model.extend({
  urlRoot: "/school_association.json",

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
