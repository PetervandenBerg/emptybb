Wrts.models.Teacher = Wrts.BaseModel.extend({
  validator: Wrts.validators.TeacherValidator,

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
    return 'teachers' + (this.isNew() ? '' : '/' + this.id);
  },
});
