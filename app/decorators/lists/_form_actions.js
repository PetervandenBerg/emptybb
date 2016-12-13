Wrts.decorators.Lists._FormActions = Wrts.BaseDecorator.extend({
  getData: function(clone) {
    var listSubjects            = this.getSubjects(clone),
        uniqSubjects            = Wrts.data.lists.getUniqSubjects(),
        validationMessages      = this.viewState.get('validationMessages') || [],
        showExplanation         = this.checkLocalStorage(),
        streamed_lists          = Wrts.data.streamed_lists,
        cover                   = this.getCover(),
        multipleColumns         = (listSubjects.length > 1),
        buckets                 = this.getBuckets(),
        school_chapters         = Wrts.data.school_chapters.models,
        school_subjects         = Wrts.data.school_subjects.models,
        school_years            = Wrts.data.school_years.models,
        school_levels           = Wrts.data.school_levels.models,
        school_book_editions    = Wrts.data.school_book_editions.models,
        subjects                = [],
        streamed_lists          = Wrts.data.streamed_lists,
        WordFormuleTypeChecked  = this.checkIfWordFormuleTypeChecked(clone),
        publisher_method        = this.getPublisherMethod(),
        publisher               = this.getPublisher(),
        isCurrentPublisher      = this.checkForPublisher(publisher),
        publisherListOpened     = this.checkIfPublisherListOpened(clone),
        all_publishers          = this.collection,
        name_publisher_method   = this.getPublisherListPublisherMethod(clone),
        methods                 = this.getMethods();

    _(listSubjects).each( function(subject, index) {
      subject.isFirstSubject = index === 0;
      subject.isLastSubject = index === (listSubjects.length - 1);
      subject.showDeleteButton = (index === listSubjects.length - 1 );
    });

    if (all_publishers) {
      for (var i = 0, n = all_publishers.length; i < n; i++) {
        if (all_publishers[i].id === clone.get('publisher')) {
          all_publishers[i].selected = true;
        } else {
          all_publishers[i].selected = false;
        }
      }
    }

    for (var i = 0, n = school_book_editions.length; i < n; i++) {
      if (school_book_editions[i].id === clone.get('school_book_edition')) {
        school_book_editions[i].selected = true;
      } else {
        school_book_editions[i].selected = false;
      }
    }

    for (var i = 0, n = school_years.length; i < n; i++) {
      if (school_years[i].id === clone.get('school_year')) {
        school_years[i].selected = true;
      } else {
        school_years[i].selected = false;
      }
    }

    for (var i = 0, n = school_levels.length; i < n; i++) {
      if (school_levels[i].id === clone.get('school_level')) {
        school_levels[i].selected = true;
      } else {
        school_levels[i].selected = false;
      }
    }

    for (var i = 0, n = school_subjects.length; i < n; i++) {
      if (school_subjects[i].id === clone.get('school_subject')) {
        school_subjects[i].selected = true;
      } else {
        school_subjects[i].selected = false;
      }
    }

    for (var i = 0, n = school_chapters.length; i < n; i++) {
      if (String(school_chapters[i].get("name")) === clone.get('school_chapter')) {
        school_chapters[i].selected = true;
      } else {
        school_chapters[i].selected = false;
      }
    }

    for (var i = 0, n = uniqSubjects.length; i < n; i++) {
      subjects.push({
        subject: uniqSubjects[i],
      });
    }

    for (var i = 0, n = buckets.length; i < n; i++) {
      if (buckets[i].id === this.model.id) {
        buckets[i].active = true;
      }
    }

    return _.extend({
      showExtraPunctuationMarks: Wrts.data.user.getConfiguration().punctuation_marks,
      cover: cover,
      all_publishers: all_publishers,
      publisher_method: publisher_method,
      publisher: publisher,
      WordFormuleTypeChecked: WordFormuleTypeChecked,
      school_chapters: school_chapters,
      school_subjects: school_subjects,
      school_years: school_years,
      school_levels: school_levels,
      school_book_editions: school_book_editions,
      methods: methods,
      buckets: buckets,
      subjects: subjects,
      name_publisher_method: name_publisher_method,
      listSubjects: listSubjects,
      publisherListOpened: publisherListOpened,
      streamedLists: streamed_lists,
      isCurrentPublisher: isCurrentPublisher,
      anyStreamedLists: streamed_lists.length > 0,
      isMobileDevice: (screen.width <= 640),
      isListCreatePage: true,
      account: Wrts.data.user.attributes,
      multipleColumns: multipleColumns,
      showExplanation: showExplanation,
      isAddWordListAllowed: listSubjects.length < 7,
      gridCssClass: this.getGridCssClass(listSubjects.length),
      speechLocales: this.getSpeechLocales(),
      bucketsClosed: this.readFromPopstate("buckets"),
      restriction: Wrts.data.restriction.attributes,
      subjectsClosed: this.readFromPopstate("subjects"),
      reachedListLimit: this.reachedListLimit(),
      subscriptionTypes: this.getSubscriptionTypes(),
      subscriptionPlans: this.getPlans(),
      reachedBucketLimit: this.reachedBucketLimit(),
      validationMessages: validationMessages
    }, clone.toJSON() );
  },

  reachedListLimit: function() {
    var account = Wrts.data.user.attributes,
        maxLists = account.max_allowed_lists,
        listLength = Wrts.data.lists.length,
        streamedListlength = Wrts.data.streamed_lists.length;

    var user_list_length = listLength + streamedListlength;
    return user_list_length >= maxLists;
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

  reachedBucketLimit: function() {
    var account = Wrts.data.user.attributes,
        maxBuckets = account.max_allowed_buckets,
        user_bucket_length = Wrts.data.buckets.length;

    return user_bucket_length >= maxBuckets;
  },

  getPublisherListPublisherMethod: function(clone) {
    if (clone.get('name_publisher_method')) {
      return clone.get('name_publisher_method');
    }
  },

  readFromPopstate: function(type) {
    return (localStorage.getItem(type) === "hide");
  },

  checkLocalStorage: function() {
    if (localStorage.popStateExplanation) {
       return false;
    } else {
       return true;
    }
  },

  checkIfWordFormuleTypeChecked: function(clone) {
    return (clone.get('formula_type') != "formulas");
  },

  checkForPublisher: function(publisher){
    if (publisher) {
      var user_id = publisher.user_id ? publisher.user_id : publisher.get('user_id');
      return (user_id === Wrts.data.user.id);
    } else {
      return false
    }
  },

  getBuckets: function() {
    var buckets = []
    Wrts.data.buckets.models.map(function(bucket) {
      buckets.push(bucket.toJSON());
    });
    return buckets
  },

  getCover: function() {
    return this.model.cover;
  },

  getPublisherMethod: function(){
    if (this.model.cover !== undefined) {
      return this.model.cover.get('publisher_method');
    }
  },

  getPublisher: function(){
    if (this.model.cover !== undefined) {
      return this.model.cover.get('publisher');
    }
  },

  getMethods: function(){
    if (this.model.cover !== undefined) {
      return this.model.cover.get('methods');
    }
  },

  getSubjects: function(clone) {
    var lists             = _(clone.getListCollection().lists),
        tabIndexOffset    = 1,
        subjectStartIndex = 2,
        numberOfSubjects  = lists.size();

    tabIndexOffset += numberOfSubjects; // for listSubjects
    tabIndexOffset += numberOfSubjects; // for speech select box

    return lists.map(function(list, listIndex) {
      var words = _(list.words).map(function(word, index) {
        return _.extend(word, {
          tabIndex: Wrts.helpers.getTabindexForWord({
            numberOfSubjects: numberOfSubjects,
            index: index,
            listIndex: listIndex
          })
        });
      });

      var subjectIndex = subjectStartIndex + listIndex;

      return {
        listIndex:    listIndex,
        subjectIndex: subjectIndex,
        speechIndex:  subjectIndex + numberOfSubjects,
        subject:      $.trim(list.subject),
        words:        words,
        speechLocale: list.speech_locale
      };
    });
  },

  getGridCssClass: function(numberOfSubjects){
    var maxColumns = 12,
        width;

    width = Math.floor(maxColumns/numberOfSubjects);
    return "col-xs-" + width;
  },

  getSpeechLocales: function() {
    return Wrts.data.speechLocales.map(function(speechLocale) {
      var restriction = Wrts.data.restriction.attributes,
          speech_restriction = !restriction.speech,
          locale = speechLocale.get("locale");

      if (speech_restriction) {
        if ($.inArray(locale, ['nl', 'fr', 'es', 'en', 'de']) != -1) {
          return locale.toUpperCase();
        }
      } else {
        return locale.toUpperCase();
      }
    }).filter(function(speech){ return speech != undefined });
  },

  checkIfPublisherListOpened: function(clone) {
    if (clone.get('publisher_list')) {
      if (clone.get('publisher_list').opened == "true") {
        return true;
      }
    }
    return false;
  }

});
