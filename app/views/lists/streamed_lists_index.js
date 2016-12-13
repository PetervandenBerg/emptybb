Wrts.views.Lists.StreamedListsIndex = Wrts.BaseView.extend({
  templateName: 'lists/streamed_lists_index',
  decorator: Wrts.decorators.Lists.StreamedListsIndex,

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
    'click #exercise-lists'                   : 'exerciseLists',
    'click .disabled-trigger'                 : 'showPremiumModal',
    'click #delete-lists'                     : 'deletePublisherLists',
    'click .subscr-collection .type'          : 'toggleSelected',
    'keyup #search-form input'                : 'searchLists',
    'click .checkbox-trigger'                 : 'toggleListCheckbox',
    'click .list-cb'                          : 'toggleListCheckbox',
    'click .list-modal-container.move-lists'  : 'toggleBucketCheckbox',
    'change .select-all-checkbox input'       : 'toggleSelectAll'
  },

  // Event functions
  // ====================================================
  //

  showPremiumModal: function(ev) {
    if ($(ev.target).hasClass('max-lists')) {
      $('.max-list-modal').click();
    } else {
      $('.premium-modal').click();
    }
    return false;
  },

  deletePublisherLists: function(ev){
    var res = confirm(Wrts.I18n.translate("are_you_sure"));

    if (res === true) {
      var attrs = this.getModelAttributesFromDOM();

      if (!attrs.lists) {
        return alert('Je hebt geen lijsten geselecteerd, probeer opnieuw.');
      }

      attrs.lists.forEach(function(id){
        var streamed_list = Wrts.data.streamed_lists.get(id)
        Wrts.data.streamed_lists.remove(streamed_list);
      });

      $.post('/delete_publisher_lists/', attrs).done(function(data) {
        return Wrts.app.getRouter().navigate("#/streamed_lists", {trigger: true });
      }).fail(function(err) {
        alert('Er is iets misgegaan, probeer opnieuw.');
      });
      return false;
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

  exerciseLists: function(ev){
    var attrs = this.getModelAttributesFromDOM();
    if (!attrs.lists) {
      return alert('Je hebt geen lijsten geselecteerd, probeer opnieuw.');
    } 
    Wrts.app.getRouter().navigate('#/exercises/prepare_by_lists/' + attrs.lists.join('&'), {trigger: true});
    return false;
  },

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

    $(input).click()
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

  getModelAttributesFromDOM: function(){
    return this.$el.find('form').serializeJSON();
  }
});
