Wrts.views.Lists.DeletedLists = Wrts.BaseView.extend({
  templateName: 'lists/deleted_lists',
  decorator: Wrts.decorators.Lists.DeletedLists,

  init: function(options){
    this.viewState = new Backbone.ViewState({
      'showArchivedLists': false
    });
    this.listenTo(this.collection, "reset remove toggleArchived", this.render);
    this.render();
    _.defer(function(){ $('[data-toggle="tooltip"]').tooltip() });
  },

  events: {
    'click #delete-lists'                     : 'deleteLists',
    'click #return-lists'                     : 'returnLists',
    'click .disabled-trigger'                 : 'showPremiumModal',
    'click .checkbox-trigger'                 : 'toggleListCheckbox',
    'click .subscr-collection .type'          : 'toggleSelected',
    'keyup #search-form input'                : 'searchLists',
    'click .list-cb'                          : 'toggleListCheckbox',
    'click .list-modal-container.move-lists'  : 'toggleBucketCheckbox',
    'change .select-all-checkbox input'       : 'toggleSelectAll'
  },

  // Event functions
  // ====================================================
  //
  deleteLists: function(ev){
    var res = confirm(Wrts.I18n.translate("are_you_sure"));

    if (res === true) {
      var attrs = this.getModelAttributesFromDOM();

      if (!attrs.lists) {
        return alert('Je hebt geen lijsten geselecteerd, probeer opnieuw.');
      }

      $.post('/delete_deleted_lists/', attrs).done(function(data) {
        return Wrts.app.getRouter().navigate("#/deleted_lists", {trigger: true, replace: true });
      }).fail(function(err) {
        alert('Er is iets misgegaan, probeer opnieuw.');
      });
      return false;
    }
  },

  showPremiumModal: function(ev) {
    if ($(ev.target).hasClass('max-lists')) {
      $('.max-list-modal').click();
    } else {
      $('.premium-modal').click();
    }
    return false;
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

  returnLists: function(ev){
    var attrs = this.getModelAttributesFromDOM();

    if (!attrs.lists) {
      return alert('Je hebt geen lijsten geselecteerd, probeer opnieuw.');
    }

    $.post('/undelete_deleted_lists/', attrs).done(function(data) {
      $(data).each(function(i, list){
        var list = new Wrts.models.List(list);
        list = list.parse(list);
        list.listCollection = list.get('list_collection')
        Wrts.data.lists.add(list);
      });
      return Wrts.app.getRouter().navigate("#/deleted_lists", {trigger: true, replace: true });
    }).fail(function(err) {
      alert('Er is iets misgegaan, probeer opnieuw.');
    });
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
