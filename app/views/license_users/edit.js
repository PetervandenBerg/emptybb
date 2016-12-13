Wrts.views.LicenseUsers.Edit = Wrts.views.LicenseUsers._FormActions.extend({
  templateName: 'license_users/edit',
  decorator: Wrts.decorators.LicenseUsers.Edit,

  events: _.extend(Wrts.views.LicenseUsers._FormActions.prototype.events, {
  }),

  init: function(){
    this.render();
  },

});
