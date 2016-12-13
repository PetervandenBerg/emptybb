Wrts.views.Lists.FileExport = Wrts.BaseView.extend({
  templateName: 'lists/file_export',
  decorator: Wrts.decorators.Lists.FileExport,
  model: Wrts.models.List,

  cloneModel: function() {
    this.clone = new Wrts.models.List(
       _(this.model.attributes).clone()
    );
    this.clone.setListCollection(this.model.getListCollection());
  },

  init: function() {
    this.cloneModel();
    this.render();
  },

  events: {
    'click  #export-button'       : 'submitForm',
    'click .disabled-trigger'     : 'showPremiumModal',
    'change .print_subject input' : 'checkIfLast'
  },

  submitForm: function(ev) {
    this.$('form').submit();
  },

  render: function() {
    this.$el.html( this.template(this.getTemplateData(this.clone)) );
    this.$submitButton         = this.$('button[type=submit]');
  },

  checkIfLast: function(ev) {
    if ($('.print_subject input:checked').length === 0) {
      ev.target.checked = true;
    }
  }

});
