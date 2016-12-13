(function() {
  'use strict';
  Wrts.collections.PublisherMethods = Backbone.Collection.extend({
    model: Wrts.models.PublisherMethod,
    url: '/publisher_methods',

  });
})();
