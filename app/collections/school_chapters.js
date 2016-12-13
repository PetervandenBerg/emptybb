(function() {
  'use strict';

  Wrts.collections.SchoolChapters = Backbone.Collection.extend({
    model: Wrts.models.SchoolChapter,
    url: '/school_chapters',
  });

})();
