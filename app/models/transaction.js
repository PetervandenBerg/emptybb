Wrts.models.Transaction = Wrts.BaseModel.extend({
  validator: Wrts.validators.TransactionValidator,

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
    return 'transactions' + (this.isNew() ? '' : '/' + this.id);
  },
});
