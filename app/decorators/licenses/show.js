Wrts.decorators.Licenses.Show = Wrts.BaseDecorator.extend({
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

    return _.extend(this.model.toJSON(), {
      user: user,
      account: Wrts.data.user.attributes,
      subjects: subjects,
      subscription: this.getSubscription(),
      bucketsClosed: this.readFromPopstate("buckets"),
      isLicensesPage: true,
      anyStreamedLists: streamed_lists.length > 0,
      licensesPresent: this.licensesPresent(),
      streamedLists: streamed_lists,
      restriction: Wrts.data.restriction.attributes,
      subjectsClosed: this.readFromPopstate("subjects"),
      buckets: buckets
    });
  },

  licensesPresent: function(account) {
    return (Wrts.data.licenses.length > 0)
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
