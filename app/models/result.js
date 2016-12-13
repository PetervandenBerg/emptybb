Wrts.models.Result = Backbone.Model.extend({

  initialize: function(){
    this.attempts = new Wrts.collections.Attempts(this.get("attempts"));
  },

  toExercise: function(options) {
    options = options || {};
    var configuration = (options.configuration ? options.configuration : this.getConfiguration())
    return new Wrts.models.Exercise(
      this.attributes,
      this.getLists(),
      configuration,
      undefined,
      this.getAttempts(options)
    );
  },

  getAttempts: function(options) {
    var attempts = this.getNonClonedAttempts();

    return _(attempts).reduce(function (memo, attempt) {
      if (options.onlyFailedAttemps && _.size(attempt.wrongAnswers) === 0) {
        return memo;
      }

      memo.push(
        _(attempt).omit('correctAnswer', 'wrongAnswers', 'duration')
      );
      return memo;
    }, []);
  },

  getNonClonedAttempts: function(){
    return this.get('attempts').filter(function(attempt) {
      return (attempt.isCloned !== 1)
    })
  },

  getLists: function(){
    var listIdArray = this.get('attempts').map(function(attempt){ return attempt.list_id  });
    var uniqListIDs = _.uniq(listIdArray);

    return Wrts.data.lists.findByIds(this.get(uniqListIDs));
  },

  getConfiguration: function() {
    return this.get("configuration");
  },

  getCorrectAnswersCount: function(){
    return this.get('correct_answers_count');
  },

  getWrongAnswersCount: function() {
    return this.get('wrong_answers_count');
  },

  getSubjectOrder: function() {
    var map = this.attempts.reduce(function(memo, attempt) {
      memo.subjects.push(attempt.get('subject'));
      memo.answers.push(attempt.get('answerSubject'));
      return memo;
    }, {
      subjects: [],
      answers: []
    });

    return [
      _(map.subjects).uniq().join(' - '),
      _(map.answers).uniq().join(' - ')
    ].join(' - ');
  },

  getWrongAnswerAttempts: function(){
    var failedAttempts = _(this.attempts.models).select(function(attempt){
      if (attempt.attributes.wrongAnswers) {
        return (attempt.attributes.wrongAnswers.length > 0);
      }
    });
    return failedAttempts;
  },

  getWrongAnswersList: function(old_list) {
    var questionList = [{'subject' : '', 'speech_locale' : '', 'words' : [] }],
        answerList   = [{'subject' : '', 'speech_locale' : '', 'words' : [] }],
        newLists     = [];

    var failedAttempts = _(this.attempts.models).select(function(attempt){
      if (attempt.attributes.wrongAnswers) {
      return (attempt.attributes.wrongAnswers.length > 0);
      } else { 
        false
      }
    });

    for (i = 0; i < failedAttempts.length; i++) {
      var attempt  = failedAttempts[i],
          question = attempt.get('word'),
          answer   = attempt.get('possibleAnswers').filter(this.onlyUnique);

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

  getTotalAttemptDuration: function () {
    return (this.get('finished_at') - this.get('started_at'))
  },

  onlyUnique: function(value, index, self) { 
    return self.indexOf(value) === index;
  },

  parse: function(json) {
    if (json.started_at) {
      json.started_at = Wrts.helpers.fromRailsTime(json.started_at);
    }
    if (json.finished_at) {
      json.finished_at = Wrts.helpers.fromRailsTime(json.finished_at);
    }
    return json;
  },

  toJSON: function() {
    var json = Backbone.Model.prototype.toJSON.call(this);
    return _.extend(json, {
      started_at: Wrts.helpers.toRailsTime(json.started_at),
      finished_at: Wrts.helpers.toRailsTime(json.finished_at)
    });
  },

  url: function(){
    new_or_edit = (this.isNew());
    return 'results' + (new_or_edit ? '' : '/' + this.id);
  },
});
