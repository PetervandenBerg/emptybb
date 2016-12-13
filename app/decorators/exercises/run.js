(function() {
  'use strict';

  Wrts.decorators.Exercises.Run = Wrts.BaseDecorator.extend({
    getData: function(options) {
      return _.extend({
        percentageDone:       this.getPercentageDone(options.currentAttempt),
        numberOfWordsLeft:    this.getNumberOfWordsLeft(),
        correctAnswersCount:  this.getCorrectAnswersCount(),
        wrongAnswersCount:    this.getWrongAnswersCount(),
        answerRounds:         this.answerRounds()
      }, this.model.toJSON());
    },

    getPercentageDone: function(currentAttempt) {
      return Math.round(this.model.getPercentageDone(currentAttempt));
    },

    getNumberOfWordsLeft: function() {
      if (this.model.getConfiguration().repeat === true) { 
        return this.model.attributes.attempts.length - this.model.getCorrectAnswersCount();
      } else {
        return this.model.getUnansweredAttempts().length;
      }
    },

    getCorrectAnswersCount: function() {
      return this.model.getCorrectAnswersCount();
    },

    getWrongAnswersCount: function() {
      return this.model.getWrongAnswersCount();
    },

    answerRounds: function(){
      return _.countBy(this.model.getAnsweredAttempts(),
        R.func("getWrongAnswersCount"));
    }
  });
})();
