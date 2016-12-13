(function(){
  'use strict';
  Wrts.collections.Exercises = Backbone.Collection.extend({
    model: Wrts.models.Exercise,
    url: '/exercises'
  });
})();
