(function(){
  'use strict';

  Wrts.views.Exercises.Prepare = Wrts.BaseView.extend({
    templateName: 'exercises/prepare',
    decorator: Wrts.decorators.Exercises.Prepare,

    init: function(options) {
      if (!options) { options = {}; }

      var scrollAfterRender = false,
          configuration     = {},
          listIds           = [];

      this.qaSubjects = new Wrts.collections.QaSubjects();

      if (_.isArray(options.listIds)) {
        listIds = options.listIds;
        scrollAfterRender = true;
      }

      configuration = _.extend(
        configuration,
        Wrts.data.user.getConfiguration(),
        options.configuration
      );

      // set defaults for viewState
      this.viewState = new Backbone.ViewState({
        'showSelectList': listIds.length === 0,
        'configuration':  configuration,
        'exerciseTypeKey': 'full_word'
      });

      // init qaSubjects
      if (listIds.length > 0) {
        _(listIds).each(_.bind(this.addListId, this));
      }

      // bind events
      this.listenTo(this.viewState, 'change',   this.render);
      this.listenTo(Wrts.data.exercises, 'add', this.goToRun);
      this.listenTo(this.qaSubjects, 'add remove changed:all', this.render);

      this.render();

      if (scrollAfterRender) {
        this.scrollAfterRender();
      }
    },

    events: {
      'change .js-lists input'            : 'listInputChange',
      'change .js-qa-subjects input'      : 'qaSubjectInputChange',
      'change .js-configuration input'    : 'configurationInputChange',
      'change .js-configuration select'   : 'configurationSelectChange',
      'change .js-exercise_types input'   : 'exerciseTypeInputChange',
      'click .disabled-trigger'           : 'showPremiumModal',
      'change .stop_timer'                : 'toggleStopTimer',
      'click .subscr-collection .type'    : 'toggleSelected',
      'change .is_right_answer'           : 'toggleIsRightAnswer',
      'click .js_select_list_toggle'      : 'selectListToggleClick',
      'click .is-question-only'           : 'setIsQuestionOnly',
      'submit form'                       : 'submitForm',
      'click .remove-list-link'           : 'removeListFromExercise'
    },

    // Event Callbacks
    // ===============================================
    toggleStopTimer: function(ev) {
      if ($(ev.target).is(":checked")) {
        $('.flash-word-speed').hide();
        $('.is_right_answer').closest('.checkbox').hide();
      } else {
        $('.flash-word-speed').show();
        $('.is_right_answer').closest('.checkbox').show();
      }
    },

    toggleIsRightAnswer: function(ev) {
      if ($(ev.target).is(":checked")) {
        $('.stop_timer').closest('.checkbox').hide();
        $('.flash-word-speed').hide();
      } else {
        $('.stop_timer').closest('.checkbox').show();
        $('.flash-word-speed').show();
      }
    },

    showPremiumModal: function(ev) {
      if ($(ev.target).hasClass('max-lists')) {
        $('.max-list-modal').click();
      } else {
        $('.premium-modal').click();
      }
      return false;
    },

    listInputChange: function(ev) {
      var $input = $(ev.currentTarget),
          listId = Number($input.val());

      if (this.qaSubjects.any(R.eqProp('listId', listId))) {
        this.removeListId(listId);
      } else {
        this.addListId(listId);
      }
    },

    qaSubjectInputChange: function(ev) {
      var $input = $(ev.currentTarget),
          id     = $input.data('id'),
          value  = $input.val();

      if (ev.target.value == "mixed") {
        this.qaMixSubjects(ev);
      }
      this.setQaTypeById(id, value, ev);
    },

    qaMixSubjects: function(ev) {
      var qaSubjectInputs = $(ev.target).closest('.js-qa-subjects').first().find('.checkbox.subject input');
      $(qaSubjectInputs).each(function() {
        $(this).attr('checked', false);
      });
    },

    configurationInputChange: function(ev) {
      var inputEl         = $(ev.currentTarget),
          key             = inputEl.attr('name'),
          value           = inputEl.is(':checked'),
          mixedCheckboxes = $('.mixed-checkbox:checked'),
          configuration   = {};

      if (Wrts.data.restriction.get(key) == false) {
        value = false;
      }

      configuration[key] = value;

      this.viewState.set('configuration', _.extend(
        this.viewState.get('configuration'),
        configuration
      ));

      if (mixedCheckboxes.length > 0) {
        $(mixedCheckboxes).each(function() {
          var dataId = $(this).data('id');
          $(".mixed-checkbox[data-id='" + dataId + "']").click();
        });
      }
      this.updateConfigurationBasedOnPreselected();
    },

    configurationSelectChange: function(ev) {
      var inputEl         = $(ev.currentTarget),
          key             = inputEl.attr('name'),
          value           = inputEl.find('option:selected').val(),
          configuration   = {};

      configuration[key] = value;

      this.viewState.set('configuration', _.extend(
        this.viewState.get('configuration'),
        configuration
      ));
    },

    exerciseTypeInputChange: function(ev) {
      var inputEl = $(ev.currentTarget),
          value   = inputEl.val();
      this.viewState.set("exerciseTypeKey", value);
    },

    removeListFromExercise: function(ev) {
      this.removeListId(ev.target.dataset.id);
      return false;
    },

    selectListToggleClick: function(ev) {
      ev.preventDefault();
      this.viewState.set("showSelectList", !this.viewState.get("showSelectList"));
      this.render();
    },

    submitForm: function(ev) {
      ev.preventDefault();

      var listIds = this.getListIds(),
          lists = Wrts.data.lists.findByIds(listIds);

      if (lists.length === 0) {
        lists = Wrts.data.streamed_lists.findByIds(listIds);
      }

      if (lists.length < 1) {
        Wrts.helpers.throwError("Can not prepare exercise without lists");
        return false;
      }

      var configuration = _.extend(this.viewState.get("configuration"), {
        exerciseType: this.viewState.get("exerciseTypeKey")
      });

      if (Wrts.data.restriction.get(configuration.exerciseType)) {
        var exercise = new Wrts.models.Exercise({}, lists, configuration, this.qaSubjects );
        Wrts.data.exercises.add(exercise);
      }
      return false;
    },

    setIsQuestionOnly: function(ev) {
      var configuration = _.extend(this.viewState.get("configuration"), {
        isQuestionOnly: ev.target.value
      });
      this.render();
    },

    // Other functions
    // ===============================================
    addListId: function(listId) {
      var list = (Wrts.data.lists.get(listId) !== undefined) ? Wrts.data.lists.get(listId) : Wrts.data.streamed_lists.get(listId),
          subjectIndexMapping = list.getSubjectsIndexMap(),
          qaSubjects = this.qaSubjects;

      // the index is essential because subjects are not unique
      _(subjectIndexMapping).each(function(mapping, index) {
        var subject = (mapping.subject != null ? mapping.subject.toLowerCase() : "");
        qaSubjects.add(
          new Backbone.Model({
            id:      [listId, encodeURIComponent(subject), mapping.index].join('_'),
            listId:  listId,
            subject: mapping.subject,
            index:   mapping.index,
            qaType:  index === 0 ? 'question' : 'answer'
          })
        );
      });
    },

    removeListId: function(listId) {
      var qaSubjects = this.qaSubjects;

      qaSubjects.chain()
        .filter(function(qaS) {
          return qaS.get('listId') === String(listId);
        }).each(function(qaS) {
          qaSubjects.remove(qaS.id, { silent: true });
        });

      if (qaSubjects.size() > 0 && qaSubjects.getQuestionQaTypes().length === 0) {
        qaSubjects.first().set('qaType', 'question', { silent: true });
      }

      this.qaSubjects.trigger('changed:all');
    },

    setQaTypeById: function(id, value) {
      // set the result
      var result = this.qaSubjects.get(id),
          listId = result.get('listId'),
          oppositeValue;

      result.set('qaType', value, { silent: true });
      oppositeValue = (value == "mixed" ? value : this.getOppositeTypeOfQA(value))

      this.qaSubjects
        .chain()
        .filter(R.eqProp('listId', listId))
        .reject(result)
        .each(function(qaSubject) {
          qaSubject.set('qaType', oppositeValue, { silent: true });
        });

      if (value != "mixed") {
        this.qaSubjects.trigger('changed:all');
      }
    },

    getOppositeTypeOfQA: function(qaType) {
      return qaType === "answer" ? "question" : "answer";
    },

    getListIds: function() {
      return this.qaSubjects.map(R.prop('listId'));
    },

    getTemplateData: function() {
      return this.getDecorator().getData(this.qaSubjects);
    },

    render: function() {
      this.$el.html(
        this.template(this.getTemplateData())
      );

      return this;
    },

    goToRun: function(exercise) {
      this.navigate('/exercises/' + (exercise.id || exercise.cid) +'/run', {trigger: true, replace: true});
    },

    scrollAfterRender: function() {
      setTimeout($.proxy(function() {
        var windowHeight = $(window).height();
        var fromTop = this.$("a[name='scrollposition_exercise']").position().top - windowHeight + 120;
        $('html, body').animate({scrollTop: fromTop}, 100);
        this.updateConfigurationBasedOnPreselected();
      }, this), 500);
    },

    updateConfigurationBasedOnPreselected: function() {
      if ($('.stop_timer').exists()) {
        if ($('.stop_timer').is(":checked")) {
          $('.flash-word-speed').hide();
          $('.is_right_answer').closest('.checkbox').hide();
        } else {
          $('.flash-word-speed').show();
          $('.is_right_answer').closest('.checkbox').show();
        }
      }

      if ($('.is_right_answer').exists()) {
        if ($('.is_right_answer').is(":checked")) {
          $('.flash-word-speed').hide();
          $('.stop_timer').closest('.checkbox').hide();
        } else {
          $('.stop_timer').closest('.checkbox').show();
          $('.flash-word-speed').show();
        }
      }
    },

  });
})();
