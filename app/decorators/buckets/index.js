Wrts.decorators.Buckets.Index = Wrts.BaseDecorator.extend({

  getData: function() {
    var buckets = this.getBuckets(),
        streamed_lists = Wrts.data.streamed_lists,
        user = Wrts.data.user.get("username");

    return {
      user: user,
      streamedLists: streamed_lists,
      anyStreamedLists: streamed_lists.length > 0,
      buckets: buckets,
      bucketsPresent: buckets.length > 0,
      restriction: Wrts.data.restriction.attributes,
      bucketsClosed: this.readFromPopstate("buckets"),
      reachedListLimit: this.reachedListLimit(),
      reachedBucketLimit: this.reachedBucketLimit(),
      subscriptionTypes: this.getSubscriptionTypes(),
      subscriptionPlans: this.getPlans(),
      account: Wrts.data.user.attributes,
      isMobileDevice: (screen.width <= 640)
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

  getBuckets: function() {
    var buckets = []
    Wrts.data.buckets.models.map(function(bucket) {
      buckets.push(bucket.toJSON());
    });
    return buckets
  }
});
