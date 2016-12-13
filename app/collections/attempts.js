(function(){
  'use strict';

  Wrts.collections.Attempts = Backbone.Collection.extend({
  model: Wrts.models.Attempt,

  firstByLevel: function(level) {
    return this.find(function(attempt) {
      return !attempt.isCorrect() && attempt.getWrongAnswersCount() < level;
    });
  },

  isAllCorrect: function() {
    return this.every(function(attempt){
      return attempt.isCorrect();
    });
  },

  getUnansweredAttempts: function() {
    return this.filter(function(attempt){
      return attempt.hasAnswer() === false;
    });
  },

  /**
   * @name getWrongAnswersCount
   * Loop through every answered attempt and sum all wrong answers.
   */
  getWrongAnswersCount: function() {
    return this.reduce(function(memo, attempt) {
      return memo + attempt.getWrongAnswersCount();
    }, 0);
  },

  /**
   * @name getCorrectAnswersCount
   * Loop through every answered attempt and sum all correct answers.
   */
  getCorrectAnswersCount: function() {
    return this.reduce(function(memo, attempt) {
      if (attempt.hasAnswer() && attempt.isCorrect()) {
        memo += 1;
      }
      return memo;
    }, 0);
  },

  getTotalTime: function() {
    if(this.any( function(attempt){ return attempt.isDoing(); } )){
      return;
    }
    return this.reduce( function(memo, attempt) {
      return memo + attempt.get('duration');
    }, 0);
  }
});


})();
