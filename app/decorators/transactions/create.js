Wrts.decorators.Transactions.Create = Wrts.BaseDecorator.extend({
  getData: function() {
    var uniqSubjects = Wrts.data.lists.getUniqSubjects(),
        validationMessages = this.viewState.get('validationMessages') || [],
        subjects = [],
        buckets = this.getBuckets(),
        subscription_types = this.getSubscriptionTypes(),
        streamed_lists = Wrts.data.streamed_lists;

    for (var i = 0, n = uniqSubjects.length; i < n; i++) {
      subjects.push({
        subject: uniqSubjects[i],
      });
    }

    var lists = this.getGroupedCollection(),
        user = Wrts.data.user.get("username"),
        planName = this.getPlanName();

    return _.extend({
      user: user,
      validationMessages: validationMessages,
      lists: lists,
      subscription_types: subscription_types,
      hideSidebar: this.hideSidebar(),
      keywords: uniqSubjects,
      plans : this.getPlans(),
      isCentered: true,
      reachedListLimit: this.reachedListLimit(),
      reachedBucketLimit: this.reachedBucketLimit(),
      isMobileDevice: (screen.width <= 640),
      anyStreamedLists: streamed_lists.length > 0,
      subjects: subjects,
      buckets: buckets, 
      planName: planName,
      subscriptionTypes: this.getSubscriptionTypes2(),
      subscriptionPlans: this.getPlans2(),
      account: Wrts.data.user.attributes,
      isUpgradePlan: this.checkForUpgrade(planName),
      bucketsClosed: this.readFromPopstate("buckets"),
      restriction: Wrts.data.restriction.attributes,
      subscription: Wrts.data.subscription.attributes,
      subjectsClosed: this.readFromPopstate("subjects")
    }, this.model.toJSON() );
  },

  getSubscriptionTypes2: function(){
    return Wrts.data.subscription_types.toJSON().reverse();
  },

  getPlans2: function(){
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

  hideSidebar: function() {
    return (_.isEmpty(Wrts.data.subscription.attributes) && Wrts.data.user.get('role') == "Verlopen");
  },

  getPlanName: function() {
    var planName = this.model.get('type');
    return planName.charAt(0).toUpperCase() + planName.slice(1);
  },

  checkForUpgrade: function(plan) {
    return (plan != Wrts.data.subscription.get('type_name'));
  },

  getPlans: function(){
    var selectedType = this.model.get('type');
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

  readFromPopstate: function(type) {
    return (localStorage.getItem(type) === "hide");
  },

  getSubscriptionTypes: function() {
    return Wrts.data.subscription_types;
  },

  getBuckets: function() {
    var buckets = []
    Wrts.data.buckets.models.map(function(bucket) {
      buckets.push(bucket.toJSON());
    });
    return buckets
  },

  getGroupedCollection: function(){
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
  }

});
