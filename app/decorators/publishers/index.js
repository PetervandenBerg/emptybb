Wrts.decorators.Publishers.Index = Wrts.BaseDecorator.extend({

  getData: function() {
    var publishers = this.collection;

    return {
      user: Wrts.data.user,
      publishers: publishers
    };
  },

});
