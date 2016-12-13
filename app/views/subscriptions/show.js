Wrts.views.Subscriptions.Show = Wrts.BaseView.extend({
  templateName: 'subscriptions/show',
  decorator: Wrts.decorators.Subscriptions.Show,

  init: function() {
    this.listenTo(this.model, 'change', this.render);
    this.render();
  },

  events: {
  }
});
