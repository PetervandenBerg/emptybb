Wrts.views.Transactions.BaseUser = Wrts.BaseView.extend({
  templateName: 'transactions/base_user',
  decorator: Wrts.decorators.Transactions.BaseUser,

  init: function() {
    this.render();
  },

  events: {
  },

  // Event functions
  // ===================================
  //

});
