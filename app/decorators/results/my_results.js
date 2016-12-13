Wrts.decorators.Results.MyResults = Wrts.BaseDecorator.extend({
  getData: function() {
    var uniqSubjects = Wrts.data.lists.getUniqSubjects(),
        streamed_lists = Wrts.data.streamed_lists,
        activeSubject = Wrts.data.lists.getActiveSubject(),
        subjects = [],
        results = this.getResults(),
        buckets = this.getBuckets();

    for (var i = 0, n = uniqSubjects.length; i < n; i++) {
      subjects.push({
        subject: uniqSubjects[i],
        active: activeSubject === uniqSubjects[i]
      });
    }

    return _.extend({
      subjects: subjects,
      buckets: buckets,
      results: this.sortByDate(results),
      currentWeekNumber: this.findCurrentWeekNumber(),
      isMobileDevice: (screen.width <= 640),
      resultsPresent: results.length > 0,
      account: Wrts.data.user.attributes,
      resultLength: results.length,
      isMyResultsPage: true,
      bucketsClosed: this.readFromPopstate("buckets"),
      restriction: Wrts.data.restriction.attributes,
      streamedLists: streamed_lists,
      anyStreamedLists: streamed_lists.length > 0,
      reachedListLimit: this.reachedListLimit(),
      reachedBucketLimit: this.reachedBucketLimit(),
      subjectsClosed: this.readFromPopstate("subjects"),
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

  readFromPopstate: function(type) {
    return (localStorage.getItem(type) === "hide");
  },

  getBuckets: function() {
    return Wrts.data.buckets.models.map(function(bucket) {
      return bucket.toJSON();
    });
  },

  getResults: function() {
    return Wrts.data.results.models.map(function(result) {
      return result.toJSON();
    });
  },

  sortByDate: function(results) {
    sorted_results = _.sortBy(results, function(model){
      return model.created_at;
    });
    return sorted_results.reverse();
  },

  findCurrentWeekNumber: function() {
    Date.prototype.getWeek = function() {
      var onejan = new Date(this.getFullYear(),0,1);
      var today = new Date(this.getFullYear(),this.getMonth(),this.getDate());
      var dayOfYear = ((today - onejan +1)/86400000);
      return Math.ceil(dayOfYear/7)
    };
    var today = new Date();
    return today.getWeek();
  }
});
