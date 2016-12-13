Wrts.decorators.Transactions.Succes = Wrts.BaseDecorator.extend({
  getData: function() {
    var uniqSubjects = Wrts.data.lists.getUniqSubjects(),
        streamed_lists = Wrts.data.streamed_lists,
        subjects = [],
        buckets = this.getBuckets(),
        user = Wrts.data.user.get("username");

    for (var i = 0, n = uniqSubjects.length; i < n; i++) {
      subjects.push({
        subject: uniqSubjects[i],
      });
    }

    return _.extend({
      user: user,
      account: Wrts.data.user.attributes,
      subjects: subjects,
      subscription: this.getSubscription(),
      bucketsClosed: this.readFromPopstate("buckets"),
      anyStreamedLists: streamed_lists.length > 0,
      subscriptionShowPage: true,
      streamedLists: streamed_lists,
      restriction: Wrts.data.restriction.attributes,
      typeName: Wrts.data.subscription.get('type_name'),
      subjectsClosed: this.readFromPopstate("subjects"),
      advertisement_url: 'bucket_new',
      buckets: buckets
    });
  },

  getSubscription: function() {
    if (jQuery.isEmptyObject(Wrts.data.subscription.attributes)) {
      return false;
    } else {
      return Wrts.data.subscription.attributes;
    }
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
