Wrts.ns("validators").TransactionValidator = Wrts.BaseValidator.extend({
  validate: function(attrs) {
    if (!attrs.transaction.subscription_id || attrs.transaction.subscription_id === "") {
      return Wrts.I18n.translate("transaction-validations-missing-subscription");
    }
  },
});
