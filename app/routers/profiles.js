 Wrts.helpers.registerRouter('Profiles', {
  routes: {
    'profile/:id/show': 'show',
    'profile/:id/activated': 'account_activated',
    'profile/:id/filter/:subject': {to: 'filter',  as: 'profile_list_subject' },
  },

  show: function(id) {
    this.fetch_user_profile(id, function(data) {
      var userLists = []
      _(data.lists).each(function(list) { 
        var newList = new Wrts.models.List(list)
        newList.listCollection = newList.get('list_collection');
        userLists.push(newList);
      });

      Wrts.data.user_lists.reset(userLists);
      var collection = Wrts.data.user_lists.getFilteredCollection();

      Wrts.app.setView(
        Wrts.views.Profiles.Show, { model: data, collection: collection }
      );
    });
  },

  account_activated: function(id){
    this.fetch_user_profile(id, function(data) {
      Wrts.app.setView(
        Wrts.views.Profiles.AccountActivated, { model: data }
      );
    });
  },

  shared_lists: function(id) {
    this.fetch_user_profile(id, function(data) {
      var userSharedLists = []
      _(data.lists).each(function(list) { 
        var newList = new Wrts.models.List(list)
        newList.listCollection = newList.get('list_collection');
        if (newList.attributes.shared === true) {
          userSharedLists.push(newList);
        }
      });

      Wrts.data.user_shared_lists.reset(userSharedLists);
      var collection = Wrts.data.user_shared_lists.getFilteredCollection();
      Wrts.app.setView(
        Wrts.views.Profiles.SharedLists, { model: data, collection: collection }
      );
    });
  },

  filter: function(id, subject) {
    this.fetch_user_profile(id, function(data) {
      if (Wrts.data.user_lists.length === 0) {
        var userLists = []
        _(data.lists).each(function(list) { 
          var newList = new Wrts.models.List(list)
          newList.listCollection = newList.get('list_collection');
          userLists.push(newList);
        });

        Wrts.data.user_lists.reset(userLists);
      }

      if (subject && subject != '#') {
        Wrts.data.user_lists
          .setParams({
            subject: subject
          });
      } else {
        Wrts.data.user_lists.resetParams();
      }

      var collection = Wrts.data.user_lists.getFilteredCollection();

      Wrts.app.setView(
        Wrts.views.Profiles.Show, { model: data, collection: collection }
      );
    });
  },

  fetch_user_profile: function(id, callback, error) {
    $.get('/users/' + id + '.json').done(function(data) {
      callback(data);
    }).fail(function(err) {
      alert('Gebruiker niet gevonden.')
      Wrts.app.setView(
        Wrts.views.Lists.Index, { collection: Wrts.data.lists.getFilteredCollection() }
      );
    });
  },

});
