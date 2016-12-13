Wrts.decorators.Subscriptions.Show = Wrts.BaseDecorator.extend({
  getData: function() {
    var uniqSubjects = Wrts.data.lists.getUniqSubjects(),
        streamed_lists = Wrts.data.streamed_lists,
        subjects = [],
        buckets = this.getBuckets(),
        account = Wrts.data.user.attributes,
        user = Wrts.data.user.get("username");

    for (var i = 0, n = uniqSubjects.length; i < n; i++) {
      subjects.push({
        subject: uniqSubjects[i],
      });
    }

    return _.extend(this.model.toJSON(), {
      user: user,
      account: account,
      subjects: subjects,
      subscription: this.getSubscription(),
      bucketsClosed: this.readFromPopstate("buckets"),
      license: this.getLicenseFrom(account),
      anyStreamedLists: streamed_lists.length > 0,
      subscriptionShowPage: true,
      licensesPresent: this.licensesPresent(),
      streamedLists: streamed_lists,
      restriction: Wrts.data.restriction.attributes,
      subjectsClosed: this.readFromPopstate("subjects"),
      advertisement_url: 'bucket_new',
      buckets: buckets
    });
  },

  licensesPresent: function(account) {
    return (Wrts.data.licenses.length > 0)
  },

  getLicenseFrom: function(account) {
    if (account.license) {
      return account.license[0];
    }
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
