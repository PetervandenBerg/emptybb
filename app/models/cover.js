Wrts.models.Cover = Wrts.BaseModel.extend({
  validator: Wrts.validators.CoverValidator,

  initialize: function() {
  },

  parse: function (json) {
    return json;
  },

  toJSON: function() {
    if (this.attributes.publisher_method && this.attributes.publisher_method.attributes) {
      this.attributes.publisher_method.name =  this.attributes.publisher_method.attributes.name;
    }
    var json = Backbone.Model.prototype.toJSON.call(this);
    return json;
  },

  url: function(){
    return 'covers' + (this.isNew() ? '' : '/' + this.id);
  },
});
