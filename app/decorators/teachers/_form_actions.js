Wrts.decorators.Teachers._FormActions = Wrts.BaseDecorator.extend({
  getData: function(clone) {
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
      user: user,
      subjects: subjects,
      bucketsClosed: this.readFromPopstate("buckets"),
      restriction: Wrts.data.restriction.attributes,
      school_associations: Wrts.data.school_association.attributes,
      school_places: Wrts.data.school_place.attributes,
      subjectsClosed: this.readFromPopstate("subjects"),
      advertisement_url: 'bucket_new',
      buckets: buckets
    }, clone.toJSON() );
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
