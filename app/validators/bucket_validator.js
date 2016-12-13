Wrts.ns("validators").BucketValidator = Wrts.BaseValidator.extend({
  validate: function(attrs) {
    if (!attrs.id && Wrts.data.buckets.length >= Wrts.data.user.get('max_allowed_buckets')) {
      return Wrts.I18n.translate("bucket-validations-bucket-limit-reached");
    }
    if (!attrs.name || attrs.name === "") {
      return Wrts.I18n.translate("bucket-validations-missing-name");
    }
    if (attrs.name && attrs.name !== "") {
      for (i = 0; i < Wrts.data.buckets.models.length; i++) { 
        var bucket = Wrts.data.buckets.models[i]
        if (bucket.get('name') === attrs.name && bucket.get('id') !== attrs.id) {
          var existingBucket = true;
        }
      }
      if (existingBucket) {
        return Wrts.I18n.translate("bucket-validations-duplicate-name");
      }
    }
    if (attrs.shared && attrs.shared !== "false") {
      if (!attrs.slug || attrs.slug === "") {
        return Wrts.I18n.translate("bucket-validations-missing-slug");
      }
    }
    if (attrs.slug && attrs.slug !== "") {
      for (i = 0; i < Wrts.data.buckets.models.length; i++) { 
        var bucket = Wrts.data.buckets.models[i]
        if (bucket.get('slug') === attrs.slug && bucket.get('id') !== attrs.id) {
          var existingBucket = true;
        }
      }
      if (existingBucket) {
        return Wrts.I18n.translate("bucket-validations-unique-slug");
      }
    }
  }
});
