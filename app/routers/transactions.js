Wrts.helpers.registerRouter('Transactions', {
  routes: {
    'transactions/create/:plan' : {to: 'create',  as: 'new_transaction' },
    'transactions/plans' : {to: 'plans',  as: 'transaction_plans' },
    'transactions/licenses' : {to: 'licenses',  as: 'transaction_licenses' },
    'transactions/base_user' : {to: 'base_user',  as: 'transaction_base_user' },
    'transactions/succes' : {to: 'succes',  as: 'transaction_succes' },
    'transactions/group_payment_succes' : {to: 'group_payment_succes',  as: 'group_payment_succes' },
    'transactions/failed' : {to: 'failed',  as: 'transaction_failed' }
  },

  base_user: function() {
    Wrts.app.setView(
      Wrts.views.Transactions.BaseUser, { collection: Wrts.data.lists.getFilteredCollection() }
    ); 
  },

  plans: function() {
    Wrts.app.setView(
      Wrts.views.Transactions.Plans, { collection: Wrts.data.lists.getFilteredCollection() }
    ); 
  },

  licenses: function() {
    Wrts.app.setView(
      Wrts.views.Transactions.Licenses, { collection: Wrts.data.lists.getFilteredCollection() }
    ); 
  },

  succes: function() {
    Wrts.app.setView(
      Wrts.views.Transactions.Succes, { collection: Wrts.data.lists.getFilteredCollection() }
    ); 
  },

  group_payment_succes: function() {
    Wrts.app.setView(
      Wrts.views.Transactions.GroupPaymentSucces, { collection: Wrts.data.lists.getFilteredCollection() }
    ); 
  },

  failed: function() {
    Wrts.app.setView(
      Wrts.views.Transactions.Failed, { collection: Wrts.data.lists.getFilteredCollection() }
    ); 
  },

  create: function(type) {
    var transaction = new Wrts.models.Transaction();
    transaction.set('type', type);

    Wrts.app.setView(
      Wrts.views.Transactions.Create, { model: transaction, collection: Wrts.data.lists.getFilteredCollection() }
    );
  },

});
