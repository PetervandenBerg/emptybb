Wrts.views.Lists.Print = Wrts.BaseView.extend({
  templateName: 'lists/print',
  decorator: Wrts.decorators.Lists.Print,
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
    'click  #export-button'         : 'submitForm',
    'click  #print-button'           : 'printVisibleElement',
    'change .print_style input'     : 'changePrintStyle',
    'change .print_subject input'   : 'changePrintSubject',
  },

  printVisibleElement: function() {
    window.print()
  },

  submitForm: function(ev) {
    this.setModelAttributes({ clean: true });
    if (this.validateForm() ) {
      this.model.set(this.clone.attributes);
      this.model.save();
    }
    return false;
  },

  changePrintStyle: function(){
    var attrs = this.getModelAttributesFromDOM(),
        printStyle = attrs.print_style ? attrs.print_style : "list";
    this.clone.printStyle = printStyle;
    this.render();
  },

  changePrintSubject: function(ev){
    if ($('.print_subject input:checked').length === 0) {
      ev.target.checked = true;
    }
    this.setModelAttributes();
    this.render();
  },

  setModelAttributes: function(options){
    var attrs = this.getModelAttributesFromDOM();
    this.setActiveTypes(attrs);
  },

  render: function() {
    this.$el.html( this.template(this.getTemplateData(this.clone)) );
    this.$submitButton         = this.$('button[type=submit]');
  },

  setActiveTypes: function(attrs) {
    var lists = this.clone.listCollection.lists;

    for (i = 0; i < lists.length; i++) {
      if (attrs.subject_to_print.indexOf(String(i)) === -1) {
        lists[i].hidden = true;
      } else {
        lists[i].hidden = false;
      }
    }
  },

  setActivePrintType: function(attrs) {
    this.clone.printType = attrs;
  },

  getModelAttributesFromDOM: function(){
    return this.$el.find('form').serializeJSON();
  }
});
