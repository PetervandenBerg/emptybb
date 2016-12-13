Wrts.decorators.Buckets._FormActions = Wrts.BaseDecorator.extend({
  getData: function(clone) {
    var uniqSubjects = Wrts.data.lists.getUniqSubjects(),
        subjects = [],
        buckets = this.getBuckets(),
        streamed_lists = Wrts.data.streamed_lists,
        user = Wrts.data.user.get("username");

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
      user: user,
      subjects: subjects,
      streamedLists: streamed_lists,
      anyStreamedLists: streamed_lists.length > 0,
      bucketsClosed: this.readFromPopstate("buckets"),
      restriction: Wrts.data.restriction.attributes,
      reachedListLimit: this.reachedListLimit(),
      reachedBucketLimit: this.reachedBucketLimit(),
      subjectsClosed: this.readFromPopstate("subjects"),
      bucketNewPage: true,
      isMobileDevice: (screen.width <= 640),
      account: Wrts.data.user.attributes,
      isBucketOwner: this.checkIfIsBucketOwner(),
      buckets: buckets
    }, clone.toJSON() );
  },

  checkIfIsBucketOwner: function() {
    if (this.model.get('id')) {
      return (this.model.get('user_id') === Wrts.data.user.attributes.id);
    } else {
      return true;
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
  },
});
