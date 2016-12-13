(function() {
  'use strict';

  Wrts.collections.SchoolLevels = Backbone.Collection.extend({
    model: Wrts.models.SchoolLevel,
    url: '/school_levels',
  });

})();
