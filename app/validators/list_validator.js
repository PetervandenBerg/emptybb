Wrts.ns("validators").ListValidator = Wrts.BaseValidator.extend({
  validate: function(attrs) {
    if (!attrs.id && Wrts.data.lists.length + Wrts.data.streamed_lists.length >= Wrts.data.user.get('max_allowed_lists')) {
      return Wrts.I18n.translate("list-validations-list-limit-reached");
    }
    if (attrs.cover_id && attrs.cover_id.length > 0) {
      if (!attrs.publisher_list.school_chapter_id || attrs.publisher_list.school_chapter_id === "") {
        return Wrts.I18n.translate("publisher-list-validations-missing-school_chapter");
      }
    } else {
      if (!this.isTitlePresent(attrs)) { return Wrts.I18n.translate("list-validations-missing-title"); }
    }
    var listCollection = this.model.getListCollection();
    if (!this.isListCollectionPresent(attrs, listCollection)) { return Wrts.I18n.translate("list-validations-missing-list-connection"); }
    if (!this.isSubjectPresent(attrs, listCollection)) {        return Wrts.I18n.translate("list-validations-missing-subject"); }
    if (!this.isSpeechLocalesPresent(attrs, listCollection)) {  return Wrts.I18n.translate("list-validations-missing-speech-locale"); }
    if (!this.isListCollectionValid(attrs, listCollection)) {   return Wrts.I18n.translate("list-validations-missing-words"); }

    if (attrs.publisher_list && attrs.publisher_list.opened === 'true' && attrs.publisher_list.publisher_id != "" && !attrs.publisher_list_details_present) {
      if (!attrs.publisher_list.publisher_id || attrs.publisher_list.publisher_id === "") {
        return Wrts.I18n.translate("publisher-list-validations-missing-publisher");
      }
      if (!attrs.publisher_list.publisher_method_id || attrs.publisher_list.publisher_method_id === "" || attrs.publisher_list.publisher_method_id == "anders") {
        if (!attrs.publisher_list.publisher_method_name || attrs.publisher_list.publisher_method_name == "" ) {
          return Wrts.I18n.translate("publisher-list-validations-missing-publisher-method");
        }
      }
      if (!attrs.publisher_list.school_book_edition_id || attrs.publisher_list.school_book_edition_id === "") {
        return Wrts.I18n.translate("publisher-list-validations-missing-school_book");
      }
      if (!attrs.publisher_list.school_subject_id || attrs.publisher_list.school_subject_id === "") {
        return Wrts.I18n.translate("publisher-list-validations-missing-school_subject");
      }
      if (!attrs.publisher_list.school_level_id || attrs.publisher_list.school_level_id === "") {
        return Wrts.I18n.translate("publisher-list-validations-missing-school_level");
      }
      if (!attrs.publisher_list.school_year_id || attrs.publisher_list.school_year_id === "") {
        return Wrts.I18n.translate("publisher-list-validations-missing-school_year");
      }
      if (!attrs.publisher_list.school_chapter_id || attrs.publisher_list.school_chapter_id === "") {
        return Wrts.I18n.translate("publisher-list-validations-missing-school_chapter");
      }
    }
  },

  isTitlePresent: function(attrs) {
    return (attrs.title.length != 0);
  },

  isListCollectionPresent: function(attrs, listCollection) {
    return (
      _.isObject(listCollection) &&
      _.isArray(listCollection.lists) &&
      listCollection.lists.length > 0
    );
  },

  isListCollectionValid: function(attrs, listCollection) {
    return this.model.isAllFilled();
  },

  isSpeechLocalesPresent: function(attrs, listCollection) {
    return true
    var anyEmpty = _(listCollection.lists).any(function(lc) {
      return Wrts.helpers.isEmpty(lc.speech_locale);
    });
    return !anyEmpty;
  },

  isSubjectPresent: function(attrs, listCollection) {
    var anyEmpty = _(listCollection.lists).any(function(lc) {
      return Wrts.helpers.isPresent(lc.subject);
    });
    return anyEmpty;
  },

  hasMatchingPairs: function(attrs, listCollection) {
    var pairs = [],
        numberOfLists = listCollection.lists.length;

    // The following code gives an incorrect answer if a
    // word pair was just deleted.
    _(listCollection.lists).each(function(lc) {
      _(lc.words).each(function(word, i){
        pairs[i] = pairs[i] || [];
        if (!Wrts.helpers.isEmptyWord(word.word)){
          pairs[i].push(true);
        }
      });
    });

    return _(pairs).every(function(pair) {
      return pair.length === numberOfLists;
    });
  }
});
