Wrts.ns("validators").CoverValidator = Wrts.BaseValidator.extend({

  validate: function(attrs) {
    if (!attrs.school_book_edition_id || attrs.school_book_edition_id === "") {
      return Wrts.I18n.translate("cover-validations-missing-school_book_id");
    }
    if (!attrs.school_level_id || attrs.school_level_id === "") {
      return Wrts.I18n.translate("cover-validations-missing-school_level_id");
    }
    if (!attrs.school_year_id || attrs.school_year_id === "") {
      return Wrts.I18n.translate("cover-validations-missing-school_year_id");
    }
  },

});
