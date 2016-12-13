Wrts.decorators.Results.Show = Wrts.BaseDecorator.extend({
  getData: function() {
    var wrongAnswersCount = this.model.getWrongAnswersCount(),
        uniqSubjects = Wrts.data.lists.getUniqSubjects(),
        activeSubject = Wrts.data.lists.getActiveSubject(),
        subjects = [],
        attempts = this.getAttempts(),
        streamed_lists = Wrts.data.streamed_lists,
        attemptsByLists = this.filterAttemptsByLists(attempts),
        buckets = this.getBuckets(),
        showRetryFailedAttemps = wrongAnswersCount > 0;

    for (var i = 0, n = uniqSubjects.length; i < n; i++) {
      subjects.push({
        subject: uniqSubjects[i],
        active: activeSubject === uniqSubjects[i]
      });
    }

    return _.extend(this.model.toJSON(), {
      humanizedDuration: this.getHumanizedDuration(),
      subjectOrder: this.getSubjectOrder(),
      subjects: subjects,
      buckets: buckets,
      grade: this.getGrade(),
      bucketsClosed: this.readFromPopstate("buckets"),
      restriction: Wrts.data.restriction.attributes,
      streamedLists: streamed_lists,
      anyStreamedLists: streamed_lists.length > 0,
      isMobileDevice: (screen.width <= 640),
      reachedListLimit: this.reachedListLimit(),
      exerciseMethod: this.getExerciseMethod(),
      reachedBucketLimit: this.reachedBucketLimit(),
      account: Wrts.data.user.attributes,
      configuration: Wrts.data.user.configuration,
      listIds: this.findListIds(),
      subjectsClosed: this.readFromPopstate("subjects"),
      wrongAnswersCount: wrongAnswersCount,
      subscriptionTypes: this.getSubscriptionTypes(),
      subscriptionPlans: this.getPlans(),
      correctAnswersCount: this.model.getCorrectAnswersCount(),
      showRetryFailedAttemps: showRetryFailedAttemps,
      appreciation: this.getAppreciationMessage(),
      attemptsBySubjects: attemptsByLists,
      listName: this.getListName(),
      childId: this.getChildId()
   });
  },

  getSubscriptionTypes: function(){
    return Wrts.data.subscription_types.toJSON().reverse();
  },

  getPlans: function(){
    var selectedType = "plus";
    var typeObject = Wrts.data.subscription_types.select(function(type) { 
      return selectedType === type.get('name').toLowerCase();
    });

    if (typeObject.length > 0) {
      var plans = typeObject[0].get('plans');
      return plans;
    } else {
      return {};
    }
  },

  findListIds: function() {
    var attempts = this.model.get('attempts');
    var listIds = $(attempts).map(function(i, attempt) {
      return attempt.list_id;
    });
    return _.uniq(listIds).join('&');
  },

  getExerciseMethod: function () {
    if (this.model.getConfiguration()) {
      return this.model.getConfiguration().exerciseType;
    } else {
      return this.model.get('exercise_type');
    }
  },

  reachedListLimit: function() {
    var account = Wrts.data.user.attributes,
        maxLists = account.max_allowed_lists,
        listLength = Wrts.data.lists.length,
        streamedListlength = Wrts.data.streamed_lists.length;

    var user_list_length = listLength + streamedListlength;
    return user_list_length >= maxLists;
  },

  reachedBucketLimit: function() {
    var account = Wrts.data.user.attributes,
        maxBuckets = account.max_allowed_buckets,
        user_bucket_length = Wrts.data.buckets.length;

    return user_bucket_length >= maxBuckets;
  },

  filterAttemptsByLists: function(attempts) {
    var groupedAttempts = _.groupBy(attempts, "list_id");
    var data = _.map(groupedAttempts, function(attempts){ return { attempts: attempts } }),
        attemptsArray = [];

    $(data).each(function(i, group){
      if (group.attempts) {
        var firstAttempt  = group.attempts[0],
            listId        = firstAttempt.list_id,
            answer        = firstAttempt.answerSubject,
            question      = firstAttempt.subject,
            list          = Wrts.data.lists.get(listId);

        var calculatedGrade = Wrts.helpers.getGradeFor(group.attempts);
        var grade = Wrts.helpers.gradeForCountryConfiguration(
          calculatedGrade,
          Wrts.data.user.getConfiguration().grade
        );

        return attemptsArray.push({ question: question, answer:  answer, attempts: group.attempts, listId: listId, list: list, grade: grade });
      }
    });
    return attemptsArray;
  },

  onlyUnique: function(value, index, self) {
    return self.indexOf(value) === index;
  },

  readFromPopstate: function(type) {
    return (localStorage.getItem(type) === "hide");
  },

  getListName: function(){
    if (this.model.get('listTitles')) {
      return this.model.get('listTitles');
    } else {
      return 'Samengestelde lijst van foute antwoorden'
    }
  },

  getChildId: function() {
    return this.model.cid
  },

  getBuckets: function() {
    return Wrts.data.buckets.models.map(function(bucket) {
      return bucket.toJSON();
    });
  },

  getSubjectOrder: function() {
    return this.model.getSubjectOrder();
  },

  getHumanizedDuration: function () {
    return Wrts.helpers.humanizeDuration(this.model.getTotalAttemptDuration());
  },

  getAppreciationMessage: function(){
    var percentage = this.model.get("grade"),
        first_name = Wrts.data.user.get('first_name');

    switch (true) {
      case (percentage < 55):
        str = "Helaas " + first_name + ", geen voldoende. Overhoor deze woorden nog maar een keer.";
        break;
      case (percentage < 70):
        str = "Goed bezig "  + first_name + "! Blijf oefenen op naar de 10!";
        break;
      case (percentage < 80):
        str = "Heel goed " + first_name + " je bent er bijna!";
        break;
      case (percentage < 90):
        str = "Nog een paar kleine fouten " + first_name + ".";
        break;
      case (percentage >= 90 && percentage < 100):
        str = "Fantastisch " + first_name + "! Je kent ze bijna allemaal";
        break;
      case (percentage > 99):
        str = "Geweldig " + first_name + "! Je kent alle woorden in deze overhoring!";
        break;
    }
    return str;
  },

  getGrade: function() {
    return Wrts.helpers.gradeForCountryConfiguration(
      this.model.get("grade"),
      Wrts.data.user.getConfiguration().grade
    );
  },

  getAttempts: function(){
    var attempts = this.model.get("attempts");
    return attempts.map(function(attempt){
      var att = new Wrts.models.Attempt(attempt),
          wrongAnswers= att.get('wrongAnswers'),
          status;

      if(!wrongAnswers || wrongAnswers.length === 0){
        status = 'check';
      } else {
        status = 'close';
      }
      att.set('correct', status);
      return att.toJSON();
    });
  }
});
