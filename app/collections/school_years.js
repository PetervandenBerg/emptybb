(function() {
  'use strict';

  Wrts.collections.SchoolYears = Backbone.Collection.extend({
    model: Wrts.models.SchoolYear,
    url: '/school_years',
  });

})();
