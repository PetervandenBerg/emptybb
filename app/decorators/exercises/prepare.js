(function() {
  var visibleConfigurationOptions = [
    "shuffle",
    "punctuation",
    "diacritics",
    "capitals",
    "repeat",
    "auto_speak_answer",
    "auto_speak_question",
    "is_right_answer",
    "stop_timer"
  ];

  Wrts.decorators.Exercises.Prepare = Wrts.BaseDecorator.extend({
    getData: function(qaSubjects) {
      var activeExerciseTypeKey = this.viewState.get("exerciseTypeKey"),
          configuration         = this.viewState.get("configuration"),
          showSelectList        = this.viewState.get("showSelectList"),
          restriction = Wrts.data.restriction,
          streamed_lists = Wrts.data.streamed_lists,
          buckets = this.getBuckets(),
          uniqSubjects = Wrts.data.lists.getUniqSubjects(),
          subjects = [], 
          activeExerciseType,
          selectedListIds,
          exerciseTypes,
          selectedQAs,
          lists;

      for (var i = 0, n = uniqSubjects.length; i < n; i++) {
        subjects.push({
          subject: uniqSubjects[i],
        });
      }

      selectedListIds = qaSubjects.map(function(mapping) {
        return mapping.get('listId');
      });

      lists = Wrts.data.lists.map(function(list) {
        var listJSON = list.toJSON();
        return _.extend(listJSON, {
          selected: _(selectedListIds).contains(list.id),
          disabled: list.word_count > 0
        });
      });

      configuration = _.pick(configuration, visibleConfigurationOptions);
      selectedQAs = this.convertQASubjects(qaSubjects);
      activeExerciseType = Wrts.data.exerciseTypes.get(activeExerciseTypeKey);
      groupedExerciseTypes = this.getGroupedExerciseTypes(activeExerciseType);

      for (var i = 0, n = groupedExerciseTypes.length; i < n; i++) {
        for (var ii = 0, nn = groupedExerciseTypes[i].exerciseTypes.length; ii < nn; ii++) {
          var exerciseType = groupedExerciseTypes[i].exerciseTypes[ii],
              typeKey      = exerciseType.typeKey;

          exerciseType.disabled = !restriction.get(typeKey);
        }
      }

      return {
        lists: lists,
        subjects: subjects,
        buckets: buckets,
        disableFlashWordSpeed: this.getStopTimer(configuration),
        bucketsClosed: this.readFromPopstate("buckets"),
        restriction: restriction.attributes,
        streamedLists: streamed_lists,
        anyStreamedLists: streamed_lists.length > 0,
        subjectsClosed: this.readFromPopstate("subjects"),
        selectedQAs: selectedQAs,
        configurationSettings: configuration,
        flashWordSpeed: this.getFlashWordSpeed(),
        canStartExercise: selectedQAs && typeof activeExerciseType !== 'undefined',
        isQuestionOnly: this.isQuestionOnly(activeExerciseType),
        subscriptionTypes: this.getSubscriptionTypes(),
        subscriptionPlans: this.getPlans(),
        groupedExerciseTypes: groupedExerciseTypes,
        reachedListLimit: this.reachedListLimit(),
        reachedBucketLimit: this.reachedBucketLimit(),
        isMobileDevice: (screen.width <= 640),
        account: Wrts.data.user.attributes,
        showSelectList: showSelectList
      };
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

    readFromPopstate: function(type) {
      return (localStorage.getItem(type) === "hide");
    },

    getStopTimer: function(configuration) {
      return configuration.stop_timer;
    },

    getFlashWordSpeed: function() {
      return this.viewState.get('configuration').flash_word_speed;
    },

    getBuckets: function() {
      var buckets = []
      Wrts.data.buckets.models.map(function(bucket) {
        buckets.push(bucket.toJSON());
      });
      return buckets
    },

    convertQASubjects: function(qaSubjects) {
      if (qaSubjects.size() === 0) {
        return null;
      }

      return qaSubjects
        .chain()
        .reduce(function(memo, mapping) {
          var qaType = mapping.get('qaType'),
              listId = mapping.get('listId'),
              list = (Wrts.data.lists.get(listId) !== undefined) ? Wrts.data.lists.get(listId) : Wrts.data.streamed_lists.get(listId),
              json = mapping.toJSON();

          if (!_.isObject(memo[listId])) {
            memo[listId] = {
              title: list.get('title'),
              questionSubjects: [],
              answerSubjects: [],
              listId: listId
            };
          }

          memo[listId].questionSubjects.push(_.extend({}, json, {
            qaType: 'question',
            selected: qaType === 'question'
          }));

          memo[listId].answerSubjects.push(_.extend({}, json, {
            qaType: 'answer',
            selected: qaType === 'answer'
          }));

          return memo;
        }, {})
        .map(function(value){
          return value;
        })
        .value();
    },

    getSubjectListArray: function(questionSubjectList) {
      return questionSubjectList.map(function(subject) {
        return subject.subject;
      });
    },

    isQuestionOnly: function(activeExerciseType) {
      if (!activeExerciseType) {
        return false;
      }

      if (this.viewState.get("configuration").isQuestionOnly) {
        return (this.viewState.get("configuration").isQuestionOnly == "true")
      }

      return activeExerciseType.get('isQuestionOnly');
    },

    countInArray: function(array, what) {
      var count = 0;
      for (var i = 0; i < array.length; i++) {
        if (array[i] === what) {
          count++;
        }
      }
      return count;
    },

    getGroupedExerciseTypes: function(model){
      var typeKey = model ? model.get('typeKey') : null;
      return _(Wrts.data.exerciseTypes.toJSON()).chain()
        .map(function(exerciseType){
          return _.extend(exerciseType, {
            active: typeKey === exerciseType.typeKey
          });
        })
        .groupBy(R.prop('typeCategory'))
        .map(function(value, key) {
          return {
            typeCategory: key,
            exerciseTypes: value
          };
        })
        .value();
    }
  });
})();
