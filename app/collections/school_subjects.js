(function() {
  'use strict';

  Wrts.collections.SchoolSubjects = Backbone.Collection.extend({
    model: Wrts.models.SchoolSubject,
    url: '/school_subjects',
  });

})();
