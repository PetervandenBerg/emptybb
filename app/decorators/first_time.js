(function() {
  'use strict';

  Wrts.decorators.FirstTime = Wrts.BaseDecorator.extend({
    getData: function() {
      return {
        firstName: this.getFirstName(),
        subscription: this.getSubscription(),
        isPreTeacher: this.checkIfUserIsPreTeacher()
      };
    },

    getFirstName: function(){
      return Wrts.data.user.get('first_name');
    },

    getSubscription: function() {
      var subscription = Wrts.data.subscription.attributes;

      if ($.isEmptyObject(subscription) === false) {
        return subscription;
      } else {
        return false;
      }
    },

    checkIfUserIsPreTeacher: function(){
      if ($.isEmptyObject(Wrts.data.user.get('teacher')) === false ) {
        return Wrts.data.user.get('teacher').approved == null;
      } else {
        return false;
      }
    }

  });
})();
