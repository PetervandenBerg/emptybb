(function() {
  'use strict';
  Wrts.decorators.Exercises.RunChild = Wrts.BaseDecorator.extend({
    getData: function(options) {
      this.currentAttempt = options.currentAttempt;

      return $.extend({
        listIds:                    this.findListIds(),
        currentAttempt:             this.getCurrentAttempt().toJSON(),
        isShowWord:                 this.isShowWord(),
        word:                       this.getWord(),
        realTitle:                  this.getTitle(),
        answerLocale:               this.getAnswerLocale(),
        wordLocale:                 this.getWordLocale(),
        answerSubject:              this.getAnswerSubject(),
        suggestion:                 this.getSuggestion(),
        message:                    this.model.getLastMessage(),
        answer:                     this.getAnswer(),
        givenAnswer:                this.getGivenAnswer(),
        exerciseTypes:              this.getExerciseTypes(),
        showToggles:                this.getShowToggles(),
        showTimed:                  this.getShowTimed(),
        exerciseId:                 this.model.cid,
        canSpeakWord:               this.canSpeakWord(),
        showExtraPunctuationMarks:  Wrts.data.user.getConfiguration().punctuation_marks,
        doesntHaveAnxietyProblems:  this.getAnxiety()
      },
        this.getAnswerOptions(),
        options.viewTypes,
        this.model.toJSON()
      );
    },

    findListIds: function() {
      var attempts = this.model.get('attempts').models;
      var listIds = $(attempts).map(function(i, attempt) {
        return attempt.get('list_id');
      });
      return _.uniq(listIds).join('&');
    },

    getAnxiety: function() {
      return !Wrts.data.user.getConfiguration().anxiety;
    },

    getAnswerOptions: function() {
      var option = this.viewState.get('answerOption');
      return {
        answerOptionYesChecked: option === true,
        answerOptionNoChecked: option === false
      };
    },

    getAnswerSubject: function() {
      return this.currentAttempt.get('answerSubject');
    },

    getCurrentAttempt: function() {
      return !_.isEmpty(this.currentAttempt) ? this.currentAttempt : null;
    },

    isShowWord: function() {
      var exerciseType = this.model.getConfiguration().exerciseType;
      if (exerciseType === 'dictate'){
        return false;
      }
      if (exerciseType === 'timed'){
        return !this.getShowTimed();
      }
      return true;
    },

    getWord: function() {
      return this.currentAttempt.get('word');
    },

    getTitle: function() {
      return this.getTitleById(this.model.attributes.list_id);
    },

    getTitleById: function(id) {
      if (id) {
        var list = Wrts.data.lists.get(id);
      } else {
        var list = Wrts.data.lists.get(this.currentAttempt.get('list_id'));
      }

      if (!list) {
        var list = Wrts.data.streamed_lists.get(this.currentAttempt.get('list_id'));
      }

      return list ? list.get('title') : 'Unknown list!';
    },

    getAnswerLocale: function() {
      return this.currentAttempt.get('answerSpeechLocale');
    },

    getWordLocale: function(){
      return this.currentAttempt.get('wordSpeechLocale');
    },

    getAnswer: function() {
      if (this.currentAttempt.get('answer').length < 1) {
        return this.currentAttempt.attributes.word
      } else {
        return this.currentAttempt.get('answer').join(', ');
      }
    },

    getConfiguration: function(){
      return this.model.getConfiguration();
    },

    getShowToggles: function() {
      return this.viewState.get('showToggles');
    },

    getShowTimed: function() {
      return this.viewState.get('showTimed');
    },

    getExerciseType: function(){
      return this.getConfiguration().exerciseType;
    },

    getSuggestion: function() {
      var suggestion;
      switch (this.getExerciseType()) {
        case 'puzzle':
          suggestion = this.currentAttempt.get('shuffledAnswer');
          break;
        case 'vowels':
          suggestion = this.currentAttempt.get('stripNonVowelsAnswer');
          break;
        case 'first_letter':
          suggestion = Wrts.helpers.firstLetterOnly(this.getAnswer());
          break;
      }
      return suggestion;
    },

    getGivenAnswer: function(){
      return this.viewState.get('givenAnswer');
    },

    canSpeakWord: function(){
      var word = this.getWord();
      var locale = this.getWordLocale();
      if (locale && locale.length > 2 || word && word.length > 1000) {
        return false
      } else {
        return true
      }
    },

    getExerciseTypes: function() {
      var type = this.getExerciseType();
      return {
         isInYourMind: type === 'in_your_mind',
         isTimed: type === 'timed'
      };
    }
  });


})();
