Wrts.views.Profiles.SharedLists = Wrts.BaseView.extend({
  templateName: 'profiles/shared_lists',
  decorator: Wrts.decorators.Profiles.SharedLists,

  init: function(options){
    this.viewState = new Backbone.ViewState({
      'showArchivedLists': false
    });
    this.listenTo(this.collection, "reset remove toggleArchived", this.render);
    this.render();
    _.defer(function(){ 
      $('[data-toggle="tooltip"]').tooltip() 
    });
  },

  events: {
    'click .checkbox-trigger'                 : 'toggleListCheckbox',
    'click .list-cb'                          : 'toggleListCheckbox',
    'click .disabled-trigger'                 : 'showPremiumModal',
    'keyup #search-form input'                : 'searchLists',
    'click #transfer-lists'                   : 'transferLists',
    'change .select-all-checkbox input'       : 'toggleSelectAll',
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

  transferLists: function(ev){
    var attrs = this.getModelAttributesFromDOM();
    if (!attrs.lists) {
      return alert('Je hebt geen lijsten geselecteerd, probeer opnieuw.');
    } 
    $.post('/lists/transfer_lists', attrs).done(function(data) {
      if (data) {
        $(data).each(function(i, list){
          var new_list = new Wrts.models.List(list);
          new_list.listCollection = new_list.get('list_collection')
          Wrts.data.lists.add(new_list);
        });
      }
      return Wrts.app.getRouter().navigate("/#/lists", {trigger: true, replace: true});
    }).fail(function(err) {
      alert('Er is iets misgegaan, probeer opnieuw.');
    });
  },

  // Setters and getters
  //===================================
  //

  getModelAttributesFromDOM: function(){
    return this.$el.find('form').serializeJSON();
  },

});
