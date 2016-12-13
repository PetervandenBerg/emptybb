(function() {
  'use strict';

  Wrts.collections.SchoolBookEditions = Backbone.Collection.extend({
    model: Wrts.models.SchoolBookEdition,
    url: '/school_book_editions',
  });

})();
