Wrts.decorators.Results.Index = Wrts.BaseDecorator.extend({
  getData: function() {
    var configuration = Wrts.data.user.getConfiguration(),
        uniqSubjects = Wrts.data.lists.getUniqSubjects(),
        streamed_lists = Wrts.data.streamed_lists,
        activeSubject = Wrts.data.lists.getActiveSubject(),
        subjects = [],
        buckets = this.getBuckets();

    for (var i = 0, n = uniqSubjects.length; i < n; i++) {
      subjects.push({
        subject: uniqSubjects[i],
        active: activeSubject === uniqSubjects[i]
      });
    }

    var results = this.collection.map(function(result){
      var json = result.toJSON();
      json.formattedGrade = Wrts.helpers.gradeForCountryConfiguration(json.grade, configuration.grade);
      json.duration = Wrts.helpers.humanizeDuration(result.getTotalAttemptDuration());
      return json;
    });

    var groupedResults = _.groupBy(results, "user_id");

    return {
      title: this.model.get('title'),
      id: this.model.get('id'),
      list: this.model.toJSON(),
      subjects: subjects,
      buckets: buckets,
      reachedListLimit: this.reachedListLimit(),
      reachedBucketLimit: this.reachedBucketLimit(),
      bucketsClosed: this.readFromPopstate("buckets"),
      restriction: Wrts.data.restriction.attributes,
      streamedLists: streamed_lists,
      anyStreamedLists: streamed_lists.length > 0,
      subjectsClosed: this.readFromPopstate("subjects"),
      isMobileDevice: (screen.width <= 640),
      account: Wrts.data.user.attributes,
      results: groupedResults,
      othersResults: this.canShowResultsFromOthers(groupedResults)
   };
  },

  canShowResultsFromOthers: function(groupedResults) {
    return Wrts.data.user.configuration.results_from_others;
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
    return Wrts.data.buckets.models.map(function(bucket) {
      return bucket.toJSON();
    });
  },

});
