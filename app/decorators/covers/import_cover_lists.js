Wrts.decorators.Covers.ImportCoverLists = Wrts.BaseDecorator.extend({

  getData: function() {
    return _.extend(this.model.toJSON(), {
      methods: this.getMethods(),
      publisher_method: this.getPublisherMethod(),
      publisher: this.getPublisher(),
      isCurrentPublisher: this.checkForPublisher(),
      advertisement_url: 'list_index',
      lists: this.getLists(),
    });
  },

  checkForPublisher: function(){
    return (this.model.get('publisher').user_id === Wrts.data.user.id);
  },

  getPublisher: function(){
    return this.model.get('publisher');
  },

  getPublisherMethod: function(){
    return this.model.get("publisher_method");
  },

  getMethods: function(){
    return this.model.get("methods");
  },

  getLists: function(){
    var lists = this.model.get("lists");
    var listReferenceArray = this.getListReferenceArray();

    _(lists).each(function(list) {
      var subjects = _(list.list_collection.lists).map(function(wordList){
        return $.trim(wordList.subject);
      });
      list.canBeTransferred = (listReferenceArray.indexOf(list.id) === -1);
      list.subjects = subjects.join(' - ');
    });
    return lists;
  },

  getListReferenceArray: function() {
    return Wrts.data.lists.map(function(list) { 
      return list.get('reference_id');
    });
  },

});
