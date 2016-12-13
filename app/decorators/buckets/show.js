Wrts.decorators.Buckets.Show = Wrts.BaseDecorator.extend({

  getData: function() {
    var uniqSubjects = Wrts.data.lists.getUniqSubjects(),
        subjects = [],
        isArchivedVisible = this.viewState.get("showArchivedLists"),
        buckets = this.getBuckets(),
        streamed_lists     = Wrts.data.streamed_lists,
        bucket_id = this.model.id,
        archivedListsCount = this.getArchivedCount();

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

    var lists = this.getGroupedCollection(isArchivedVisible);
    var user = Wrts.data.user.get("username");

    return _.extend({
      user: user,
      lists: lists,
      bucketId: bucket_id,
      keywords: uniqSubjects,
      streamedLists: streamed_lists,
      anyStreamedLists: streamed_lists.length > 0,
      listsPresent: this.listsPresent(lists),
      configuration: Wrts.data.user.configuration,
      subjects: subjects,
      buckets: buckets,
      restriction: Wrts.data.restriction.attributes,
      bucketsClosed: this.readFromPopstate("buckets"),
      reachedListLimit: this.reachedListLimit(),
      reachedBucketLimit: this.reachedBucketLimit(),
      subjectsClosed: this.readFromPopstate("subjects"),
      isArchivedVisible: isArchivedVisible,
      archivedListsCount: archivedListsCount,
      subscriptionTypes: this.getSubscriptionTypes(),
      subscriptionPlans: this.getPlans(),
      isAnyArchived: archivedListsCount > 0,
      bucketNewPage: true,
      lastResults: this.getLastResults().slice(0,4),
      account: Wrts.data.user.attributes,
      isBucketOwner: this.checkIfIsBucketOwner(),
      isMobileDevice: (screen.width <= 640)
    }, this.model.toJSON() );
  },

  checkIfIsBucketOwner: function() {
    return (this.model.get('user_id') === Wrts.data.user.attributes.id);
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

  listsPresent: function(lists) {
    return ($.isEmptyObject(lists) === false);
  },

  readFromPopstate: function(type) {
    return (localStorage.getItem(type) === "hide");
  },

  getBuckets: function() {
    var buckets = []
    Wrts.data.buckets.models.map(function(bucket) {
      buckets.push(bucket.toJSON());
    });
    return buckets
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
  }

});
