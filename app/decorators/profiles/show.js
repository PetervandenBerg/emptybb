Wrts.decorators.Profiles.Show = Wrts.BaseDecorator.extend({

  getData: function() {
    var uniqSubjects = Wrts.data.user_lists.getUniqSubjects(),
        subjects = [],
        isArchivedVisible = this.viewState.get("showArchivedLists"),
        activeSubject = Wrts.data.user_lists.getActiveSubject(),
        buckets = this.getBuckets(),
        streamed_lists     = Wrts.data.streamed_lists,
        archivedListsCount = this.getArchivedCount();

    for (var i = 0, n = uniqSubjects.length; i < n; i++) {
      subjects.push({
        subject: uniqSubjects[i],
        active: activeSubject === uniqSubjects[i].toLowerCase()
      });
    }

    var lists = this.getGroupedCollection(isArchivedVisible);
    var user = Wrts.data.user.get("username");

    return {
      bucketsClosed: this.readFromPopstate("buckets"),
      restriction: Wrts.data.restriction.attributes,
      subjectsClosed: this.readFromPopstate("subjects"),
      user: user,
      lists: lists,
      listsPresent: this.listsPresent(lists),
      full_name: this.model.full_name,
      user_description: this.model.description,
      keywords: uniqSubjects,
      subjects: subjects,
      streamedLists: streamed_lists,
      anyStreamedLists: streamed_lists.length > 0,
      buckets: buckets,
      isArchivedVisible: isArchivedVisible,
      isSubjectRootActive: activeSubject === null,
      archivedListsCount: archivedListsCount,
      reachedListLimit: this.reachedListLimit(),
      reachedBucketLimit: this.reachedBucketLimit(),
      isAnyArchived: archivedListsCount > 0,
      isMobileDevice: (screen.width <= 640),
      account: Wrts.data.user.attributes,
      lastResults: this.getLastResults().slice(0,4)
    };
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

  listsPresent: function(lists) {
    return ($.isEmptyObject(lists) === false);
  },

  readFromPopstate: function(type) {
    return (localStorage.getItem(type) === "hide");
  },

  getBuckets: function() {
    return Wrts.data.buckets.models.map(function(bucket) {
      return bucket.toJSON();
    });
  },

  getGroupedCollection: function(isArchivedVisible){
    var grouped = this.collection.chain()
      .filter(function(list){
        return (
          isArchivedVisible ||
          (!isArchivedVisible && !list.get("archived"))
        );
      })
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
  },

  getLastResults: function() {
    return Wrts.data.results.groupedForLatestResults();
  },

  getArchivedCount: function(){
    return this.collection.filter(R.prop("archived")).length;
  }

});
