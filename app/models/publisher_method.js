Wrts.models.PublisherMethod = Wrts.BaseModel.extend({
  validator: Wrts.validators.PublisherMethodValidator,

  initialize: function() {
  },

  parse: function (json) {
    return json;
  },

  toJSON: function() {
    var json = Backbone.Model.prototype.toJSON.call(this);
    return json;
  },

  url: function(){
    return 'publisher_methods' + (this.isNew() ? '' : '/' + this.id);
  },
});
