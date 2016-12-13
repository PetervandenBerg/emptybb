Wrts.decorators.Covers._FormActions = Wrts.BaseDecorator.extend({
  getData: function(clone) {
    var validationMessages = this.viewState.get('validationMessages') || [],
        methods = this.getMethods(),
        publisher_method = this.getPublisherMethod(),
        publisher = this.getPublisher(),
        school_subjects = Wrts.data.school_subjects.models,
        school_years = Wrts.data.school_years.models,
        school_levels = Wrts.data.school_levels.models,
        school_book_editions = Wrts.data.school_book_editions.models,
        isCurrentPublisher = this.checkForPublisher(publisher);

    for (var i = 0, n = school_years.length; i < n; i++) {
      if (school_years[i].id === this.model.get('school_year_id')) {
        school_years[i].selected = true;
      } else {
        school_years[i].selected = false;
      }
    }

    for (var i = 0, n = school_levels.length; i < n; i++) {
      if (school_levels[i].id === this.model.get('school_level_id')) {
        school_levels[i].selected = true;
      } else {
        school_levels[i].selected = false;
      }
    }

    for (var i = 0, n = school_book_editions.length; i < n; i++) {
      if (school_book_editions[i].id === this.model.get('school_book_edition_id')) {
        school_book_editions[i].selected = true;
      } else {
        school_book_editions[i].selected = false;
      }
    }

    for (var i = 0, n = school_subjects.length; i < n; i++) {
      if (school_subjects[i].id === this.model.get('school_subject_id')) {
        school_subjects[i].selected = true;
      } else {
        school_subjects[i].selected = false;
      }
    }

    return _.extend({
      validationMessages: validationMessages,
      publisher_method: publisher_method,
      school_subjects: school_subjects,
      school_years: school_years,
      school_levels: school_levels,
      school_book_editions: school_book_editions,
      publisher: publisher,
      methods: methods,
      isCurrentPublisher: isCurrentPublisher
    }, clone.toJSON() );
  },

  getPublisherMethod: function(){
    if (this.model.publisherMethod !== undefined) {
      return this.model.publisherMethod;
    } else {
      return this.model.get('publisher_method').id;
    }
  },

  getPublisher: function(){
    if (Wrts.data.Publisher) {
      return Wrts.data.Publisher;
    } else {
      return this.model.get('publisher') ? this.model.get('publisher') : this.model.get('publisher_method').get('publisher');
    }
  },

  getMethods: function(){
    var covers = this.model.get('methods') ? this.model.get('methods') :  this.model.get('publisher_method').get('methods');
    Wrts.data.Covers = covers;
    return covers;
  },

  checkForPublisher: function(publisher){
    var user_id = publisher.user_id ? publisher.user_id : publisher.get('user_id');
    return (user_id === Wrts.data.user.id);
  },

});
