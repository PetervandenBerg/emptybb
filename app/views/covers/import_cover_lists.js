Wrts.views.Covers.ImportCoverLists = Wrts.BaseView.extend({
  templateName: 'covers/import_cover_lists',
  decorator: Wrts.decorators.Covers.ImportCoverLists,

  init: function(options){
    this.render();
  },

  events: {
    'click .transfer-direct'        : 'transferList',
    'click .js-destroy'             : 'destroyList'
  },

  // Event functions
  // ====================================================

  transferList: function(ev) {
    ev.preventDefault();
    var id = $(ev.target).data('id'),
        button = ev.target;

    $.get('/lists/' + id + '/transfer').done(function(data) {
      $(button).hide();
      alert(data);
    }).fail(function(err) {
      alert(err);
    });
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
            Wrts.data.Lists.remove(this.model);
          }.bind(this)
        });

        Wrts.app.getRouter().navigate('#/covers/' + coverId, {trigger: true});

      }).fail(function(err) {
        this.cover_not_found(err);
      });
    }
  }
});
