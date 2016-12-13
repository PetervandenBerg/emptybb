Wrts.helpers.Checker = (function(){
  // private functions
  var checkEmptyString = function(givenAnswer) {
    return !givenAnswer;
  };

  function Checker(configuration) {
    this.lastResult = null;
    this.configuration = configuration;
  }

  Checker.prototype = {

    setLastResult: function(result) {
      this.lastResult = result;
      return result;
    },

    resetMessage: function(){
      this.lastResult = null;
    },

    getLastMessage: function() {
      return this.lastResult ? this.lastResult.message : "";
    },

    getResult: function(givenAnswer, attempt, configuration) {
      var result = { correct: false };

      if (attempt.getPossibleAnswers().length < 1) {
        attempt.attributes.correctAnswer = attempt.attributes.word
        attempt.correctAnswer = attempt.attributes.word
        attempt.getPossibleAnswers()[0] = attempt.attributes.word
      }

      if (configuration.exerciseType === 'in_your_mind') {
        result.correct = givenAnswer;
        return this.setLastResult(result);
      }

      var compareObject = this.createCompareObject(givenAnswer, attempt.getPossibleAnswers());

      if (_(compareObject.possibleAnswers).contains(compareObject.givenAnswer)) {
        result.correct = true;
        return this.setLastResult(result);
      }

      if (_(compareObject.possibleAnswers).contains(compareObject.givenWithoutArticle)) {
        result.message = Wrts.I18n.translate("wrong_lid_word");
        result.retry = true;
        return this.setLastResult(result);
      }

      _(compareObject.possibleAnswers).each( _.bind(function(answer) {
        typo = Wrts.helpers.smallTypo(answer, compareObject.givenAnswer);
        if( typo && typo.distance < 0.3 * answer.length ){
          result.message = Wrts.I18n.translate("almost_there") + ": " + typo.retryText;
          result.retry = true;
          return this.setLastResult(result);
        }
      }, this));

      return this.setLastResult(result);
    },

    // The comparer compares the answer to a word
    // The comparer takes in account the configuration supplied when the 'comparer'
    // was created. The only function should be compare (return true/false)
    createCompareObject: function(givenAnswer, possibleAnswers) {
      // check capitals if checkbox is enabled
      if (!this.configuration.capitals){
        givenAnswer = givenAnswer.toLowerCase();
        possibleAnswers = _(possibleAnswers).map(function(pa){
          return pa.toLowerCase();
        });
      }

      // check diacritics if checkbox is enabled
      if (!this.configuration.diacritics) {
        givenAnswer = Wrts.helpers.replaceDiacritics(givenAnswer);
        possibleAnswers = _(possibleAnswers).map(function(pa){
          return Wrts.helpers.replaceDiacritics(pa);
        });
      }

      // check punctuation if checkbox is enabled
      if (!this.configuration.punctuation) {
        givenAnswer = Wrts.helpers.removePunctuation(givenAnswer);
        possibleAnswers = _(possibleAnswers).map(function(pa){
          return Wrts.helpers.removePunctuation(pa);
        });
      }

      return {
        possibleAnswers: possibleAnswers,
        givenAnswer: givenAnswer,
        givenWithoutArticle: Wrts.helpers.removeArticle(givenAnswer)
      };
    }
  };

  // public class
  return Checker;
})();

