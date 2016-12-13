Wrts.views.Lists.Export = Wrts.BaseView.extend({
  templateName: 'lists/export',
  decorator: Wrts.decorators.Lists.Export,
  events: {
    'click #export-button': 'submitForm',
  },

  init: function() {
    this.render();
  },

  submitForm: function(){
    this.$('form').submit();
  },
});
