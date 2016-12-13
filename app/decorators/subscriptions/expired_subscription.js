Wrts.decorators.Subscriptions.ExpiredSubscription = Wrts.BaseDecorator.extend({
  getData: function() {
    var uniqSubjects = Wrts.data.lists.getUniqSubjects(),
        subjects = [],
        buckets = this.getBuckets(),
        user = Wrts.data.user.get("username");

    for (var i = 0, n = uniqSubjects.length; i < n; i++) {
      subjects.push({
        subject: uniqSubjects[i],
      });
    }

    return _.extend({
      isFreeUser: this.isFreeUser(),
      account: Wrts.data.user.attributes,
      user: user,
      subjects: subjects,
      subscription: Wrts.data.subscription.attributes,
      bucketsClosed: this.readFromPopstate("buckets"),
      restriction: Wrts.data.restriction.attributes,
      subjectsClosed: this.readFromPopstate("subjects"),
      advertisement_url: 'bucket_new',
      buckets: buckets
    });
  },

  readFromPopstate: function(type) {
    return (localStorage.getItem(type) === "hide");
  },

  isFreeUser: function() {
    return false
  },

  getBuckets: function() {
    var buckets = []
    Wrts.data.buckets.models.map(function(bucket) {
      buckets.push(bucket.toJSON());
    });
    return buckets
  },
});
