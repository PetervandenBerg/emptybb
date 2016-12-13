Wrts.views.Teachers.Show = Wrts.BaseView.extend({
  templateName: 'teachers/show',
  decorator: Wrts.decorators.Teachers.Show,

  events: _.extend({
  }),

  init: function(){
    this.render()
  },

});
