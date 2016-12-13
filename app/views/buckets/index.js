Wrts.views.Buckets.Index = Wrts.BaseView.extend({
  templateName: 'buckets/index',
  decorator: Wrts.decorators.Buckets.Index,

  init: function(options){
    this.viewState = new Backbone.ViewState({
      'showArchivedLists': false
    });
    this.listenTo(this.collection, "reset remove toggleArchived", this.render);
    this.render();
    _.defer(function(){ 
      $('[data-toggle="tooltip"]').tooltip();
    });
  },

  events: {
    'click .move-to-list-button'              : 'checkForListPresence',
    'click .start-exercise-from-bucket'       : 'checkForListPresence',
    'click .checkbox-trigger'                 : 'toggleListCheckbox',
    'change .list-cb'                         : 'toggleListCheckbox',
    'click .list-modal-container.move-lists'  : 'toggleBucketCheckbox',
    'click #move-lists-form'                  : 'moveLists',
    'keyup #search-form input'                : 'searchLists',
    'click #submit-delete-lists'              : 'deleteLists',
    'click #exercise-lists'                   : 'exerciseLists',
    'click .new-bucket-button'                : 'showBucketNameField',
    'change .select-all-checkbox input'       : 'toggleSelectAll',
    'click .subscr-collection .type'          : 'toggleSelected',
    'click #new-bucket-form'                  : 'createNewBucket'
  },

  // Event functions
  // ====================================================
  toggleListCheckbox: function(ev){
    if (!$(ev.target).hasClass('list-cb')) {
      this.toggleCheckbox(ev);
    }
    $('.selected-number').html($('.list-container input:checked').length);
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
    $(input).trigger('click');
  },

  toggleSelectAll: function(ev){
    var selected = ev.target.checked;

    if (selected) {
      $('.tabular.archived-hidden tbody.hidden').closest('.archived-hidden').find('thead a').click();
      $('#lists-actions-form .list-cb:checkbox:not(:checked)').closest('tr').find('.first-tr').click();
    } else {
      $('#lists-actions-form .list-cb:checkbox:checked').closest('tr').find('.first-tr').click();
    }
  }, 

  searchLists: function(ev){
    var searchTerm = $('#search-form input').val().trim(),
        listTitles = $('.list-container .title');

    if (searchTerm.length > 0) {
      matchedResults = listTitles.filter(function(i, titleElement) {
        var listTitle = $(titleElement).html().trim(),
            searchTerm = $('#search-form input').val().trim(),
            regex = new RegExp(searchTerm,"gi"),
            matchedListTitle = listTitle.match(regex);

        return (matchedListTitle != null)
      });

      if (matchedResults.length > 0) {
        var total_results = matchedResults.length;

        $('.list-container').hide();
        $('.tabular thead tr').hide();
        $('.hidden-header').show();
        $('.hidden-header .result-length').html(total_results);

        matchedResults.each(function() {
          return $(this).closest('.list-container').show();
        }); 
      } else {
        $('.list-container').show();
        $('.tabular thead tr').show();
        $('.hidden-header').show();
        $('.hidden-header .result-length').html('0');
      }
    } else {
      $('.hidden-header').hide();
      $('.list-container').show();
      $('.tabular thead tr').show();
    }
  },

  checkForListPresence: function(ev){
    var attrs = this.getModelAttributesFromDOM();

    if (!attrs.lists) {
      alert('Je hebt geen lijsten geselecteerd, probeer opnieuw.');
      return false;
    }
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

  exerciseLists: function(ev){
    var attrs = this.getModelAttributesFromDOM();

    if (!attrs.lists) {
      return alert('Je hebt geen lijsten geselecteerd, probeer opnieuw.');
    } 

    Wrts.app.getRouter().navigate('#/exercises/prepare_by_lists/' + attrs.lists.join('&'), {trigger: true});
    return false;
  },


  deleteLists: function(ev){
    var attrs = this.getModelAttributesFromDOM();

    if (!attrs.lists) {
      return alert('Je hebt geen lijsten geselecteerd, probeer opnieuw.');
    }

    var res = confirm(Wrts.I18n.translate("bucket_are_you_sure"));
    if (res === true) {
      $.post('/remove_from_bucket/', attrs).done(function(data) {
        Wrts.app.getRouter().navigate('#/buckets/' + attrs.bucket_id, {trigger: true});
      }).fail(function(err) {
        alert('Er is iets misgegaan, probeer opnieuw.');
      }); 
    }
    return false;
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
