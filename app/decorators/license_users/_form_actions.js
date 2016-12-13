Wrts.decorators.LicenseUsers._FormActions = Wrts.BaseDecorator.extend({
  getData: function(clone) {
    var clone = this.model,
        license = clone.get('license'),
        user = Wrts.data.user.get("username");

    delete clone.attributes.license

    return _.extend({
      user: user,
      license: license.toJSON(),
      isLicensesPage: true,
      licensesPresent: this.licensesPresent(),
    }, clone.toJSON());
  },

  licensesPresent: function(account) {
    return (Wrts.data.licenses.length > 0)
  },
});
