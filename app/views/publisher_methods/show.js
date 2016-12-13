Wrts.views.PublisherMethods.Show = Wrts.BaseView.extend({
  templateName: 'publisher_methods/show',
  decorator: Wrts.decorators.PublisherMethods.Show,

  init: function(options){
    this.render();
  },

  events: {
    'click .js-destroy'       : 'destroy',
  },

  // Event functions
  // ====================================================
  destroy: function(ev) {
    var id = $(ev.target).data('id'),
        res = confirm(Wrts.I18n.translate("are_you_sure"));

    if (id && res === true) {
      $.get('/covers/' + id + '.json').done(function(data) {
        var cover = new Wrts.models.Cover(data),
            pbMethodSlug = cover.get('publisher_method').slug;

        cover.destroy({
          wait: true,
          success: function() {
            Wrts.data.Covers.remove(this.model);
          }.bind(this)
        });

        Wrts.app.getRouter().navigate('#/publisher_methods/' + pbMethodSlug, {trigger: true});

      }).fail(function(err) {
        this.cover_not_found(err);
      });
    }
  },

});
