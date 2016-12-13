Wrts.decorators.PublisherMethods.Show = Wrts.BaseDecorator.extend({

  getData: function() {
    return _.extend(this.model.toJSON(), {
      methods: this.getMethods(),
      publisher_method: this.getPublisherMethod(),
      publisher: this.getPublisher(),
      covers: this.getCovers(),
      isCurrentPublisher: this.checkForPublisher()
    });
  },

  checkForPublisher: function(){
    return (this.model.get('publisher').user_id === Wrts.data.user.id);
  },

  getMethods: function(){
    if (Wrts.data.PublisherMethods) {
      return Wrts.data.PublisherMethods;
    } else {
      return this.model.get('methods');
    }
  },

  getCovers: function(){
    Wrts.data.Covers = this.model.get("covers");
    return Wrts.data.Covers;
  },

  getPublisher: function(){
    return this.model.get("publisher");
  },

  getPublisherMethod: function(){
    return this.model.toJSON();
  },

});
