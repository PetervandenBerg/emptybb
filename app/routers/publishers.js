Wrts.helpers.registerRouter('Publishers', {
  routes: {
    'publishers':                 {to: 'index',   as: 'publishers_index' },
    'publishers/:id':             {to: 'show',    as: 'show_publisher' },
    'publishers/:id/edit':        {to: 'edit',    as: 'edit_publisher' },
  },

  index: function() {
    window.location = "/publishers"
    // if (Wrts.data.user && Wrts.data.user.get('role') === "Verlopen"){
    //   return Wrts.app.setView(Wrts.views.Subscriptions.ExpiredSubscription, {});
    // }
    // this.fetch_publishers('', function(publishers) {
    //   Wrts.app.setView(
    //     Wrts.views.Publishers.Index, { collection: publishers }
    //   );
    // });
  },

  show: function(id){
    this.fetch_publisher(id, function(publisher) {
      Wrts.app.setView(
        Wrts.views.Publishers.Show, {model: publisher}
      );
    });
  },

  edit: function(id) {
     Wrts.helpers.throwError("Not implemented yet");
  },

  fetch_publishers: function(id, callback, error) {
    $.get('/publishers' + '.json').done(function(data) {
      var publishers = _(data.attributes).map(function(pub) { return new Wrts.models.Publisher(pub) });
      callback(data);
    }).fail(function(err) {
      this.publisher_not_found(err);
    });
  },

  publishers_not_found: function(err) {
    alert('Geen uitgever gevonden, probeer opnieuw.');
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
  }

});
