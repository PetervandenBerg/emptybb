Wrts.models.Attempt = Backbone.Model.extend({
  defaults: function() {
    return {
      word: "",
      answer: [],
      subject: null,
      duration: 0,
      wrongAnswers: [],
      rightAnswers: [],
      index: 0,
      correctAnswer: null
    };
  },

  initialize: function(){
    this.possibleAnswers = this.possibleAnswers || [];
    this.startTime = null;
    this.endTime   = null;
  },

  // TODO: tree, oak  moet ook machten met  oak, tree
  matches: function(attempt) {
    return (
      attempt !== null &&
      this.get("subject") === attempt.get("subject") &&
      $.trim(this.get("word").toLowerCase()) === $.trim(attempt.get("word").toLowerCase())
    );
  },

  addWrongAnswer: function(answer) {
    var wrongAnswers = this.get('wrongAnswers');
    wrongAnswers.push(answer);
    this.set({ wrongAnswers: wrongAnswers }, { silent: true });
  },

  addRightAnswer: function(answer) {
    var rightAnswers = this.get('rightAnswers');
    if (rightAnswers == undefined) {
      rightAnswers = [];
    }
    rightAnswers.push(answer);
    this.set({ rightAnswers: rightAnswers }, { silent: true });
  },

  isCorrect: function() {
    return this.get('correctAnswer') !== null;
  },

  hasAnswer: function() {
    return this.isCorrect() || this.get('wrongAnswers').length !== 0;
  },

  startDoing: function() {
    this.startTime = (new Date()).getTime();
  },

  endDoing: function() {
    this.endTime = (new Date()).getTime();

    var duration = this.get("duration");
    this.set("duration", (this.endTime - this.startTime));

    this.startTime = null;
    this.endTime   = null;
  },

  isDoing: function() {
    return this.startTime !== null && this.endTime === null;
  },

  getGrade: function() {
    if (!this.hasAnswer()) { return -1; }
    if (!this.isCorrect()) { return 0; }

    return (1 / (1 + this.getWrongAnswersCount())) * 100;
  },

  getWrongAnswersCount: function() {
    if (this.getWrongAnswers() === null) {
      return 0;
    } else {
      return this.getWrongAnswers().length;
    }
  },

  getRightAnswersCount: function() {
    if (this.getRightAnswers() === null) {
      return 0;
    } else {
      return this.getRightAnswers().length;
    }
  },

  getWrongAnswers: function() {
    return this.get("wrongAnswers");
  },

  getRightAnswers: function() {
    return this.get("rightAnswers");
  },

  getAnswer: function() {
    return this.get("answer");
  },

  setPossibleAnswers: function(possibleAnswers) {
    this.possibleAnswers = possibleAnswers;
  },

  getPossibleAnswers: function() {
    return this.possibleAnswers;
  },

  clearFromAnswers: function() {
    this.attributes.rightAnswers = [];
    this.attributes.wrongAnswers = [];
    this.attributes.duration = 0;
    this.attributes.correctAnswer = null;
  },

  parse: function(json) {
    if (json.possibleAnswers) {
      this.setPossibleAnswers(json.possibleAnswers);
      json = _(json).omit('possibleAnswers');
    }
    return json;
  },

  toJSON: function() {
    var json = Backbone.Model.prototype.toJSON.call(this);
    return _.extend(json, {
      possibleAnswers: this.possibleAnswers
    });
  }

});
