Wrts.views.Publishers.Index = Wrts.BaseView.extend({
  templateName: 'publishers/index',
  decorator: Wrts.decorators.Publishers.Index,

  init: function(options){
    this.render();
  },

  events: {
    'click #submit-new-publisher-request' : 'submitForm',
    'click #submit-search-form' : 'submitSearchForm',
  },

  // Event functions
  // ====================================================
  submitForm: function(ev) {
    if($('#honeypotsome-div input').val() == "") {
      this.$('form').submit();
    }
    return false;
  },

  submitSearchForm: function(ev) {
    var attrs = $('#search-form').serializeJSON();
    $.post('/search_publishers_covers_lists/', attrs).done(function(html) {
      $('.search-result-partial-replacer').replaceWith(html);
    }).fail(function(err) {
      alert('Er is iets misgegaan, probeer opnieuw.');
    });
    return false;
  },
});
