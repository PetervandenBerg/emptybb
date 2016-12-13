(function() {
  'use strict';

  Wrts.decorators.Overview = Wrts.BaseDecorator.extend({
    getData: function() {
      var exercises = this.getSuggestedExercises().toJSON();

      _(exercises).each(function(exercise) {
        exercise.subjects = _.map(exercise.list_collection, function(list) {
          return Wrts.helpers.truncate(list.subject, 3, false) || 'Geen';
        }).join(' - ');
      });

      var lastResults = this.getLastResults();

      return {
        suggestedExercises: exercises.slice(0,4),
        lastResults: lastResults.slice(0,4),
        listCount: this.getListCount()
      };
    },

    getSuggestedExercises: function() {
      // deze functie zou exercises moeten returnen dus eigenlijk results
      return new Wrts.collections.Lists(
        Wrts.data.lists.filter( function(list) {
          if (list.getCreatedAt() > moment().subtract('weeks', 4) ) return list;
        })
      );
    },

    getLastResults: function() {
      return Wrts.data.results.groupedForLatestResults();
    },
    getListCount: function(){
      return Wrts.data.lists.length;
    }
  });
})();