Wrts.models.Exercise = (function() {
  var model = Backbone.Model.extend({
    initialize: function(attributes, lists, configuration, qaSubjects, attempts) {
      if (configuration == undefined) {
        configuration = $.extend(
          Wrts.models.Exercise.defaultConfiguration,
          Wrts.data.user.getConfiguration(),
          configuration
        );
      }

      listTitles = lists.map(function(list) { return list.get('title')}).join(' , ');
      lists = _(lists);

      if (!_.isEmpty(qaSubjects)) {
        this.initializeByQaSubjects(lists, configuration, qaSubjects, listTitles);
      } else {
        this.initializeByAttempts({
          attributes: attributes,
          configuration: configuration,
          listTitles: listTitles,
          attempts: attempts
        });
      }

      if (configuration.exerciseType === 'puzzle') {
        this.generateShuffledAnswers();
      }
      if (configuration.exerciseType === 'multiple_choice') {
        var word_count_array = lists.map(function(l) { return l.get('word_count')  });
        var total_words = 0;
        for(var i in word_count_array) { total_words += word_count_array[i]; }

        if (total_words > 3) {
          this.generateRandomAnswers();
        } else {
          return alert('Je woordenlijst is te kort, voor een meerkeuze overhoring heb je minimaal 4 woordcombinaties nodig.')
        }
      }
      if (configuration.exerciseType === 'vowels') {
        this.generateAnswersWithVowelsOnly();
      }
    },

    initializeByAttempts: function (options) {
      var attributes = options.attributes,
          attempts = options.attempts,
          configuration = options.configuration,
          listTitles = options.listTitles;

      if (options.configuration.shuffle) {
        attempts = _(attempts).shuffle();
      }

      var attemptsCollection = new Wrts.collections.Attempts(attempts, { parse: true });
      this.set({
        attempts: attemptsCollection,
        checker: new Wrts.helpers.Checker(configuration),
        configuration: configuration,
        qaSubjects: null,
      }, {silent: true});
    },

    initializeByQaSubjects: function (lists, configuration, qaSubjects, listTitles) {
      var attempts = [],
          answers  = [],
          listIds  = [],
          listTitle,
          exerciseType,
          questionQaSubjects,
          isQuestionOnly;

      exerciseType = Wrts.data.exerciseTypes.get(configuration.exerciseType);

      questionQaSubjects = qaSubjects.filter(function(qaSubject, index) {
        if (qaSubject.get('qaType') == "mixed") {
          return true
        } else {
          return qaSubject.get('qaType') === 'question';
        }
      });

      answerQaSubjects = qaSubjects.filter(function(qaSubject, index) {
        if (qaSubject.get('qaType') == "mixed") {
          return true
        } else {
          return qaSubject.get('qaType') === 'answer';
        }
      });

      answerQaSubjects = _(answerQaSubjects).map(function(answerSubject, index) {
        return answerSubject.attributes.subject;
      });

      if (answerQaSubjects.length === 0) {
        isQuestionOnly = true;
      } else if (configuration.isQuestionOnly) {
        isQuestionOnly = (configuration.isQuestionOnly == "true");
      } else {
        isQuestionOnly = exerciseType.get('isQuestionOnly');
      }

      for (i = 0; i < questionQaSubjects.length; i++) { 
        var qQaSubject = questionQaSubjects[i];
        var list = (Wrts.data.lists.get(qQaSubject.get('listId')) !== undefined) ? Wrts.data.lists.get(qQaSubject.get('listId')) : Wrts.data.streamed_lists.get(qQaSubject.get('listId')),
            answerWordList,
            wordlist,
            answers;

        if (isQuestionOnly) {
          answerWordList = [list.getWordListByIndex(qQaSubject.get('index'))];
        } else {
          answerWordList = list.getWordlistsWithoutIndex(qQaSubject.get('index'));
          answerWordList = _(answerWordList).select(function(answerList) {
            return (answerQaSubjects.indexOf(answerList.subject) > -1)
          });
        }

        answerWordList[0].list_id = list.get('id');

        qaType = qQaSubject.get('qaType');
        questionWordList = list.getWordListByIndex(qQaSubject.get('index'));

        for (ii = 0; ii < answerWordList.length; ii++) { 
          _(questionWordList.words).each(function(word, index){
            var answer = answerWordList[ii].words[index]; 
            var answerSubject = (answerWordList.length > 0 ? answerWordList[ii].subject : "");
            var answerSpeechLocale = (answerWordList.length > 0 ? answerWordList[ii].speech_locale : "");

            var attempt = new Wrts.models.Attempt({
              list_id: answerWordList[0].list_id,
              subject: questionWordList.subject,
              word: word.word,
              wordSpeechLocale: questionWordList.speech_locale,
              answer: new Array(answer.word),
              answerSubject: answerSubject,
              index: index,
              answerSpeechLocale: answerSpeechLocale,
            });

            attempts.push(attempt);
          });
        }

        listIds.push(list.get("id"));
        listTitle = list.get("title");
      }

      // set possible answers per attempt
      var getPossibleAnswersForAttempt = function(attempt) {
        var possibleAnswers = _(attempts).select(function(pAttempt){
          return attempt.get("word").toLowerCase() === pAttempt.get("word").toLowerCase();
        });
        var newPossibleAnswers = _(possibleAnswers).chain().map(function(a){
          return a.getAnswer();
        }).flatten().value();

        var newPossibleAnswersLength = newPossibleAnswers.length;
        for (x = 0; x < newPossibleAnswersLength; x++) { 
          var someAnswer = newPossibleAnswers[x],
              regExp = /\(([^)]+)\)/;

          if (someAnswer && typeof(regExp.exec(someAnswer) != 'undefined')) {
            newPossibleAnswers.push(someAnswer.replace(/\([^\)]*\)/g, '').replace(/\s{2,}/g, ' ').trim())
          }
        }
        return newPossibleAnswers;
      };

      for (var i = 0, n = attempts.length; i < n; i++) {
        var possibleAnswers = getPossibleAnswersForAttempt(attempts[i]);
        var splittedAnswers = [];

        _(possibleAnswers).forEach(function(answer, index) {
          answer.split('/').forEach(function(aaa) {
            splittedAnswers.splice(index, 0, aaa.trim())
          });
        });

        var mergedPossibleAnswers = $.merge(possibleAnswers, splittedAnswers)
        attempts[i].setPossibleAnswers(mergedPossibleAnswers);
      }

      if (configuration.shuffle) {
        attempts = _(attempts).shuffle();
      }

      this.set({
        listTitles: listTitles,
        attempts: new Wrts.collections.Attempts(attempts),
        checker: new Wrts.helpers.Checker(configuration),
        qaSubjects: this.convertQaSubjectsForExercise(qaSubjects),
        configuration: configuration,
        title: listTitle
      }, {silent: true});
    },

    // because the data-structure is different in prepare (and init here) than
    // the running version, we convert it once just before start.
    convertQaSubjectsForExercise: function(qaSubjects){
      var result = {
        questions: {},
        answers: {}
      };

      qaSubjects.each( function(qa) {
        var res = {};
        res[qa.get('listId')] = qa.get('subject');
        if (qa.get('qaType') === "question"){
          _.extend(result.questions, res);
        } else {
          _.extend(result.answers, res);
        }
      });

      return result;
    },

    hasChecker: function() {
      return this.has('checker');
    },

    getResult: function(answer, attempt) {
      return this.get('checker').getResult(answer, attempt, this.get('configuration'));
    },

    getLastMessage: function() {
      var checker = this.get('checker');
      return checker.getLastMessage();
    },

    getLevel: function() {
      if (this.level) { return this.level; }
      return (this.level = 1);
    },

    raiseLevel: function() {
      this.level++;
    },

    resetChecker: function(){
      this.get('checker').resetMessage();
    },

    getNextAttempt: function(attempt) {
      var attempts = this.get("attempts");

      if ( this.get('configuration').repeat == true ) {
        var idx = attempts.indexOf(attempt);
        this.resetChecker();
        var next = attempts.at(idx + 1);
        if(next == undefined) {
          return null;
        } else {
          return next;
        }
      }

      if ( this.get('configuration').repeat === true ) {
        var attempt = attempts.firstByLevel(this.getLevel());
        if (attempt) {
          this.resetChecker();
          return attempt;
        } else {
          if (attempts.isAllCorrect()) {
            return null;
          } else {
            this.resetChecker();
            this.raiseLevel();
            return attempts.firstByLevel(this.getLevel());
          }
        }
      } else {
        if (attempts.isAllCorrect()) {
          return null;
        } else {
          this.resetChecker();
          return attempts.firstByLevel(1);
        }
      }
    },

    setAttemptForRequestioning: function(attempt) {
      if ( this.get('configuration').repeat == true ) {
        var attempts = this.get('attempts');
        var index = attempts.models.indexOf(attempt);
        var before = attempts.slice(0, index);
        var between = attempts.slice(index + 1, index + 3);
        var after = attempts.slice(index + 3);

        this.get('attempts').reset(before.concat(between).concat([attempt]).concat(after), {silent: true});
      }
    },

    addAttemptForLongTermMemory: function(attempt) {
      var word = attempt.get('word');

      if(this.longTermMemo === undefined) {
        this.longTermMemo = {};
      }
      if(this.longTermMemo[word]) {
        return;
      }
      this.longTermMemo[word] = true;

      var attempts = this.get('attempts');
      var index = attempts.models.indexOf(attempt);
      var todo = attempts.length - index;

      // Circumvent endless addition of long term memory attempts with todo
      if ( this.get('configuration').repeat == true && todo > 3 ) {

        var memoryAttempt = attempt.clone();
        memoryAttempt.setPossibleAnswers(attempt.getPossibleAnswers());
        memoryAttempt.set('wrongAnswers', []);
        memoryAttempt.set('rightAnswers', []);
        memoryAttempt.set('isCloned', true);

        attempts.push(memoryAttempt, {silent: true});
      }
    },

    generateShuffledAnswers: function() {
      var shuffle = function(answer) {
        var attemptsLeft = 5,
            shuffledAnswer = Wrts.helpers.shuffleCharacters(answer);

        while(shuffledAnswer === answer && attemptsLeft > 0) {
          shuffledAnswer = Wrts.helpers.shuffleCharacters(answer);
          attemptsLeft--;
        }

        return shuffledAnswer;
      };

      this.get('attempts').each(function(attempt) {
        var answerArray = attempt.get('answer'),
            shuffledAnswer = _.map(answerArray, shuffle).join(', ');

        attempt.set('shuffledAnswer', shuffledAnswer);
      });
    },

    generateAnswersWithVowelsOnly: function() {
      var show_vowels = function(answer) {
        newAnswer = Wrts.helpers.stripNonVowels(answer);
        return newAnswer;
      };

      this.get('attempts').each(function(attempt) {
        var answerArray = attempt.get('answer'),
            newAnswer = _.map(answerArray, show_vowels).join(', ');
        attempt.set('stripNonVowelsAnswer', newAnswer);
      }); 
    },

    generateRandomAnswers: function() {
      clonedAttempts = jQuery.extend({}, this.get('attempts').models);
      prevAttributes = this.previousAttributes()

      var randomAnswers = function(correctAnswer) {
        var randomAttempts  = null
        var multipleAnswers = null

        randomAttempts = _.without(clonedAttempts, correctAnswer);
        randomAttempts = _.shuffle(randomAttempts);

        multipleAnswers = randomAttempts.slice(0, 3);

        if (correctAnswer.possibleAnswers.length > 1) {
          correctAnswer.attributes.answer = new Array(_.shuffle(correctAnswer.attributes.answer[0].split('/'))[0].trim());
        }

        multipleAnswers.push( correctAnswer );
        multipleAnswers =  _.shuffle(multipleAnswers);

        return _.map(multipleAnswers, function(answer) {
          return answer.get('answer');
        });
      }

      this.get('attempts').each(function(attempt, index) {
        attempt.set({multipleAnswers: randomAnswers(attempt)})
        if (attempt.attributes.multipleAnswers.length < 4){
          oldAnswers = prevAttributes.attempts[index].multipleAnswers.slice(0, 4);
          correctAnswer = attempt.attributes.rightAnswers;
          if (correctAnswer.length > 1) {
            correctAnswer = new Array(_.shuffle(correctAnswer[0].split('/'))[0].trim());
          }
          newAnswers = $.merge(correctAnswer, oldAnswers);
          uniqueAnswers = newAnswers.filter(function(elem, index, self) {
            return index == self.indexOf(elem);
          }).slice(0, 4);
          uniqueAnswers =  _.shuffle(uniqueAnswers);
          attempt.set({multipleAnswers: uniqueAnswers});
        }
      });
    },

    getSuccessfulAttempts: function() {
      return this.get('attempts').filter(function(attempt){
        return attempt.isCorrect();
      });
    },

    getAnsweredAttempts: function() {
      return this.get('attempts').filter(function(attempt){
        return attempt.hasAnswer();
      });
    },

    getUnansweredAttempts: function() {
      return this.get('attempts').getUnansweredAttempts();
    },

    getWrongAnswersCount: function() {
      return this.get('attempts').getWrongAnswersCount();
    },

    getCorrectAnswersCount: function() {
      return this.get('attempts').getCorrectAnswersCount();
    },

    getTotalTime: function() {
      return this.get('attempts').getTotalTime();
    },

    getGrade: function() {
      var scores = [];

      this.get('attempts').each(function(attempt){
        if (attempt.hasAnswer()) { scores.push(attempt.getGrade()); }
      });

      if (scores.length === 0) { return 0; }

      var total = _(scores).reduce(function(memo, num) { return memo + num; }, 0);

      if (Wrts.data.user.configuration.standardization == "Makkelijk"){
        var manipulatedTotal = (total * 1.2),
            grade            = (manipulatedTotal / scores.length);

        return (grade > 100 ? 100 : grade);
      }

      return total / scores.length;
    },

    getPercentageDone: function(currentAttempt) {
      var totalCount = this.get('attempts').size(),
          correctAnsweredCount,
          unansweredCount;

      if (this.getConfiguration().repeat === true) {
        correctAnsweredCount = this.getCorrectAnswersCount();
        return (100/totalCount) * correctAnsweredCount;
      } else {
        unansweredCount = this.getUnansweredAttempts().length;
        if (currentAttempt !== null && currentAttempt.hasAnswer()) {
          unansweredCount += 1; // current attempt don't count as progress (unanswered)!
        }
        return 100 - ( (100/totalCount) * unansweredCount);
      }
    },

    getConfiguration: function(){
      return this.get("configuration");
    },

    isCompleted: function() {
      return typeof this.get("finished_at") !== "undefined";
    },

    toResult: function() {
      return new Wrts.models.Result({
        listTitles: this.get('listTitles'),
        grade: this.getGrade(),
        standardization: Wrts.data.user.configuration.standardization,
        attempts: this.get("attempts").toJSON(),
        configuration: this.get("configuration"),
        qaSubjects: this.get("qaSubjects"),
        started_at: this.get("started_at"),
        finished_at: this.get("finished_at"),
        wrong_answers_count: this.getWrongAnswersCount(),
        correct_answers_count: this.getCorrectAnswersCount(),
        totalTime: this.getTotalTime()
      });
    }
  });

  model.viewTypes = Wrts.helpers.createEnum(
    'LOCKED','DOING','CORRECT','LOCKEDCORRECT','WRONG','LOCKEDWRONG'
  );

  model.defaultConfiguration = {
    shuffle: true,
    capitals: false,
    punctuation: false,
    diacritics: true,
    repeat: true,
    grade: "dutch",
    flashWordSpeed: 2500,
    stop_timer: 0,
    is_right_answer: false,
    auto_speak_answer: false,
    auto_speak_question: false
  };

  return model;
})();
