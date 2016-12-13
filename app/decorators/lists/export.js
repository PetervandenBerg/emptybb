Wrts.decorators.Lists.Export = Wrts.BaseDecorator.extend({
  getData: function() {
    var my_profile        = listInMyProfile(),
        streamed_lists    = Wrts.data.streamed_lists,
        two_column_list   = isTwoColumnList();

    function listInMyProfile() {
      var url = window.location.hash.split('/');
      var id = url[url.length-2];
      var own_list = Wrts.data.lists.get(id);

      if (!own_list) { 
        return false;
      } else {
        return true
      }
    }

    function isTwoColumnList() {
      var url = window.location.hash.split('/');
      var id = url[url.length-2];
      var own_list = Wrts.data.lists.get(id);
      return(own_list.listCollection.lists.length === 2);
    }

    function readFromPopstate(type) {
      return (localStorage.getItem(type) === "hide");
    }

    return _.extend(this.model.toJSON(), {
      my_profile: my_profile,
      bucketsClosed: readFromPopstate("buckets"),
      restriction: Wrts.data.restriction.attributes,
      streamedLists: streamed_lists,
      anyStreamedLists: streamed_lists.length > 0,
      subjectsClosed: readFromPopstate("subjects"),
      isTwoColumnList: two_column_list
    });
  }
});
