Wrts.views.PublisherMethods._FormActions = Wrts.BaseView.extend({

  model: Wrts.models.PublisherMethod,

  cloneModel: function() {
    this.clone = new Wrts.models.PublisherMethod(
       _(this.model.attributes).clone()
    );
  },

  events: {
    'click #submit-form' : 'submitForm'
  },

  validateForm: function() {
    if (this.clone.isValid()) {
      this.viewState.set("locked", true);
      return true;
    } else {
      this.viewState.set("locked", false);
      this.viewState.set("validationMessages", [this.clone.validationError]);
    }
    return false;
  },

  submitForm: function(ev) {
    this.setModelAttributes({ clean: true });
    if (this.validateForm() ) {
      this.model.set(this.clone.attributes);
      this.model.save();
    }
    return false;
  },

  navigateToPublisherMethod: function(id) {
    return this.navigate('/publisher_methods/' + id, { trigger:true, replace:true });
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

  sortPublisherMethods: function() {
    _(Wrts.data.PublisherMethods).sort(function(a, b){
      var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
      if (nameA < nameB) 
       return -1 
      if (nameA > nameB)
       return 1
      return 0
    })
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

