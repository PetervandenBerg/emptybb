Wrts.views.LicenseUsers.Create = Wrts.views.LicenseUsers._FormActions.extend({
  templateName: 'license_users/create',
  decorator: Wrts.decorators.LicenseUsers.Create,

  events: _.extend(Wrts.views.LicenseUsers._FormActions.prototype.events, {
  }),

  init: function(){
    this.render();
  },

});
