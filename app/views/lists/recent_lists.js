Wrts.views.Lists.RecentLists = Wrts.BaseView.extend({
  templateName: 'lists/recent_lists',
  decorator: Wrts.decorators.Lists.RecentLists,

  init: function(options){
    this.viewState = new Backbone.ViewState({
      'showArchivedLists': false
    });
    this.listenTo(this.collection, "reset remove toggleArchived", this.render);
    this.render();

    _.defer(function(){ $('[data-toggle="tooltip"]').tooltip() });
  },

  events: {
    'click .checkbox-trigger'                 : 'toggleListCheckbox',
    'click .list-cb'                          : 'toggleListCheckbox',
    'click .list-modal-container.move-lists'  : 'toggleBucketCheckbox',
    'click #move-lists-form'                  : 'moveLists',
    'click .subscr-collection .type'          : 'toggleSelected',
    'click .move-to-list-button'              : 'checkForListPresence',
    'click .start-exercise-from-bucket'       : 'checkForListPresence',
    'click #submit-delete-lists'              : 'deleteLists',
    'click #exercise-lists'                   : 'exerciseLists',
    'click .disabled-trigger'                 : 'showPremiumModal',
    'click #share-lists'                      : 'shareLists',
    'click .icon-info.info'                   : 'showExplanationModal',
    'click .new-bucket-button'                : 'showBucketNameField',
    'click .explanation-close-button'         : 'hideExplanationPopup',
    'change .select-all-checkbox input'       : 'toggleSelectAll',
    'click #new-bucket-form'                  : 'createNewBucket'
  },

  // Event functions
  // ====================================================

  showPremiumModal: function(ev) {
    if ($(ev.target).hasClass('max-lists')) {
      $('.max-list-modal').click();
    } else {
      $('.premium-modal').click();
    }
    return false;
  },

  showExplanationModal: function(ev) {
    $('.button-explanation-modal').click();
    return false;
  },

  toggleListCheckbox: function(ev){
    if (!$(ev.target).hasClass('list-cb')) {
      this.toggleCheckbox(ev);
    }
    $('.selected-number').html($('.list-container input:checked').length);
  },

  hideExplanationPopup: function(){
    localStorage.setItem('popStateExplanation1','shown');
    $('.word-explanation').hide();
  },

  toggleBucketCheckbox: function(ev){
    this.toggleCheckbox(ev);
    if (ev.target.type !== 'checkbox') {
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

  toggleSelectAll: function(ev){
    var selected = ev.target.checked;
    if (selected == true) {
      $('.list-cb:checkbox:not(:checked)').click();
    } else if (selected == false) {
      $('.list-cb:checkbox:checked').click();
    }
    $('.selected-number').html($('.list-container input:checked').length)
  },

  moveLists: function(ev){
    var attrs = this.getModelAttributesFromDOM();

    if (!attrs.lists) {
      return alert('Je hebt geen lijsten geselecteerd, probeer opnieuw.');
    }
    if (!attrs.buckets && !attrs.bucket_name) {
      return alert('Je hebt geen mappen geselecteerd, probeer opnieuw.');
    }

    $.post('/move_to_bucket/', attrs).done(function(data) {
      $('body').removeClass('modal-open');
      return Wrts.app.getRouter().navigate("#/", {trigger: true, replace: true });
    }).fail(function(err) {
      alert('Er is iets misgegaan, probeer opnieuw.');
    });
    return false;
  },

  deleteLists: function(ev){
    var attrs = this.getModelAttributesFromDOM();

    if (!attrs.lists) {
      return alert('Je hebt geen lijsten geselecteerd, probeer opnieuw.');
    }

    var res = confirm(Wrts.I18n.translate("are_you_sure"));
    if (res === true) {
      for (i = 0; i < attrs.lists.length; i++) { 
        var list = Wrts.data.lists.get(attrs.lists[i]);
        Wrts.data.lists.remove(list);
        list.destroy({ wait: true });
      }
    }
  },

  exerciseLists: function(ev){
    var attrs = this.getModelAttributesFromDOM();
    if (!attrs.lists) {
      return alert('Je hebt geen lijsten geselecteerd, probeer opnieuw.');
    } 
    Wrts.app.getRouter().navigate('/#/exercises/prepare_by_lists/' + attrs.lists.join('&'), {trigger: true});
    window.location = '/#/exercises/prepare_by_lists/' + attrs.lists.join('&');
    return false;
  },

  shareLists: function(ev){
    var attrs = this.getModelAttributesFromDOM();
    if (!attrs.lists) {
      return alert('Je hebt geen lijsten geselecteerd, probeer opnieuw.');
    } 

    $.post('/share_lists', attrs).done(function(data) {
      if (data) {
        var list_ids = data.map(function(list) {
          return list.id;
        });

        list_ids.forEach(function(id) {
          var list = Wrts.data.lists.get(id);
          list.set('shared', !list.attributes.shared);
        });
        return Wrts.app.getRouter().navigate('#/share_lists/', {trigger: true});
      }
    }).fail(function(err) {
      alert('Er is iets misgegaan, probeer opnieuw.');
    });
  },

  // Setters and getters
  //===================================
  //
  showBucketNameField: function(){
    $('.hidden-bucket-field').show();
    $('.new-bucket-button').hide();
    $('#move-lists-form').hide();
    $('#AddListsToBucketModal .tabular tbody').hide();
  },

  getModelAttributesFromDOM: function(){
    return this.$el.find('form').serializeJSON();
  },

});
