Wrts.decorators.Transactions.Licenses = Wrts.BaseDecorator.extend({
  getData: function() {
    var uniqSubjects = Wrts.data.lists.getUniqSubjects(),
        subjects = [],
        buckets = this.getBuckets(),
        subscription_types = Wrts.data.subscription_types,
        streamed_lists = Wrts.data.streamed_lists;

    for (var i = 0, n = uniqSubjects.length; i < n; i++) {
      subjects.push({
        subject: uniqSubjects[i],
      });
    }

    var lists = this.getGroupedCollection();
    var user = Wrts.data.user.get("username");

    return _.extend({
      user: user,
      isFreeUser: this.isFreeUser(),
      lists: lists,
      hideSidebar: this.hideSidebar(),
      isMobileDevice: (screen.width <= 640),
      subscription_types: subscription_types,
      user_first_name: Wrts.data.user.get("first_name"),
      account: Wrts.data.user.attributes,
      keywords: uniqSubjects,
      reachedListLimit: this.reachedListLimit(),
      reachedBucketLimit: this.reachedBucketLimit(),
      anyStreamedLists: streamed_lists.length > 0,
      dateToday: new Date(Date.now()).toLocaleString().split(' ')[0],
      dateNextYear: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleString().split(' ')[0],
      isCentered: true,
      subjects: subjects,
      buckets: buckets, 
      bucketsClosed: this.readFromPopstate("buckets"),
      restriction: Wrts.data.restriction.attributes,
      subscription: this.getSubscription(),
      teacherRequested: this.checkForTeacherRequest(),
      subjectsClosed: this.readFromPopstate("subjects")
    });
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

  checkForTeacherRequest: function() {
    return (Wrts.data.user.get('role') === "Pre-leraar" || Wrts.data.user.get('role') === "Leraar");
  },

  getSubscription: function() {
    if (jQuery.isEmptyObject(Wrts.data.subscription.attributes)) {
      return false;
    } else {
      return Wrts.data.subscription.attributes;
    }
  },

  hideSidebar: function() {
    return (_.isEmpty(Wrts.data.subscription.attributes) && Wrts.data.user.get('role') == "Verlopen");
  },

  isFreeUser: function() {
    return Wrts.data.user.get('role') == "Basis"
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
