(function() {
  'use strict';

  Wrts.collections.SubscriptionTypes = Backbone.Collection.extend({
    model: Wrts.models.SubscriptionType,
    url: '/subscription_types',
  });
})();
