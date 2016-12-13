Wrts.decorators.PublisherMethods._FormActions = Wrts.BaseDecorator.extend({
  getData: function(clone) {
    var validationMessages = this.viewState.get('validationMessages') || [],
        publisher_method = this.getPublisherMethod(),
        school_subjects = Wrts.data.school_subjects.models,
        publisher = this.getPublisher(),
        methods = this.getMethods(publisher),
        isCurrentPublisher = this.checkForPublisher(publisher);

    for (var i = 0, n = school_subjects.length; i < n; i++) {
      if (school_subjects[i].id === this.model.get('school_subject_id')) {
        school_subjects[i].selected = true;
      } else {
        school_subjects[i].selected = false;
      }
    }

    return _.extend({
      validationMessages: validationMessages,
      school_subjects: school_subjects,
      publisher_method: publisher_method,
      publisher: publisher,
      methods: methods,
      isCurrentPublisher: isCurrentPublisher
    }, clone.toJSON() );
  },

  getPublisherMethod: function(){
    return this.model.toJSON();
  },

  getPublisher: function(){
    if (Wrts.data.Publisher) {
      return Wrts.data.Publisher;
    } else {
      return this.model.get('publisher');
    }
  },

  getMethods: function(publisher){
    if (publisher.attributes) {
      Wrts.data.PublisherMethods = publisher.get('methods');
      return Wrts.data.PublisherMethods;
    } else {
      Wrts.data.PublisherMethods = this.model.get('methods');
      return Wrts.data.PublisherMethods;
    }
  },

  checkForPublisher: function(publisher){
    var user_id = publisher.user_id ? publisher.user_id : publisher.get('user_id');
    return (user_id === Wrts.data.user.id);
  },

});
