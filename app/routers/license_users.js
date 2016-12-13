Wrts.helpers.registerRouter('LicenseUsers', {
  routes: {
    'license/:id/new_license_users': {to: 'create', as: 'new_license_user' },
    'license/:license_id/license_users/:id': {to: 'edit', as: 'edit_license_user' },
  },

  create: function(id) {
    var license = Wrts.data.licenses.get(parseInt(id)),
        licenseUser = new Wrts.models.LicenseUser();

    licenseUser.set('license', license);

    Wrts.app.setView(
      Wrts.views.LicenseUsers.Create, { model: licenseUser }
    );
  },

  edit: function(license_id, id) {
    id = id;
    var license = Wrts.data.licenses.get(parseInt(license_id)),
        licenseUser = license.get('license_users').filter(function(license_user) {
          return license_user.id == id
        });

    if (licenseUser.length == 1) {
      existingLicenseUser = licenseUser[0];
      existingLicenseUser.license = license;
      license_user = new Wrts.models.LicenseUser(existingLicenseUser)

      Wrts.app.setView(
        Wrts.views.LicenseUsers.Edit, { model: license_user }
      );
    }
  },

});
