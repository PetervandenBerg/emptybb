(function() {
  'use strict';
  Wrts.collections.Publishers = Backbone.Collection.extend({
    model: Wrts.models.Publisher,
    url: '/publishers',

    fetchBySlug: function(slug) {
      return this.select(function(publisher) {
        return (publisher.get('slug') === slug);
      });
    },

  });
})();
