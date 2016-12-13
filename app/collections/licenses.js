(function(){
  'use strict';
  Wrts.collections.Licenses = Backbone.Collection.extend({
    model: Wrts.models.License,
    url: '/licenses'
  });
})();
