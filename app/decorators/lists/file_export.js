Wrts.decorators.Lists.FileExport = Wrts.BaseDecorator.extend({

  getData: function(clone) {
    var print_subjects      = this.getPrintSubjects(clone),
        my_profile          = this.listInMyProfile(),
        streamed_lists      = Wrts.data.streamed_lists,
        buckets             = this.getBuckets(),
        uniqSubjects        = Wrts.data.lists.getUniqSubjects(),
        subjects            = [],
        rows                = this.getRows(clone);

    for (var i = 0, n = uniqSubjects.length; i < n; i++) {
      subjects.push({
        subject: uniqSubjects[i],
      });
    }

    for (var i = 0, n = buckets.length; i < n; i++) {
      if (buckets[i].id === this.model.id) {
        buckets[i].active = true;
      }
    }
    return _.extend({
      rows: rows,
      print_subjects: print_subjects,
      subjects: subjects,
      buckets: buckets,
      my_profile: my_profile,
      isMobileDevice: (screen.width <= 640),
      account: Wrts.data.user.attributes,
      reachedListLimit: this.reachedListLimit(),
      reachedBucketLimit: this.reachedBucketLimit(),
      bucketsClosed: this.readFromPopstate("buckets"),
      restriction: Wrts.data.restriction.attributes,
      canExportFile: this.checkIfUserCanExport(),
      streamedLists: streamed_lists,
      anyStreamedLists: streamed_lists.length > 0,
      subjectsClosed: this.readFromPopstate("subjects"),
    }, clone.toJSON() );
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

  checkIfUserCanExport: function() {
    var restriction = Wrts.data.restriction.attributes;
    return restriction.export_file
  },

  getRows: function(clone) {
    var lists = clone.listCollection.lists,
        rows  = [];

    _(lists).each(function(collection) {
      var words = collection.words;

      for (i = 0; i < words.length; i++) {
        var word = collection.words[i];

        if (typeof rows[i] === 'undefined') {
          rows[i] = { columns: [] };
        }

        word = _.extend({}, word, { });
        rows[i].columns.push(word);
      };
    });
    return rows
  },

  readFromPopstate: function(type) {
    return (localStorage.getItem(type) === "hide");
  },

  getPrintSubjects: function(clone) {
    var lists = _(clone.getListCollection().lists);

    return lists.map(function(list, listIndex) {
      return {
        title:        $.trim(list.subject),
      };
    });
  },

  listInMyProfile: function() {
    var url = window.location.hash.split('/');
    var id = url[2];
    var own_list = Wrts.data.lists.get(id);

    if (!own_list) { 
      return false;
    } else {
      return true;
    }
  }

});

