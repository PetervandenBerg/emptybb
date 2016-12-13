Wrts.views.Lists.Show = Wrts.BaseView.extend({
  templateName: 'lists/show',
  decorator: Wrts.decorators.Lists.Show,
  events: {
    'click .js-toggle-archive'                 : 'toggleArchive',
    'click .js-toggle-shared'                  : 'toggleShare',
    'click .js-destroy'                        : 'destroy',
    'click #AddListsToBucketModal .tabular tr' : 'toggleBucketCheckbox',
    'click .speechlocale-trigger'              : 'speakWord',
    'touchstart .speechlocale-trigger'         : 'speakWord',
    'click #move-lists-form'                   : 'moveList',
    'click .new-bucket-button'                 : 'showBucketNameField',
    'click #new-bucket-form'                   : 'createNewBucket',
    'click .subscr-collection .type'           : 'toggleSelected',
    'click .disabled-trigger'                  : 'showPremiumModal',
    'click .move-to-list-button'               : 'checkForListPresence',
    'click .start-exercise-from-bucket'        : 'checkForListPresence',
  },

  init: function() {
    this.viewState = new Backbone.ViewState({
      state: null,
      animate: null,
    });
    this.listenTo(this.model, 'destroy', this.handleDestroyed);
    this.listenTo(this.model, 'sync', this.render);
    this.render();
    _.defer(function(){ $('[data-toggle="tooltip"]').tooltip() });
  },

  showPremiumModal: function(ev) {
    if ($(ev.target).hasClass('max-lists')) {
      $('.max-list-modal').click();
    } else {
      $('.premium-modal').click();
    }
    return false;
  },

  toggleBucketCheckbox: function(ev){
    this.toggleCheckbox(ev);
    if (event.target.type !== 'checkbox') {
      $(ev.target).closest('tr').find('.checked-bucket').toggle();
    }
  },

  toggleCheckbox: function(ev){
    var element       = ev.target,
        parentElement = $(element).closest('tr'),
        input         = $(parentElement).find('input');

    $(input).click()
  },

  checkForListPresence: function(ev){
    var attrs = this.getModelAttributesFromDOM();

    if (!attrs.lists) {
      alert('Je hebt geen lijsten geselecteerd, probeer opnieuw.');
      return false;
    }
  },

  moveList: function(ev){
    var attrs = this.getModelAttributesFromDOM();
    $.post('/move_to_bucket/', attrs).done(function(data) {
      $('body').removeClass('modal-open');
      return Wrts.app.getRouter().navigate("#/", {trigger: true, replace: true });
    }).fail(function(err) {
      alert('Er is iets misgegaan, probeer opnieuw.');
    });
    return false;
  },

  getTemplateData: function() {
    // Call the super getTemplateData
    var viewModel = Wrts.BaseView.prototype.getTemplateData.bind(this)(arguments);
    var viewState = this.viewState.attributes;
    return _.extend({}, viewModel, viewState);
  },

  toggleArchive: function(){
    this.model.toggle("archived");
    this.model.save();
  },

  // Use transient viewState state/animate to trigger shared/unshared popup
  toggleShare: function() {
    var value = this.model.toggle("shared");
    this.model.save();

    if(this.model.get("shared")) {
      this.viewState.set("state", "shared");
    } else {
      this.viewState.set("state", "unshared");
    }
    this.viewState.set("animate", "slideDown");
    window.setTimeout(this.autoHideAlert.bind(this), 2000);
  },

  autoHideAlert: function() {
    this.viewState.set("animate", "slideUp");
    this.render();
  },

  destroy: function() {
    var res = confirm(Wrts.I18n.translate("are_you_sure"));
    if (res === true) {
      this.model.destroy({
        wait: true,
        success: function() {
          Wrts.data.lists.remove(this.model);
          Wrts.data.lists.trigger("updateFilteredCollection");
        }.bind(this)
      });
    }
  },

  handleDestroyed: function() {
    Wrts.publish("notification", Wrts.I18n.translate("list_removed"));
    this.navigate("#/lists", {trigger: false, replace: true});
  },

  speakWord: function(ev) {
    $(ev.target).removeClass('fa-volume-off').addClass('fa-volume-up');
    $(ev.target).parent().removeClass('speechlocale-trigger');

    var word = ev.currentTarget.dataset.word;
    var locale = ev.currentTarget.dataset.locale.toLowerCase();
    Wrts.Speech.speak(locale, word, 1, ev);
  },

  // Setters and getters
  // ===================================
  showBucketNameField: function(){
    $('.hidden-bucket-field').show();
    $('.new-bucket-button').hide();
    $('#move-lists-form').hide();
    $('.tabular tbody').hide();
  },

  getModelAttributesFromDOM: function(){
    return this.$el.find('form').serializeJSON();
  },
});
