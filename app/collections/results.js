(function() {
  'use strict';

  var round = function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
  };

  var getTitleById = function(id) {
    var list = Wrts.data.lists.get(id);
    return list ? list.get('title') : 'Unknown list!';
  };


  Wrts.collections.Results = Backbone.Collection.extend({
    model: Wrts.models.Result,
    url: '/results',

    groupedForLatestResults: function() {
      var grouped = {};

      this.each(function(result) {
        if (_.isEmpty(result.get('list_id') )){
          return null;
        }
        var firstId = result.get('list_id');
        if (!grouped[firstId]) {
          grouped[firstId] = {
            title: getTitleById(firstId),
            results: []
          };
        }

        if (grouped[firstId].results.length < 3) {
          grouped[firstId].results.push(result.toJSON());
        }
      });

      return _(grouped).map(function(value, key){
        var average = _(value.results).reduce(function(memo, result){
          return memo + (result.grade || 0);
        }, 0) / value.results.length;

        value.numResults = value.results.length;
        value.average = round(average/10, 1);

        return value;
      });
    },

    getWrongAnswers: function() {
      var failedAttemptArray = [];
      var failedResults =  _(this.models).select(function(result) {
        return result.getWrongAnswersCount() > 0;
      });

      _(failedResults).each(function(failedResult) {
        var failedAttempts = failedResult.getWrongAnswerAttempts();
        failedAttemptArray.push(failedAttempts);
      });

      var flattenedFailedAttemptArray = [].concat.apply([], failedAttemptArray);

      var groupedwrongAnswers = this.groupBy(flattenedFailedAttemptArray, function(item) {
        return [item.get('word'), item.get('correctAnswer')];
      });

      return groupedwrongAnswers;
    },

    forList: function(list){
      var results = this.filter(function(result){
        return (list.get('id') === result.get("list_id"));
      });
      return new Wrts.collections.Results(results);
    },

    getWrongAnswerLists: function() {
      var questionList = [{'subject' : '', 'speech_locale' : '', 'words' : [] }],
          answerList   = [{'subject' : '', 'speech_locale' : '', 'words' : [] }],
          failedAttempts = this.getWrongAnswers(),
          newLists     = [],
          i;

      for (i = 0; i < failedAttempts.length; i++) {
        var attempt  = failedAttempts[i][0],
            question = attempt.get('word'),
            answer   = _.uniq(attempt.get('possibleAnswers'));

        if (answer.length == 0) {
          var answer = attempt.get('answer').join(' , ');
        }

        questionList[0].words.push({'word' : question});
        answerList[0].words.push({'word' : answer});
      }

      newLists.push(questionList[0]);
      newLists.push(answerList[0]);

      return {"lists": newLists}
    },

    groupBy: function( array , f ) {
      var groups = {};
      array.forEach( function( o )
      {
        var group = JSON.stringify( f(o) );
        groups[group] = groups[group] || [];
        groups[group].push( o );  
      });
      return Object.keys(groups).map( function( group )
      {
        return groups[group]; 
      })
    }
  });
})();
