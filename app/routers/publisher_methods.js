Wrts.helpers.registerRouter('PublisherMethods', {
  routes: {
    'publisher_methods/new':            {to: 'create',  as: 'new_publisher_method'  },
    'publisher_methods/:id':            {to: 'show',    as: 'show_publisher_method' },
    'publisher_methods/:id/edit':       {to: 'edit',    as: 'edit_publisher_method' },
  },

  show: function(slug){
    this.fetch_publisher_method(slug, function(publisher_method) {
      Wrts.app.setView(
        Wrts.views.PublisherMethods.Show, { model: publisher_method }
      );
    }, this.publisher_method_not_found);
  },

  edit: function(slug) {
    this.fetch_publisher_method(slug, function(publisher_method) {
      Wrts.app.setView(
        Wrts.views.PublisherMethods.Edit, { model: publisher_method }
      );
    });
  },

  create: function() {
    var newPublisherMethod = new Wrts.models.PublisherMethod(),
        id                 = Wrts.data.user.get('publisher_id');

    this.fetch_publisher(id, function(publisher) {
      newPublisherMethod.set('publisher', publisher);
      Wrts.app.setView(
        Wrts.views.PublisherMethods.Create, { model: newPublisherMethod }
      );
    });
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

  fetch_publisher: function(id, callback, error) {
    $.get('/publishers/' + id + '.json').done(function(data) {
      var publisher = new Wrts.models.Publisher(data);
      callback(publisher);
    }).fail(function(err) {
      this.publisher_not_found(err);
    });
  },

  publisher_not_found: function(err) {
    alert(Wrts.I18n.t('publisher_not_found'));
  },
});
