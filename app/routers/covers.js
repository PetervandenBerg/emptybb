Wrts.helpers.registerRouter('Covers', {
  routes: {
    'covers/new/publisher_method/:id':    {to: 'create',  as: 'new_cover'  },
    'covers/:id':                         {to: 'show',    as: 'show_cover' },
    'covers/:id/edit':                    {to: 'edit',    as: 'edit_cover' },
    'covers/:id/import_cover_lists':      {to: 'import_cover_lists',    as: 'import_cover_lists' },
  },

  show: function(id){
    window.location = "/covers/" + id.replace('.json', '')
    // this.fetch_cover(id, function(cover) {
    //   Wrts.app.setView(
    //     Wrts.views.Covers.Show, { model: cover }
    //   );
    // });
  },

  create: function(publisher_method_id) {
    var model = new Wrts.models.Cover();
    model.publisherMethod = publisher_method_id;

    this.fetch_publisher_method(publisher_method_id, function(publisher_method) {
      model.set('publisher_method', publisher_method);
      Wrts.app.setView(
        Wrts.views.Covers.Create, { model: model }
      ); 
    });
  },

  edit: function(id) {
    this.fetch_cover(id, function(cover) {
      Wrts.app.setView(
        Wrts.views.Covers.Edit, { model: cover }
      );
    });
  },

  import_cover_lists: function(id) {
    this.fetch_cover(id, function(cover) {
      Wrts.app.setView(
        Wrts.views.Covers.ImportCoverLists, { model: cover }
      );
    });
  },

  fetch_cover: function(id, callback, error) {
    $.get('/covers/' + id + '.json').done(function(data) {
      var cover = new Wrts.models.Cover(data);
      callback(cover);
    }).fail(function(err) {
      this.cover_not_found(err);
    });
  },

  cover_not_found: function(err) {
    alert(Wrts.I18n.t('cover_not_found'));
    Wrts.app.getRouter().navigate(publishers_index_url, {trigger: true});
  },

  fetch_publisher_method: function(id, callback, error) {
    $.get('/publisher_methods/' + id + '.json').done(function(data) {
      var publisher_method = new Wrts.models.PublisherMethod(data);
      callback(publisher_method);
    }).fail(function(err) {
      this.publisher_method_not_found(err);
    });
  },

  publisher_method_not_found: function(err) {
    alert(Wrts.I18n.t('publisher_method_not_found'));
  },
});
