Wrts.ns("validators").PublisherMethodValidator = Wrts.BaseValidator.extend({
  validate: function(attrs) {
    if (!attrs.name || attrs.name === "") {
      return Wrts.I18n.translate("publisher-method-validations-missing-name");
    }
    if (!attrs.school_subject_id || attrs.school_subject_id === "") {
      return Wrts.I18n.translate("publisher-method-validations-missing-school-subject");
    }
  },

});
