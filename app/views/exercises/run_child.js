/* @flow */

// IH: run.js and run_child.js are crazily complex, with
// various functions triggering events to call other functions.

(function() {
  'use strict';
  var viewTypes = Wrts.models.Exercise.viewTypes;

  Wrts.views.Exercises.RunChild = Wrts.BaseView.extend({
    partialName: 'exercises/_run_child',
    decorator: Wrts.decorators.Exercises.RunChild,

    init: function(options) {
      this.viewState = options.viewState;
      this.timer = null;

      this.listenTo(this, 'after_render', this.focusOnAnswerInput);

      if (this.model.getConfiguration().exerciseType === 'multiple_choice') {
        $('body').keyup(this.submitFormByKey);
      }

      if (this.model.getConfiguration().exerciseType === 'timed') {
        // this.listenTo(this, 'after_render', this.autoTimedOut);
        this.listenTo(this.viewState, 'change:showTimed', this.render);
      }

      this.listenTo(this.viewState, 'change:viewType', this.startAttempt);
    },

    events: {
      'keydown input[name=answer]':                        'answerKeydown',
      'click .in-your-mind-button':                        'answerOptionChange',
      'click .js-show_toggles':                            'showToggles',
      'submit form':                                       'formSubmit',
      'click .speechlocale-trigger':                       'speakWord',
      'touchstart .speechlocale-trigger':                  'speakWord',
      'click .speechlocale-answer-trigger':                'speakAnswer',
      'touchstart .speechlocale-answer-trigger':           'speakAnswer',
      'click #manual-next-button':                         'manualAutoUnlockWithAttempt',
      'click #right-answer-button':                        'countAsRightAnswer',
      'click #wrong-answer-button':                        'countAsWrongAnswer',
      'click .multiple-choice-answers input[name=answer]': 'setActiveClass'
    },

    // Event functions
    // ====================================================
    speakWord: function(ev){
      if (ev) {
        $(ev.target).removeClass('fa-volume-off').addClass('fa-volume-up');
        $(ev.target).parent().removeClass('speechlocale-trigger');
      }

      Wrts.Speech.speak(this.getDecorator().getWordLocale().toLowerCase(),
                        this.getDecorator().getWord(),
                        1, ev);
    },

    submitFormByKey: function(ev){
      if (ev.keyCode === 49 || ev.keyCode === 50 || ev.keyCode === 51 || ev.keyCode === 52) {
        var input_pressed = ev.keyCode - 49
        var input_id = "answer_" + input_pressed.toString();
        document.getElementById(input_id).click();
      }
    },

    speakAnswer: function(ev){
      if (ev) {
        $(ev.target).removeClass('fa-volume-off').addClass('fa-volume-up');
        $(ev.target).parent().removeClass('speechlocale-answer-trigger');
      }
      Wrts.Speech.speak(this.getDecorator().getAnswerLocale().toLowerCase(),
                        this.getDecorator().getAnswer(),
                        1, ev);
    },

    autoSpeakAnswer: function(givenAnswerIsCorrect) {
      if (this.model.getConfiguration().exerciseType == "in_your_mind") {
        var answer = this.viewState.get('currentAttempt').get('answer').join(', ')
      } else {
        if (givenAnswerIsCorrect) {
          var answer = $('#answer').val();
        } else {
          var answer = this.getDecorator().getAnswer().split('/')[0];
        }
      }
      Wrts.Speech.speak(this.getDecorator().getAnswerLocale().toLowerCase(), answer, 1);
    },

    setActiveClass: function(){
      this.submitForm();
    },

    submitForm: function(){
      this.$('form').submit();
    },

    answerOptionChange: function(ev) {
      var answerOption = ev.currentTarget.value === 'true';
      this.viewState.set('answerOption', answerOption);
    },

    formSubmit: function() {
      if (this.isAnyLOCKED()) {
        return false;
      }
      setTimeout($.proxy(this.handleAnswer, this), 17);
      return false;
    },

    answerKeydown: function(ev) {
      if (ev.keyCode === 13) {
        if (this.model.getConfiguration().is_right_answer) {
          if ($('#right-answer-button').hasClass('enterable')) {
            setTimeout(function(){
              $('#right-answer-button').removeClass('enterable');
              $('#wrong-answer-button').click();
            }, 200);
          }
        }
      }
    },

    handleAnswer: function() {
      var currentAttempt = this.viewState.get('currentAttempt'),
          exerciseType   = this.model.getConfiguration().exerciseType,
          givenAnswer    = this.findGivenAnswer();

      currentAttempt.endDoing();
      this.viewState.set('givenAnswer', givenAnswer);

      if (this.isAnswerCorrect(givenAnswer)) {
        this.handleCorrectAnswer(givenAnswer);
      } else {
        if (this.model.getConfiguration().is_right_answer && exerciseType != 'in_your_mind') {
          this.viewState.set('viewType', viewTypes.LOCKEDWRONG);
          this.showIsRightAnswerButton();
        } else {
          this.handleWrongAnswer(givenAnswer);
        }
      }
    },

    findGivenAnswer: function() {
      if (this.model.getConfiguration().exerciseType === 'in_your_mind') {
        return this.viewState.get('answerOption');
      } else if (this.model.getConfiguration().exerciseType === 'multiple_choice') {
        var manualAnswer = this.$('form').find('input[type=radio]:checked').val();
        if (manualAnswer) {
          this.viewState.set('answerOption', manualAnswer);
          var answer = manualAnswer;
        }else{
          var answer = this.viewState.get('answerOption');
        }
        return answer;
      } else {
        return this.$answerInput.val().trim();
      }
    },

    countAsRightAnswer: function(){
      var currentAttempt = this.viewState.get('currentAttempt'),
          givenAnswer    = this.findGivenAnswer();

      currentAttempt.possibleAnswers.unshift(givenAnswer);
      this.handleAnswer();
    },

    countAsWrongAnswer: function() {
      var givenAnswer = this.findGivenAnswer();
      this.handleWrongAnswer(givenAnswer);
    },

    handleCorrectAnswer: function(givenAnswer){
      var currentAttempt = this.viewState.get('currentAttempt'),
          exerciseType = this.model.getConfiguration().exerciseType;

      currentAttempt.addRightAnswer(givenAnswer);
      currentAttempt.set({ correctAnswer: givenAnswer });
      this.viewState.set('viewType', viewTypes.LOCKEDCORRECT);

      this.handleSpeakAnswer(true);

      if(exerciseType == 'multiple_choice') {
        var selectedAnswer = this.$('form').find('input[value="'+givenAnswer+'"]')
        selectedAnswer.attr('checked','checked')
        selectedAnswer.closest('li').addClass('has-success')
      }
      if (this.model.getConfiguration().stop_timer === true && exerciseType != 'in_your_mind' ) {
        this.setManualNextAttempt(currentAttempt);
        this.showManualNextButton();
      } else { 
        this.autoUnlockWithAttempt(this.model.getNextAttempt(currentAttempt));
      }
    },

    handleWrongAnswer: function(givenAnswer){
      var currentAttempt = this.viewState.get('currentAttempt'),
          exerciseType = this.model.getConfiguration().exerciseType;

      currentAttempt.addWrongAnswer(givenAnswer);
      this.viewState.set('currentAttempt', currentAttempt, { silent: true });
      this.handleSpeakAnswer(false);

      if (this.model.getConfiguration().repeat === true) {
        this.viewState.set('viewType', viewTypes.LOCKEDWRONG);
        this.setBackAttemptInQueue(currentAttempt);
        if (this.model.getConfiguration().stop_timer === true && exerciseType != 'in_your_mind') {
          this.showManualNextButton();
        } else {
          this.animateToNextAttempt(this.viewState.get('currentAttempt'));
        }
      } else {
        this.viewState.set('viewType', viewTypes.LOCKEDWRONG);
        if (this.model.getConfiguration().stop_timer === true && exerciseType != 'in_your_mind') {
          this.setManualNextAttempt(currentAttempt);
          this.showManualNextButton();
        } else {
          this.animateToNextAttempt(this.model.getNextAttempt());
        }
      }
    },

    handleSpeakAnswer: function(givenAnswerIsCorrect){
      if(this.model.getConfiguration().auto_speak_answer === true){ 
        var exerciseType = this.model.getConfiguration().exerciseType;
        if (exerciseType != 'dictate') {
          this.autoSpeakAnswer(givenAnswerIsCorrect);
        }
      }
    },

    showToggles: function(){
      var state = this.viewState.get("showToggles");
      this.viewState.set("showToggles", !state);
      this.render();
    },

    manualAutoUnlockWithAttempt: function(){
      var currentAttempt = this.viewState.get('currentAttempt');

      if ($('#manual-next-button').is(":visible")) {
        if (currentAttempt == undefined) {
          this.viewState.set('currentAttempt', null)
        } else {
          this.autoUnlockWithAttempt(currentAttempt);
        }
      }
    },

    // Helpers
    // ====================================================
    setExerciseStarted: function() {
      this.model.set('started_at', (new Date()).getTime());
    },

    setExerciseFinished: function() {
      this.model.set('finished_at', (new Date()).getTime());
    },

    isExerciseComplete: function() {
      return _.isEmpty(this.viewState.get('currentAttempt'));
    },

    isAnswerCorrect: function(givenAnswer) {
      return this.model.getResult(givenAnswer, this.viewState.get('currentAttempt')).correct;
    },

    isAnyLOCKED: function() {
      var viewType = this.viewState.get('viewType');
      return (
        viewType === viewTypes.LOCKED ||
        viewType === viewTypes.LOCKEDCORRECT ||
        viewType === viewTypes.LOCKEDWRONG
      );
    },

    isDOING: function() { return this.viewState.get('viewType') === viewTypes.DOING; },
    isWRONG: function() { return (
      this.viewState.get('viewType') === viewTypes.WRONG ||
      this.viewState.get('viewType') === viewTypes.LOCKEDWRONG
      );
    },
    isCORRECT: function() { return (
      this.viewState.get('viewType') === viewTypes.CORRECT ||
      this.viewState.get('viewType') === viewTypes.LOCKEDCORRECT
      );
    },

    autoUnlockWithAttempt: function(nextAttempt) {
      if (this.model.getConfiguration().exerciseType !== 'in_your_mind' &&
          this.model.getConfiguration().exerciseType !== 'multiple_choice') {
        this.$answerInput.caretToEnd();
      }

      if (this.model.getConfiguration().auto_speak_answer === true) { 
        var timer = 2500
      } else {
        var timer = 100
      }

      var dfd = $.Deferred();
      dfd.done($.proxy(function(){
        this.clearFlashWordTimer();
        this.setNextAttempt(nextAttempt);

      }, this));

      setTimeout(dfd.resolve, timer);
      this.unlockDfd = dfd;
    },

    clearFlashWordTimer: function(){
      if (this.timer){
        clearTimeout(this.timer);
        this.timer = null;
      }
    },

    autoTimedOut: function() {
      var correctedTimeout = this.viewState.get('flashWordSpeed');

      this.timer = setTimeout(_.bind(function(){
        this.viewState.set('showTimed', true);  // Triggers render
      }, this), correctedTimeout);
    },

    setNextAttempt: function(nextAttempt) {
      this.model.get('checker').resetMessage();
      this.viewState.unset('givenAnswer');
      this.viewState.unset('answerOption');
      this.viewState.set({
        'currentAttempt': nextAttempt,
        'showToggles': false,
        'showTimed': false,
        'viewType': viewTypes.DOING
      });  // Triggers render
    },

    getViewTypesForTemplate: function() {
      var parsedViewTypes      = {},
          activeViewType = this.viewState.get('viewType');

      _(viewTypes).chain().keys().each(function(key){
        parsedViewTypes['is'+key] = key == activeViewType;
      });

      parsedViewTypes.isAnyLOCKED = this.isAnyLOCKED();

      return parsedViewTypes;
    },

    getTemplateData: function() {
      var data = this.getDecorator().getData({
        currentAttempt: this.viewState.get('currentAttempt'),
        viewTypes: this.getViewTypesForTemplate()
      });

      if(data.configuration.exerciseType == 'multiple_choice') {
        data.exerciseTypes.isMultipleChoice = true;
        data.multipleAnswers = data.currentAttempt.multipleAnswers
      } else {
        data.exerciseTypes.isMultipleChoice = false
      }
      data.attempts = this.model.get('attempts');
      return data;
    },

    focusOnAnswerInput: function() {
      var exerciseType = this.model.getConfiguration().exerciseType;
      if ( exerciseType === 'in_your_mind' ||
           (exerciseType === 'timed' && this.viewState.get('showTimed') === false)) {
        return;
      }
      this.$answerInput.focus();

      if (exerciseType === 'dictate' && this.viewState.get('viewType') !== "LOCKEDCORRECT") {
        this.speakWord();
      } else if (this.model.getConfiguration().auto_speak_question === true && this.viewState.get('viewType') === viewTypes.DOING) {
        this.speakWord();
      }
    },

    startAttempt: function() {
      var currentAttempt = this.viewState.get('currentAttempt');
      if (currentAttempt && !currentAttempt.isDoing()) {
        currentAttempt.startDoing();
      }
      // loads html in Firefox !!!
      this.render();
    },

    setManualNextAttempt: function(currentAttempt) {
      var idx = this.model.get('attempts').indexOf(currentAttempt);
      this.viewState.set('currentAttempt', this.model.get('attempts').at(idx + 1), { silent: true });
    },

    showManualNextButton: function() {
      $('#continue-button').hide();
      $('#manual-next-button').show(); 
    },

    showIsRightAnswerButton: function() {
      $('#wrong-answer-button').show(); 
      $('#continue-button').hide();
      $('#right-answer-button').addClass('enterable');
      $('#right-answer-button').show();
    },

    setBackAttemptInQueue: function(currentAttempt) {
      var idx = this.model.get('attempts').indexOf(currentAttempt);
      var attempt = this.viewState.get('currentAttempt');
      this.model.setAttemptForRequestioning(attempt);
      this.model.addAttemptForLongTermMemory(attempt);
      this.viewState.set('currentAttempt', this.model.get('attempts').at(idx), { silent: true }); 
    },

    // Render(ers)
    // ====================================================
    render: function() {
      // This triggers answerOptionChange
      this.$el.html(
        this.template(this.getTemplateData())
      );

      this.$answerInput = this.$('form input[name=answer]');

      // This triggers focusOnAnswerInput
      this.trigger('after_render');

      this.clearFlashWordTimer();
      this.autoTimedOut();
    },

    animateToNextAttempt: function(nextAttempt) {
      var dfd = $.Deferred(),
          exerciseType = this.model.getConfiguration().exerciseType,
          unlockTimeBarEl = $('<div class="unlock_time_bar" />');

      var timed_response = this.viewState.get('flashWordSpeed');

      if (exerciseType == "in_your_mind" || this.model.getConfiguration().is_right_answer) {
        var timed_response = 0;
      }

      dfd.done(_.bind(function(){
        this.setNextAttempt(nextAttempt);
      }, this));

      this.viewState.set('viewType', viewTypes.LOCKEDWRONG);
      this.$('.answer-inputs').after(unlockTimeBarEl);

      unlockTimeBarEl.animate(
        {width: '100%'}, timed_response, 'linear', dfd.resolve
      );

      this.unlockDfd = dfd;
    }
  });
})();
