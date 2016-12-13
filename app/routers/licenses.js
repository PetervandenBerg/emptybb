Wrts.helpers.registerRouter('Licenses', {
  routes: {
    "licenses": {to: 'index',   as: 'licenses_index' },
    "licenses/:id": {to: "show", as: "show_license" },
    "license/:id/edit": {to: 'edit',   as: 'edit_license' },
  },

  index: function() {
    Wrts.app.setView(
      Wrts.views.Licenses.Index, { collection: Wrts.data.licenses }
    );
  },

  show: function(id){
    var license = Wrts.data.licenses.get(id);
    Wrts.app.setView(
      Wrts.views.Licenses.Show, {model: license}
    );
  },

  edit: function(id){
    var license = Wrts.data.licenses.get(id);
    Wrts.app.setView(
      Wrts.views.Licenses.Edit, {model: license}
    );
  },

});
