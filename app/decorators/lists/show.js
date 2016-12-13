Wrts.decorators.Lists.Show = Wrts.BaseDecorator.extend({
  getData: function() {
    var listCollection      = this.model.getListCollection(),
        listID              = this.model.id,
        wordListsCount      = listCollection.lists.length,
        publisher           = getPublisher(this.model),
        publisherMethod     = getPublisherMethod(this.model),
        isCurrentPublisher  = checkForPublisher(publisher),
        streamed_lists      = Wrts.data.streamed_lists,
        methods             = getMethods(this.model, publisher),
        buckets             = getBuckets(),
        maxWidth            = 100 - (wordListsCount * 2 * 2),
        columnWidth         = Math.floor(maxWidth/wordListsCount) + "%",
        my_profile          = listInMyProfile(),
        headers             = [],
        rows                = [];

    var listReferenceArray = getListReferenceArray();
    var alreadyTransferredList = getAlreadyTransferredList(listReferenceArray, this.model.id);

    for (var i = 0, n = buckets.length; i < n; i++) {
      if (buckets[i].id === this.model.id) {
        buckets[i].active = true;
      }
    }

    function getBuckets() {
      var buckets = [];
      Wrts.data.buckets.models.map(function(bucket) {
        buckets.push(bucket.toJSON());
      });
      return buckets;
    }

    function assignToColumnInRows(words, locale) {
      _(words).each(function(word, rowIndex) {
        if (typeof rows[rowIndex] === 'undefined') {
          rows[rowIndex] = { columns: [] };
        }

        canSpeak = canSpeakWord(word.word, locale);

        word = _.extend({}, word, { locale: locale, speech: canSpeak});
        rows[rowIndex].columns.push(word);
      });
    }

    _(listCollection.lists).each(function(collection) {
      headers.push(collection.subject);
      assignToColumnInRows(collection.words, collection.speech_locale);
    });

    function checkForPublisher(publisher) {
      return (publisher.user_id === Wrts.data.user.id);
    }

    function listInMyProfile() {
      var url = window.location.hash.split('/');
      var id = url[url.length-1];
      var own_list = Wrts.data.lists.get(id);

      if (!own_list) { 
        return false;
      } else {
        return true;
      }
    }

    function getListReferenceArray() {
      return Wrts.data.lists.map(function(list) { 
        return list.get('reference_id');
      });
    }

    function getPublisher(list) {
      if (list.get('original_publisher')) {
        return list.get('original_publisher');
      } else {
        return list.publisher ? list.publisher.toJSON() : ''
      }
    }

    function getPublisherMethod(list) {
      if (list.get('original_publisher_method')) {
        return list.get('original_publisher_method');
      } else {
        return list.publisherMethod ? list.publisherMethod : '';
      }
    }

    function getMethods(list, publisher) {
      if (list.get('original_publisher_methods')) {
        return list.get('original_publisher_methods');
      } else if (publisher) {
        Wrts.data.PublisherMethods = publisher.methods;
        return Wrts.data.PublisherMethods;
      } else {
        return Wrts.data.PublisherMethods;
      }
    }

    function canSpeakWord(word, locale) {
      if (locale && locale.length > 2 || word && word.length > 1000) {
        return false;
      } else {
        return true;
      }
    }

    function getAlreadyTransferredList(listReferenceArray, id) {
      if (listReferenceArray.indexOf(id) > -1) {
        return Wrts.data.lists.find(function(list) {
          return (list.get('reference_id') === id);
        });
      }
    }

    function readFromPopstate(type) {
      return (localStorage.getItem(type) === "hide");
    }

    function reachedListLimit() {
      var account = Wrts.data.user.attributes,
          maxLists = account.max_allowed_lists,
          listLength = Wrts.data.lists.length,
          streamedListlength = Wrts.data.streamed_lists.length;

      var user_list_length = listLength + streamedListlength;
      return user_list_length >= maxLists;
    }

    function reachedBucketLimit() {
      var account = Wrts.data.user.attributes,
          maxBuckets = account.max_allowed_buckets,
          user_bucket_length = Wrts.data.buckets.length;

      return user_bucket_length >= maxBuckets;
    }

    function checkIfUserIsTeacher(){
      return $.isEmptyObject(Wrts.data.user.get('teacher')) === false;
    }

    function getSubscriptionTypes(){
      return Wrts.data.subscription_types.toJSON().reverse();
    }

    function getPlans(){
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
    }

    return _.extend(this.model.toJSON(), {
      bucketsClosed: readFromPopstate("buckets"),
      restriction: Wrts.data.restriction.attributes,
      subjectsClosed: readFromPopstate("subjects"),
      subscriptionTypes: getSubscriptionTypes(),
      subscriptionPlans: getPlans(),
      headers: headers,
      rows: rows,
      isTeacher: checkIfUserIsTeacher,
      buckets: buckets,
      columnWidth: columnWidth,
      listID: listID,
      my_profile: my_profile,
      streamedLists: streamed_lists,
      publisher: publisher,
      publisher_method: {name: publisherMethod},
      methods: methods,
      anyStreamedLists: streamed_lists.length > 0,
      isMobileDevice: (screen.width <= 640),
      reachedListLimit: reachedListLimit(),
      reachedBucketLimit: reachedBucketLimit(),
      account: Wrts.data.user.attributes,
      canBeTransferred: (listReferenceArray.indexOf(this.model.id) === -1),
      alreadyTransferredList: alreadyTransferredList,
      isCurrentPublisher: isCurrentPublisher
    });
  }
});
