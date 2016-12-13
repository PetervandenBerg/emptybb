Wrts.decorators.Lists.StreamedListsIndex = Wrts.BaseDecorator.extend({

  getData: function() {
    var streamed_lists = Wrts.data.streamed_lists,
        buckets = this.getBuckets(),
        lists = this.getGroupedCollection(),
        user = Wrts.data.user.get("username");

    return {
      user: user,
      account: Wrts.data.user.attributes,
      lists: lists,
      streamedLists: streamed_lists,
      bucketsClosed: this.readFromPopstate("buckets"),
      restriction: Wrts.data.restriction.attributes,
      isWikiListsPage: true,
      reachedListLimit: this.reachedListLimit(),
      reachedBucketLimit: this.reachedBucketLimit(),
      anyStreamedLists: streamed_lists.length > 0,
      isMobileDevice: (screen.width <= 640),
      buckets: buckets,
      isStreamedListPage: true
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

  getBuckets: function() {
    return Wrts.data.buckets.models.map(function(bucket) {
      return bucket.toJSON();
    });
  },

  readFromPopstate: function(type) {
    return (localStorage.getItem(type) === "hide");
  },

  getGroupedCollection: function(isArchivedVisible){
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
  },

});
