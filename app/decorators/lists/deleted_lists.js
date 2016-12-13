Wrts.decorators.Lists.DeletedLists = Wrts.BaseDecorator.extend({

  getData: function() {
    var uniqSubjects = Wrts.data.lists.getUniqSubjects(),
        streamed_lists = Wrts.data.streamed_lists,
        subjects = [],
        buckets = this.getBuckets();

    for (var i = 0, n = uniqSubjects.length; i < n; i++) {
      subjects.push({
        subject: uniqSubjects[i],
      });
    }

    var lists = this.getGroupedCollection();
    var user = Wrts.data.user.get("username");

    return {
      user: user,
      lists: lists,
      keywords: uniqSubjects,
      subjects: subjects,
      listsPresent: this.listsPresent(lists),
      streamedLists: streamed_lists,
      bucketsClosed: this.readFromPopstate("buckets"),
      restriction: Wrts.data.restriction.attributes,
      subjectsClosed: this.readFromPopstate("subjects"),
      anyStreamedLists: streamed_lists.length > 0,
      buckets: buckets,
      isMobileDevice: (screen.width <= 640),
      account: Wrts.data.user.attributes,
      reachedListLimit: this.reachedListLimit(),
      subscriptionTypes: this.getSubscriptionTypes(),
      subscriptionPlans: this.getPlans(),
      reachedBucketLimit: this.reachedBucketLimit(),
      isDeleteListsPage: true,
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

  listsPresent: function(lists) {
    return ($.isEmptyObject(lists) === false);
  },

  getBuckets: function() {
    return Wrts.data.buckets.models.map(function(bucket) {
      return bucket.toJSON();
    });
  },

  readFromPopstate: function(type) {
    return (localStorage.getItem(type) === "hide");
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

});
