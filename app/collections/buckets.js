(function() {
  'use strict';

  Wrts.collections.Buckets = Backbone.Collection.extend({
    model: Wrts.models.Bucket,
    url: '/buckets',

  });
})();
