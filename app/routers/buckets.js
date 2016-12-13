Wrts.helpers.registerRouter('Buckets', {
  routes: {
    'buckets':            {to: 'index',  as: 'buckets_index' },
    'buckets/new':        {to: 'create',         as: 'new_bucket' },
    'buckets/:id':        {to: 'show',           as: 'show_bucket' },
    'buckets/:id/edit':   {to: 'edit',           as: 'edit_bucket' },
  },

  index: function() {
    Wrts.app.setView(
      Wrts.views.Buckets.Index, { collection: Wrts.data.buckets }
    );
  },

  create: function() {
    var bucket = new Wrts.models.Bucket();
    Wrts.app.setView(
      Wrts.views.Buckets.Create, { model: bucket }
    ); 
  },

  show: function(id) {
    var bucket = Wrts.data.buckets.get(id);
    this.fetch_bucket_lists(id, function(lists) {
      var bucketLists = []
      _(lists).each(function(list) { 
        var newList = new Wrts.models.List(list);
        newList.listCollection = newList.get('list_collection');
        bucketLists.push(newList);
      });

      Wrts.data.bucket_lists.reset(bucketLists);
      var collection = Wrts.data.bucket_lists.getFilteredCollection();

      Wrts.app.setView(
        Wrts.views.Buckets.Show, { model: bucket, collection: collection }
      );
    });
  },

  edit: function(id) {
    var bucket = Wrts.data.buckets.get(id);

    Wrts.app.setView(
      Wrts.views.Buckets.Edit, { model: bucket }
    );
  },

  fetch_bucket_lists: function(id, callback, error) {
    $.get('/buckets/' + id + '.json').done(function(lists) {
      callback(lists);
    }).fail(function(err) {
      this.lists_not_found(err);
    });
  },

  lists_not_found: function(err) {
    alert(err);
  },
});
