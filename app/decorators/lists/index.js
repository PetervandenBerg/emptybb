Wrts.decorators.Lists.Index = Wrts.BaseDecorator.extend({

  getData: function() {
    var uniqSubjects = Wrts.data.lists.getUniqSubjects(),
        streamed_lists = Wrts.data.streamed_lists,
        subjects = [],
        showExplanation1 = this.checkLocalStorage(),
        isArchivedVisible = this.viewState.get("showArchivedLists"),
        account = Wrts.data.user.attributes,
        activeSubject = Wrts.data.lists.getActiveSubject(),
        buckets = this.getBuckets(),
        restriction = Wrts.data.restriction.attributes,
        archivedListsCount = this.getArchivedCount();

    for (var i = 0, n = uniqSubjects.length; i < n; i++) {
      subjects.push({
        subject: uniqSubjects[i],
        active: activeSubject === uniqSubjects[i]
      });
    }

    var lists = this.getGroupedCollection(isArchivedVisible),
        user = Wrts.data.user.get("username");

    return {
      bucketsClosed: this.readFromPopstate("buckets"),
      subjectsClosed: this.readFromPopstate("subjects"),
      user: user,
      account: account,
      configuration: Wrts.data.user.configuration,
      reachedListLimit: this.reachedListLimit(),
      reachedBucketLimit: this.reachedBucketLimit(),
      lists: lists,
      listsPresent: this.listsPresent(lists),
      subscription: this.getSubscription(),
      keywords: uniqSubjects,
      restriction: restriction,
      showExplanation1: showExplanation1,
      subjects: subjects,
      subscriptionTypes: this.getSubscriptionTypes(),
      subscriptionPlans: this.getPlans(),
      isMyList: this.isMyList(lists),
      buckets: buckets,
      isRootPage: this.checkForRootPage(),
      streamedLists: streamed_lists,
      isArchivedVisible: isArchivedVisible,
      isSubjectRootActive: activeSubject === null,
      archivedListsCount: archivedListsCount,
      isAnyArchived: archivedListsCount > 0,
      anyStreamedLists: streamed_lists.length > 0,
      lastResults: this.getLastResults().slice(0,4),
      account: Wrts.data.user.attributes,
      isRootPage: true,
      isMobileDevice: (screen.width <= 750)
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

  isMyList: function(lists) {
    if (this.collection.models.length > 0) { 
      var sharedUserId = this.collection.models[0].attributes.user_id,
          userId = Wrts.data.user.id;
      return (userId === sharedUserId);
    } else {
      return false
    }
  },

  checkForRootPage: function(){
    return (window.location.hash == "");
  },

  listsPresent: function(lists) {
    return ($.isEmptyObject(lists) === false);
  },

  readFromPopstate: function(type) {
    return (localStorage.getItem(type) === "hide");
  },

  getBuckets: function() {
    return Wrts.data.buckets.models.map(function(bucket) {
      return bucket.toJSON();
    });
  },

  getGroupedCollection: function(isArchivedVisible){
    var grouped = this.collection.chain()
      .groupBy(function(list){
        return list.getSubjects()
          .map(R.appl(Wrts.helpers.capitalize))
          .join('||');
      }).value();

    _(grouped).each(function(result, key){
      grouped[key] = _(result).map(function(obj){
        return obj.toJSON();
      });
    });

    return grouped;
  },

  getLastResults: function() {
    return Wrts.data.results.groupedForLatestResults();
  },

  getArchivedCount: function(){
    return this.collection.filter(R.prop("archived")).length;
  },

  checkLocalStorage: function() {
    if (localStorage.popStateExplanation1) {
       return false;
    } else {
       return true;
    }
  },

  getSubscription: function() {
    var subscription = Wrts.data.subscription.attributes;

    if ($.isEmptyObject(subscription) === false) {
      return subscription;
    } else {
      return false;
    }
  }

});
