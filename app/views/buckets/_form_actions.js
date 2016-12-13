Wrts.views.Buckets._FormActions = Wrts.BaseView.extend({

  model: Wrts.models.Bucket,

  cloneModel: function() {
    this.clone = new Wrts.models.Bucket(
       _(this.model.attributes).clone()
    );
  },

  events: {
    'click #submit-form'             :  'submitForm',
    'click .disabled-trigger'        :  'showPremiumModal',
    'click .form-group.shared input' :  'toggleCheckboxValue'
  },

  showPremiumModal: function(ev) {
    if ($(ev.target).hasClass('max-lists')) {
      $('.max-list-modal').click();
    } else {
      $('.premium-modal').click();
    }
    return false;
  },

  validateForm: function() {
    if (this.clone.isValid()) {
      this.viewState.set("locked", true);
      return true;
    } else {
      this.viewState.set("locked", false);
      this.viewState.set("validationMessages", [this.clone.validationError]);
    }
    $('#submit-form').prop("disabled", false);
    return false;
  },

  toggleCheckboxValue: function(ev) {
    if ($(ev.target).val() === "true") {
      $('.hidden-shared-checkbox').val(false);
      $(ev.target).val(false);
    } else {
      $('.hidden-shared-checkbox').val(true);
      $(ev.target).val(true);
    }
  },

  submitForm: function(ev) {
    ev.target.disabled = "disabled";
    this.setModelAttributes({ clean: true });

    if (this.validateForm() ) {
      this.model.set(this.clone.attributes);
      this.model.save();
    }
    ev.target.disabled = false;
    return false;
  },

  navigateToLists: function(id) {
    return this.navigate('#/lists/', { trigger:true, replace:true });
  },

  setModelAttributes: function(options){
    var attrs = this.getModelAttributesFromDOM();
    this.clone.set(attrs);
  },

  handleError: function(jqXhr, textStatus) {
    var validationMessages = this.viewState.get('validationMessages') || [];
    validationMessages.push(textStatus);
    if ('responseJSON' in validationMessages[0]) {
      this.$validationMessagesUl.html( _(validationMessages[0].responseJSON["errors"]).join('') );
      this.$validationMessages.show();
    }
  },

  // Render functions
  // ===================================
  render: function() {
    this.$el.html( this.template(this.getTemplateData(this.clone)) );
    this.$submitButton         = this.$('button[type=submit]');
    this.$validationMessages   = this.$('.validation_messages');
    this.$validationMessagesUl = this.$validationMessages.find('> ul');
    this.updateComponents();
  },

  updateComponents: function() {
    var isLocked           = this.viewState.get('locked'),
        validationMessages = this.viewState.get('validationMessages') || [],
        messageElements;

    if (validationMessages.length === 0) {
      this.$validationMessages.hide();
    } else {
      messageElements = [];
      _(validationMessages).each(function(msg){
        messageElements.push([
          '<li>', msg, '</li>'
        ].join(''));
      });
      this.toggleLock();
      this.$validationMessagesUl.html(messageElements.join(''));
      this.$validationMessages.show();
    }
  },

  toggleLock: function(){
    this.viewState.set('locked');
  },

  // Setters and getters
  // ===================================
  getModelAttributesFromDOM: function(){
    return this.$el.find('form').serializeJSON();
  }
});

