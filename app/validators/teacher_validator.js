Wrts.ns("validators").TeacherValidator = Wrts.BaseValidator.extend({
  validate: function(attrs) {
    attrs = attrs.teacher;
    if (!attrs.school_email || attrs.school_email === "") {
      return Wrts.I18n.translate("teacher-validations-missing-school_email");
    }
    if (!attrs.phone_number || attrs.phone_number === "") {
      return Wrts.I18n.translate("teacher-validations-missing-phone_number");
    }
  }

});
