Wrts.decorators.Lists.RecentLists = Wrts.BaseDecorator.extend({

  getData: function() {
    var streamed_lists = Wrts.data.streamed_lists,
        lists = this.collection.models,
        buckets = this.getBuckets();

    var user = Wrts.data.user.get("username");

    return {
      user: user,
      configuration: Wrts.data.user.configuration,
      account: Wrts.data.user.attributes,
      lists: this.sortByDate(lists),
      streamedLists: streamed_lists,
      bucketsClosed: this.readFromPopstate("buckets"),
      anyStreamedLists: streamed_lists.length > 0,
      reachedListLimit: this.reachedListLimit(),
      subscriptionTypes: this.getSubscriptionTypes(),
      subscriptionPlans: this.getPlans(),
      isMobileDevice: (screen.width <= 640),
      reachedBucketLimit: this.reachedBucketLimit(),
      restriction: Wrts.data.restriction.attributes,
      buckets: buckets,
      isRecentListsPage: true
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

  sortByDate: function(lists) {
    sorted_lists = _.sortBy(lists, function(model){
      return model.get('updated_at');
    });
    return sorted_lists.reverse().slice(0,10);
  },

  getBuckets: function() {
    return Wrts.data.buckets.models.map(function(bucket) {
      return bucket.toJSON();
    });
  },

  readFromPopstate: function(type) {
    return (localStorage.getItem(type) === "hide");
  },

});
