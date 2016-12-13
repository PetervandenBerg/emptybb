Wrts.views.LicenseUsers._FormActions = Wrts.BaseView.extend({

  model: Wrts.models.Teacher,

  events: {
    'blur .license-user-email-field'      : 'handleEmailInputChange',
    'keyup .license-user-email-field'     : 'handleEmailInputChange',
    'change .license-user-email-field'    : 'handleEmailInputChange',
    'click #submit-form'                  : 'showAppLoading',
  },

  handleEmailInputChange: function(ev) {
    if (!this.isCheckPossible()){
      return false;
    }

    var data = { "email": this.getEmail() };

    $.post("/check_email_for_license", data)
      .done(this.handleSuccess);
  },

  isCheckPossible: function() {
    return (
      this.getEmail() !== "" &&
      this.validateEmail(this.getEmail())
    );
  },

  validateEmail: function(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  },

  getEmail: function() {
    return $.trim($('.license-user-email-field').val()).toLowerCase();
  },

  handleSuccess: function(data) {
    if (!data.isUnique) {
      $('.js-message-email').html('WRTS account van gebruiker gevonden!');
      $('.js-message-email').css("color", "green")
      $('#submit-form').prop('disabled', false);
    } else {
      $('.js-message-email').html('Geen WRTS account op dit e-mailadres gevonden.');
      $('.js-message-email').css("color", "red")
      $('#submit-form').prop('disabled', true);
    }
  },

  showAppLoading: function() {
    $('.app-loading').show();
  },

});
