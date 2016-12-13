Wrts.decorators.Covers.Show = Wrts.BaseDecorator.extend({

  getData: function() {
    return _.extend(this.model.toJSON(), {
      methods: this.getMethods(),
      publisher_method: this.getPublisherMethod(),
      publisher: this.getPublisher(),
      isCurrentPublisher: this.checkForPublisher(),
      reachedListLimit: this.reachedListLimit(),
      reachedBucketLimit: this.reachedBucketLimit(),
      account: Wrts.data.user.attributes,
      lists: this.getLists(),
    });
  },

  checkForPublisher: function(){
    return (this.model.get('publisher').user_id === Wrts.data.user.id);
  },

  getPublisher: function(){
    return this.model.get('publisher');
  },

  getPublisherMethod: function(){
    return this.model.get("publisher_method");
  },

  getMethods: function(){
    return this.model.get("methods");
  },

  reachedListLimit: function(){
    return Wrts.data.lists.length + Wrts.data.streamed_lists.length >= Wrts.data.user.get('max_allowed_lists');
  },

  reachedBucketLimit: function() {
    var account = Wrts.data.user.attributes,
        maxBuckets = account.max_allowed_buckets,
        user_bucket_length = Wrts.data.buckets.length;

    return user_bucket_length >= maxBuckets;
  },

  getLists: function(){
    var lists = this.model.get("lists");
    var listReferenceArray = this.getListReferenceArray();

    _(lists).each(function(list) {
      var subjects = _(list.list_collection.lists).map(function(wordList){
        return $.trim(wordList.subject);
      });
      list.canBeTransferred = (listReferenceArray.indexOf(list.id) === -1);
      list.subjects = subjects.join(' - ');
    });
    return lists;
  },

  getListReferenceArray: function() {
    return Wrts.data.lists.map(function(list) { 
      return list.get('reference_id');
    });
  },

});
