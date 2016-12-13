Wrts.views.Covers.Show = Wrts.BaseView.extend({
  templateName: 'covers/show',
  decorator: Wrts.decorators.Covers.Show,

  init: function(options){
    this.render();
    _.defer(function(){ 
      $('[data-toggle="tooltip"]').tooltip();
    });
  },

  events: {
    'click .transfer-direct'        : 'transferList',
    'click .disabled-trigger'       : 'showPremiumModal',
    'click .js-destroy'             : 'destroyList'
  },

  // Event functions
  // ====================================================

  transferList: function(ev) {
    ev.preventDefault();
    var id = $(ev.target).data('id'),
        button = ev.target;
    if (Wrts.data.lists.length + Wrts.data.streamed_lists.length >= Wrts.data.user.get('max_allowed_lists')) {
      $('.max-list-modal').click();
    } else {
      $.get('/lists/' + id + '/transfer').done(function(data) {
        var list = new Wrts.models.List(data);
        list.listCollection = list.get('list_collection')
        Wrts.data.lists.add(list);
        $(button).hide();
        alert("Lijst succesvol overgenomen.");
      }).fail(function(err) {
        alert(err);
      });
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

  destroyList: function(ev) {
    var id = $(ev.target).data('id'),
        res = confirm(Wrts.I18n.translate("are_you_sure"));

    if (id && res === true) {
      $.get('/lists/' + id + '.json').done(function(data) {
        var list = new Wrts.models.List(data),
            coverId = list.get('cover_id');

        list.destroy({
          wait: true,
          success: function() {
          }.bind(this)
        });

        Wrts.app.getRouter().navigate('#/covers/' + coverId, {trigger: true});

      }).fail(function(err) {
        this.cover_not_found(err);
      });
    }
  }
});
