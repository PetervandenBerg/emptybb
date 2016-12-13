Wrts.views.Transactions.Create = Wrts.BaseView.extend({
  templateName: 'transactions/create',
  decorator: Wrts.decorators.Transactions.Create,
  model: Wrts.models.Transaction,

  init: function() {
    this.cloneModel();
    this.viewState = new Backbone.ViewState();
    this.listenTo(this.viewState, 'change:validationMessages', this.updateComponents);
    this.render();
    _.defer(function(){ $('#transaction-form .type.active').click() });
  },

  cloneModel: function() {
    this.clone = new Wrts.models.Transaction(
      _(this.model.attributes).clone()
    );
  },

  events: {
    'click #transaction-form .submit-payment'                  : 'submitPayment',
    'click .request-parent-modal'                              : 'setSelectedPlan',
    'click #requestYourParentModal .subscr-collection .type'   : 'toggleSelected',
    'click #transaction-form .subscr-collection .type'         : 'toggleSelected2',
    'click #transaction-form .payment-methods .submit-payment' : 'submitForm'
  },

  // Event functions
  // ===================================

  toggleSelected2: function(ev) {
    var typeElement = $(ev.target).closest('.type'),
        typeElementInput = $(typeElement).find('input');

    if (!$(typeElementInput).is(':checked')) {
      $('#transaction-form .subscr-collection .type .radio-button img').toggle();
      typeElement.addClass('active');
      typeElement.siblings().removeClass('active');
      this.toggleCheckbox(typeElement);
      var selectedPlan = $('#transaction-form .type.active .title').html().trim();
      $('#transaction-form .replace-fields .selected-type').html(selectedPlan);
    }

    var planName = this.model.get('type').charAt(0).toUpperCase() + this.model.get('type').slice(1)
    var id = $('#transaction-form .type.active input').val();

    $.ajax({
      url: '/calculate_extension_prices/' + id + '.json',
      async: false,
      dataType: 'json',
      success: function(data) {
        if (parseFloat(data.total_price.replace('€','')) > 0) {
          $('.replace-fields .start-date').html(data.new_start_date);
          $('.replace-fields .end-date').html(data.next_renewal_at);
          $('.replace-fields .plan-price').html(data.plan_price);
          $('.replace-fields .minus-price').html(data.min_price);
          $('.replace-fields .total-price').html(data.total_price);
        } else {
          $('.type').first().click();
          alert('Je kunt dit plan niet selecteren, je kunt alleen een plan langer dan 3 maanden selecteren. Wil je dit toch mail dan naar klantenservice@wrts.nl')
        }
      },
      error: function(data){
        alert('Er is iets misgegaan.');
      }
    });
  },

  toggleCheckbox: function(typeElement) {
    $(typeElement).find('input').prop('checked', true)
    $(typeElement).siblings().find('input').prop('checked', false)
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
    var typeElement = $(ev.target).closest('.type');
    this.setModelAttributes({ clean: true });

    if (this.validateForm() ) {
      this.toggleCheckbox(typeElement);
      $('#transaction-form').submit();
    }

    return false;
  },

  setSelectedPlan: function(ev) {
    var id = $('#transaction-form .type.active input').val();
    $('#hidden-stpi').val(id);
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
    return $('#transaction-form').serializeJSON();
  }

});
