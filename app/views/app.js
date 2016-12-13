Wrts.views.App = Backbone.View.extend({
  initialize: function(options) {
    this.state = options.state;

    this.listenTo(this.state, 'change:requesting', this.requestingStateChange);
  },

  requestingStateChange: function(state, requesting) {
    if (requesting) {
      this.$el.addClass('is_requesting');
    } else {
      this.$el.removeClass('is_requesting');
    }
  },

  getOutletEl: function() {
    if (!this.$container) {
      this.$container = this.$('> .container');
    }
    return this.$container;
  }
});
