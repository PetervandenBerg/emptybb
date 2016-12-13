Wrts.helpers.registerRouter('Lists', {
  routes: {
    'lists':                                         {to: 'index',   as: 'lists_index' },
    'import_list':                                   {to: 'list_import',  as: 'import_list' },
    'lists/new/cover/:id':                           {to: 'create',  as: 'new_list'},
    'lists/new':                                     {to: 'create',  as: 'new_list'},
    'lists/filter/:subject':                         {to: 'filter',  as: 'list_subject' },
    'lists/:id':                                     {to: 'show',    as: 'show_list' },
    'lists/:id/publisher/:id/publisher_method/:id':  {to: 'show',    as: 'show_publisher_list' },
    'lists/:id/edit':                                {to: 'edit',    as: 'edit_list' },
    'lists/:id/results':                             {to: 'results', as: 'result_list' },
    'lists/:id/transfer':                            {to: 'transfer', as: 'transfer_list' },
    'lists/:id/rehearse':                            {to: 'rehearse', as: 'rehearse_list' },
    'lists/:id/instant_rehearse':                    {to: 'instant_rehearse', as: 'instant_rehearse_list' },
    'lists/:id/print':                               {to: 'list_print', as: 'list_print' },
    'lists/:id/file_export':                         {to: 'list_file_export', as: 'list_file_export' },
    'lists/:id/export':                              {to: 'list_export',  as: 'export_list' },
    'streamed_lists':                                {to: 'streamed_lists_index', as: 'streamed_lists_index' },
    'streamed_list/:id':                             {to: 'show_streamed_list', as: 'show_streamed_list' },
    'streamed_list/:id/print':                       {to: 'streamed_list_print', as: 'streamed_list_print' },
    'streamed_list/:id/file_export':                 {to: 'streamed_list_file_export', as: 'streamed_list_file_export' },
    'streamed_lists/:id/transfer':                   {to: 'streamed_transfer', as: 'transfer_streamed_list' },
    'streamed_lists/:id/results':                    {to: 'streamed_results', as: 'streamed_result_list' },
    'lists/:id/undelete':                            {to: 'list_undelete',  as: 'list_undelete' },
    'recent_lists':                                  {to: 'recent_lists', as: 'recent_lists' },
    'deleted_lists':                                 {to: 'deleted_lists',  as: 'deleted_lists' },
  },

  index: function() {
    if (Wrts.data.user && Wrts.data.user.get('role') === "Verlopen"){
      return Wrts.app.setView(Wrts.views.Subscriptions.ExpiredSubscription, {});
    }
    this.loadAllLists();
  },

  streamed_lists_index: function() {
    Wrts.app.setView(
      Wrts.views.Lists.StreamedListsIndex, { collection: Wrts.data.streamed_lists.getFilteredCollection() }
    );
  },

  filter: function(subject) {
    if (subject && subject != '#') {
      Wrts.data.lists
        .setParams({
          subject: subject
        });
    } else {
      Wrts.data.lists.resetParams();
    }

    Wrts.app.setView(
      Wrts.views.Lists.Index, { collection: Wrts.data.lists.getFilteredCollection() }
    );
  },

  show_streamed_list: function(id){
    var list = Wrts.data.streamed_lists.get(id);

    Wrts.app.setView(
      Wrts.views.Lists.Show, { model: list }
    );
  },

  show: function(id, publisherId, publisherMethod) {
    var publisher = Wrts.data.publishers.get(publisherId);

    this.fetch_published_list(id, function(list) {
      list.publisher = publisher;
      list.publisherMethod = publisherMethod;

      Wrts.app.setView(
        Wrts.views.Lists.Show, { model: list }
      );
    }, this.list_not_found);

  },

  edit: function(id) {
    var list = Wrts.data.lists.get(id);

    if (list == undefined) {
      this.fetch_list(id, function(fetched_list) {
        list = fetched_list;
      });
    }

    if (list.get('cover_id') != null) {
      this.fetch_cover(list.get('cover_id'), function(cover) {
        list.cover = cover;
        Wrts.app.setView(
          Wrts.views.Lists.Edit, { model: list }
        );
      });
    } else {
      this.fetch_publishers('', function(publishers) {
        Wrts.app.setView(
          Wrts.views.Lists.Edit, { model: list, collection: publishers }
        );
      });
    }
  },

  transfer: function(id) {
    this.fetch_published_list(id, function(list) {
      var new_list = new Wrts.models.List();

      // Only copy title, set shared to false
      new_list.set('title', list.attributes.title);
      new_list.set('reference_id', list.attributes.id);
      new_list.set('shared', false);
      new_list.setListCollection(list.getListCollection());

      Wrts.app.setView(
        Wrts.views.Lists.Create, { model: new_list }
      );
    }, this.list_not_found);
  },

  streamed_transfer: function(id) {
    var new_list = Wrts.data.streamed_lists.get(id);
    new_list.id = undefined
    new_list.attributes.id = undefined
    Wrts.app.setView(
      Wrts.views.Lists.Create, { model: new_list }
    );
  },

  stream_list: function(id) {
    $.post('/create_streamed_list', {id: id}).done(function(data) {
      var newList = new Wrts.models.List(data);
      newList.listCollection = newList.attributes.list_collection;
      Wrts.data.lists.add(newList);
      Wrts.app.getRouter().navigate('#/lists', {trigger: true});
    }).fail(function(err) {
      alert(err);
    });
  },

  deleted_lists: function() {
    this.fetch_delete_lists({}, function(lists) {
      Wrts.data.deleted_lists.reset(lists);
      Wrts.app.setView(
        Wrts.views.Lists.DeletedLists, { collection: Wrts.data.deleted_lists }
      ); 
    });
  },

  recent_lists: function() {
    if (Wrts.data.user && Wrts.data.user.get('role') === "Verlopen"){
      return Wrts.app.setView(Wrts.views.Subscriptions.ExpiredSubscription, {});
    }
    Wrts.app.setView(
      Wrts.views.Lists.RecentLists, { collection: Wrts.data.lists }
    ); 
  },

  instant_rehearse: function(id) {
    Wrts.app.getRouter().navigate('#/exercises/' + id + '/prepare', {trigger: true});
  },

  rehearse: function(id) {
    this.fetch_published_list(id, function(list) {
      var new_list = new Wrts.models.List();

      new_list.set('title', list.attributes.title);
      new_list.set('shared', false);
      new_list.set('reference_id', list.attributes.id);
      new_list.setListCollection(list.getListCollection());
      new_list.save().done(function(data) {
        Wrts.data.lists.add(new_list);
        Wrts.app.getRouter().navigate('#/exercises/' + data.id + '/prepare', {trigger: true}) 
      });

    }, this.list_not_found);

  },

  create: function(coverId) {
    var list = new Wrts.models.List();

    if (coverId) {
      this.fetch_cover(coverId, function(cover) {
        list.cover = cover;
        Wrts.app.setView(
          Wrts.views.Lists.Create, { model: list }
        );
      });
    } else {
      this.fetch_publishers('', function(publishers) {
        Wrts.app.setView(
          Wrts.views.Lists.Create, { model: list, collection: publishers }
        );
      });
    }
  },

  results: function(id) {
    this.fetch_results(id, function(results) {
      var model = Wrts.data.lists.get(id),
          collection = Wrts.data.results.forList(model),
          view;

      if (collection.size() === 0) {
        view = Wrts.views.Results.NoResults;
      } else {
        view = Wrts.views.Results.Index;
      }

      Wrts.app.setView(
        view, { model: model, collection: collection }
      );
    }, this.list_not_found);
  },

  streamed_results: function(id) {
    this.fetch_results(id, function(results) {
      var model = Wrts.data.streamed_lists.get(id),
          collection = Wrts.data.results.forList(model),
          view;

      if (collection.size() === 0) {
        view = Wrts.views.Results.NoResults;
      } else {
        view = Wrts.views.Results.Index;
      }

      Wrts.app.setView(
        view, { model: model, collection: collection }
      );
    }, this.list_not_found);
  },

  list_export: function(id) {
    this.fetch_published_list(id, function(list) {
      Wrts.app.setView(
        Wrts.views.Lists.Export, { model: list }
      );
    }, this.list_not_found);
  },

  list_print: function(id) {
    this.fetch_published_list(id, function(list) {
      Wrts.app.setView(
        Wrts.views.Lists.Print, { model: list }
      );
    }, this.list_not_found);
  },

  list_file_export: function(id) {
    this.fetch_published_list(id, function(list) {
      Wrts.app.setView(
        Wrts.views.Lists.FileExport, { model: list }
      );
    }, this.list_not_found);
  },

  list_import: function() {
    Wrts.app.setView(
      Wrts.views.Lists.Import, { collection: Wrts.data.lists.getFilteredCollection() }
    );
  },

  streamed_list_print: function(id) {
    var list = Wrts.data.streamed_lists.get(id);
    Wrts.app.setView(
      Wrts.views.Lists.Print, { model: list }
    );
  },

  streamed_list_file_export: function(id) {
    var list = Wrts.data.streamed_lists.get(id);
    Wrts.app.setView(
      Wrts.views.Lists.FileExport, { model: list }
    );
  },

  list_undelete: function(id) {
    this.fetch_deleted_list(id, function(list) {
      Wrts.data.lists.add(list);
      Wrts.data.deleted_lists.remove(list);
      Wrts.app.getRouter().navigate('#/lists/', {trigger: true}) 
    }, this.list_not_found);
  },
  // Fetch a published list from its url
  fetch_published_list: function(id, callback, error) {
    $.get('/lists/' + id + '.json').done(function(data) {
      var list = new Wrts.models.List(data);
      list.parse(data);
      callback(list);
    }).fail(function(err) {
      error(err);
    });
  },

  fetch_deleted_list: function(id, callback, error) {
    $.get('/lists/' + id + '.json', {undelete: true}).done(function(data) {
      var list = new Wrts.models.List(data);
      list.parse(data);
      callback(list);
    }).fail(function(err) {
      error(err);
    });
  },

  list_not_found: function(err) {
    alert(Wrts.I18n.t('list_not_found'));
    Wrts.app.getRouter().navigate('/lists', {trigger: true});
  },

  // Fetch results doesn't do anything with paging at the moment so limits to 25 results
  fetch_results: function(list_id, callback, error) {
    var url = '/results.json';
    if(list_id != null) {
      url = '/lists/' + list_id + url;
    }
    $.get(url).done(function(data) {
      Wrts.data.results.reset(data, { parse: true });
      callback(Wrts.data.results);
    }).fail(function(err) {
      error(err);
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

  fetch_delete_lists: function(id, callback, error) {
    $.get('/deleted_lists').done(function(data) {
      var lists = []
      _(data).each(function(list) {
        var newList = new Wrts.models.List(list);
        newList.listCollection = list.list_collection;
        lists.push(newList);
      });
      callback(lists);
    }).fail(function(err) {
      alert(err);
    }); 
  },

  fetch_publishers: function(id, callback, error) {
    $.get('/publishers_select' + '.json').done(function(data) {
      var publishers = _(data.attributes).map(function(pub) { return new Wrts.models.Publisher(pub) });
      callback(data);
    }).fail(function(err) {
      this.publisher_not_found(err);
    });
  },

  publishers_not_found: function(err) {
    alert('Geen uitgever gevonden, probeer opnieuw.');
  },

  fetch_list: function(id, callback, error) {
    $.ajax({
      url: '/lists/' + id + '.json',
      async: false,
      dataType: 'json',
      success: function(data) {
        list = new Wrts.models.List(data);
        list.listCollection = list.attributes.list_collection;
        callback(list);
      },
      error: function(data){
        alert('Lijst niet gevonden, probeer opnieuw.');
      }
    });
  },

  loadAllLists: function(ev){
    if (!localStorage.getItem('lists')) {
      $.ajax({
        type: 'GET',
        url: '/lists',
        dataType: 'JSON',
        success: function(data) {
          $(data).each(function(i, list){
            var list = new Wrts.models.List(list);
            list = list.parse(list);
            list.listCollection = list.get('list_collection')
            Wrts.data.lists.add(list);
          });
        },
        error: function(data){
          console.log('kak')
        }
      }).done(function() {
        localStorage.setItem('lists','loaded');
        var lists = Wrts.data.lists.getFilteredCollection();

        Wrts.app.setView(
          Wrts.views.Lists.Index, { collection: lists }
        );
      });
    } else {
      Wrts.app.setView(
        Wrts.views.Lists.Index, { collection: Wrts.data.lists.getFilteredCollection() }
      );
    }
  }

});
