(function() {
  'use strict';
  var viewTypes = Wrts.models.Exercise.viewTypes;
  var progressTemplate = Handlebars.partials['exercises/_progress'];

  Wrts.views.Exercises.Run = Wrts.BaseView.extend({
    templateName: 'exercises/run',
    decorator: Wrts.decorators.Exercises.Run,

    init: function() {
      this.viewState = new Backbone.ViewState({
        viewType: viewTypes.LOCKED,
        currentAttempt: null,
        showToggles: false,
        showTimed: false,
        flashWordSpeed: this.getflashWordSpeed(),
      });

      this.render();

      this.listenTo(this.viewState, 'change:viewType', this.viewTypeChange);
      this.listenTo(this.viewState, 'change:currentAttempt', this.handleNextAttempt);

      this.setExerciseStarted();

      this.viewState.set('currentAttempt', this.model.getNextAttempt());
      this.viewState.set('viewType', viewTypes.DOING);
    },


    // Event functions
    // ====================================================
    getflashWordSpeed: function() {
      if (this.model.getConfiguration().flash_word_speed) {
        return parseInt(this.model.getConfiguration().flash_word_speed);
      } else {
        return this.model.getConfiguration().flashWordSpeed;
      }
    },

    getSelectedAnswerOptionFromDOM: function() {
      var $selectedInput = this.$('input[name=answer_option]:checked');
      if ($selectedInput.length !== 1) {
        return undefined;
      }
      return $selectedInput.val() === 'true';
    },

    navigateToResult: function(result) {
      this.navigate('results/' + (result.id || result.cid), {trigger: true, replace: true});
    },

    viewTypeChange: function() {
      this.startAttempt();
      this.updateComponents();
    },

    showToggles: function(){
      var state = this.viewState.get("showToggles");
      this.viewState.set("showToggles", !state);
      this.render();
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

    removeClonedAttempts: function() {
      var clearedAttempts = this.model.get('attempts').filter(function(attempt) {
        return (attempt.attributes.isCloned !== true)
      })
      this.model.attributes.attempts.models = clearedAttempts;
      this.model.attributes.attempts.length = clearedAttempts.length;
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

    getViewTypesForTemplate: function() {
      var parsedViewTypes      = {},
          activeViewType = this.viewState.get('viewType');

      _(viewTypes).chain().keys().each(function(key){
        parsedViewTypes['is' + key] = key == activeViewType;
      });
      parsedViewTypes.isAnyLOCKED = this.isAnyLOCKED();

      return parsedViewTypes;
    },

    getTemplateData: function() {
      var viewTypes = this.getViewTypesForTemplate();
      return this.getDecorator().getData({
        currentAttempt: this.viewState.get('currentAttempt'),
        viewTypes: viewTypes
      });
    },

    focusOnAnswerInput: function() {
      var exerciseType = this.model.getConfiguration().exerciseType;
      if ( exerciseType === 'in_your_mind' ||
           (exerciseType === 'timed' && this.viewState.get('showTimed') === false)) {
        return;
      }
      this.$answerInput.focus();
    },

    startAttempt: function() {
      var currentAttempt = this.viewState.get('currentAttempt');
      if (currentAttempt && !currentAttempt.isDoing()) {
        currentAttempt.startDoing();
      }
    },

    remove: function() {
      if (this.childView) {
        this.childView.remove();
      }
      return Backbone.View.prototype.remove.call(this);
    },


    // Render(ers)
    // ====================================================
    updateComponents: function() {
      var data = this.getTemplateData();
      this.$progress.html(progressTemplate(data));
    },

    handleNextAttempt: function(ev, change) {
      if (this.isExerciseComplete()) {
        this.removeClonedAttempts();
        this.setExerciseFinished();
        var result = this.model.toResult();
        Wrts.data.results.add(result);
        result.save();
        this.navigateToResult(result);
      }

      var $el = this.$card;

      $el.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (e) {
        $el.removeClass('animated fadeInRight');
        $el[0].style.webkitAnimationName = "";
        $el[0].style.animationName = "";
      });

      $el.addClass('animated fadeInRight');
    },

    render: function() {
      this.$el.html(
        this.template(this.getTemplateData())
      );

      this.$card = this.$('.js_run_child_view');
      this.$progress = this.$('.js_progress');

      this.childView = new Wrts.views.Exercises.RunChild({
        viewState: this.viewState,
        model: this.model,
        el: this.$card
      });

      this.updateComponents();

      return this;
    }
  });
})();
