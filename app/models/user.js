Wrts.models.User = Backbone.Model.extend({
  urlRoot: "/user.json",

  initialize: function() {
  },

  toJSON: function() {
    var json = Backbone.Model.prototype.toJSON.call(this);
    return json;
  },

  parse: function (json) {
    if (json.configuration) {
      this.setConfiguration(json.configuration);
      json = _(json).omit('configuration');
    }
    return json;
  },

  getConfiguration: function() {
    return _.clone(this.configuration || {});
  },

  getLastSeen: function() {
    return moment( this.get('last_seen_on') );
  },

  setConfiguration: function(configuration, options){
    this.configuration = configuration;
  }
});
