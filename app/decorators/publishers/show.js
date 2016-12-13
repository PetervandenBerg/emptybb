Wrts.decorators.Publishers.Show = Wrts.BaseDecorator.extend({

  getData: function() {
    return _.extend(this.model.toJSON(), {
      methods: this.getMethods(),
      isCurrentPublisher: this.checkForPublisher(),
      userEmail: this.getUserEmail(),
      userFullName: this.getUserFullName(),
      userPhoneNumber: this.getUserPhoneNumber(),
      userLastSignInDate: this.getLastSignInDate()
    });
  },

  checkForPublisher: function(){
    return (this.model.get("user_id") === Wrts.data.user.id);
  },

  getMethods: function(){
    Wrts.data.PublisherMethods = this.model.get("methods");
    Wrts.data.Publisher = this.model;
    return Wrts.data.PublisherMethods;
  },

  getUserEmail:function(){
    return this.model.get("user_email");
  },

  getUserFullName:function(){
    return this.model.get("user_full_name");
  },

  getUserPhoneNumber:function(){
    return this.model.get("user_phone_number");
  },

  getLastSignInDate:function(){
    return this.model.get("user_last_sign_in");
  },
});
