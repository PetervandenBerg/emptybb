Wrts.collections.StreamedLists = (function() {
  'use strict';

  var listFieldParsers = {
    subject: function(value, list) {
      return _(list.getSubjects()).any(function(subject){
        return subject.toLowerCase() === value.toLowerCase();
      });
    }
  };

  // The filtered subset of the 'main' collection (Lists itself)
  // This collection is used for Views
  var FilteredListCollection = Backbone.Collection.extend({
    initialize: function() {
      this.resetParams();
    },

    setParams: function(obj) {
      this.params = _.extend(this.params, obj);
      return this;
    },

    getParam: function(key) {
      return this.params[key];
    },

    getParams: function() {
      return this.params;
    },

    removeParam: function(key) {
      this.params = _.omit(this.params, key);
    },

    resetParams: function() {
      this.params = {};
      return this;
    }
  });

  return Backbone.Collection.extend({
    model: Wrts.models.List,
    _filteredCollection: null,

    comparator: function(x) {
      return (x.attributes.title||"").toLowerCase();
    },

    initialize: function() {
      var lists_loaded = false;
      this.on('add reset remove', this.generateUniqSubjects);
    },

    getActiveSubject: function() {
      var subject = this.getFilteredCollection().getParam("subject");
      return (Wrts.helpers.isPresent(subject)) ? subject : null;
    },

    findByIds: function(ids) {
      var listIds = _(ids).map(function(id) { return parseInt(id) });
      return this.filter(function(list){
        return _(listIds).contains(list.id);
      });
    },

    setParams: function(params) {
      this.getFilteredCollection().setParams(params);
      if (this.lists_loaded) {
        this.trigger("updateFilteredCollection");
      } else {
        this.lists_loaded = true;
        this.fetch({ remove: false }).done(_.bind(function(){
          this.trigger("updateFilteredCollection");
        }, this));
      };
      return this;
    },

    resetParams: function() {
      this.getFilteredCollection().resetParams();
      this.trigger("updateFilteredCollection");
      return this;
    },

    getUniqSubjects: function() {
      return this.uniqSubjects;
    },

    generateUniqSubjects: function() {
      return (
        this.uniqSubjects = _.chain(this.models)
          .map(R.func('getSubjects'))
          .flatten()
          .compact()
          .map(R.appl(Wrts.helpers.capitalize))
          .uniq()
          .value()
      );
    },

    getUniqKeywords: function() {
      return _.chain(this.models)
        .map(R.prop('keywords'))
        .flatten()
        .compact()
        .uniq()
        .value();
    },

    getFilteredCollection: function() {
      if (this._filteredCollection) {
        return this._filteredCollection;
      }

      this._filteredCollection = new FilteredListCollection();
      this.on('updateFilteredCollection', _.bind(function(){
        var params = this._filteredCollection.getParams();
        var filteredLists = this.filter(function(list){
          if (params) {
            return _.every(params, function(value, fieldName) {
              if (listFieldParsers[fieldName]) {
                return listFieldParsers[fieldName](value, list);
              }
              return list.get(fieldName);
            });
          }
          return list.hasParams(params);
        });
        this._filteredCollection.reset(filteredLists);
      }, this));

      this.trigger('updateFilteredCollection');
      return this._filteredCollection;
    },

    url: function() {
      return '/lists?' + $.param(this.getFilteredCollection().getParams());
    }
  });
})();
