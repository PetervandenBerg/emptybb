Wrts.decorators.Results.WrongAnswers = Wrts.BaseDecorator.extend({
  getData: function() {
    var uniqSubjects = Wrts.data.lists.getUniqSubjects(),
        streamed_lists = Wrts.data.streamed_lists,
        activeSubject = Wrts.data.lists.getActiveSubject(),
        subjects = [],
        results = this.getResults(),
        buckets = this.getBuckets();

    for (var i = 0, n = uniqSubjects.length; i < n; i++) {
      subjects.push({
        subject: uniqSubjects[i],
        active: activeSubject === uniqSubjects[i]
      });
    }

    var wrongAnswers = Wrts.data.results.getWrongAnswers();

    if (wrongAnswers.length > 0) {
      var headers = [Array(wrongAnswers[0][0].get('subject')), Array(wrongAnswers[0][0].get('answerSubject')), ["Fouten"], ["Aantal keer fout"]];
      var rows = wrongAnswers.map(function(wrongAnswer) {
        var question          = wrongAnswer[0].get('word'),
            answer            = wrongAnswer[0].get('answer').join(', '),
            wrongAnswers      = _.uniq(wrongAnswer.map(function(wa) { return wa.get('wrongAnswers').join(', ') })).join(', '),
            timesWrongArray   = wrongAnswer.map(function(answer) { return answer.get('wrongAnswers').length }),
            timesWrong        = 0;

        for (var i = timesWrongArray.length; !!i--;){
          timesWrong += timesWrongArray[i];
        }

        return {question: question, answer: answer, wrongAnswers: wrongAnswers, timesWrong: timesWrong};
      });

      var totalWrongAnswerLength  = wrongAnswers.length,
          totalRightAnswerLength  = this.sum(Wrts.data.results.map(function(result) { return result.attempts.length }));

    }

    return _.extend({
      subjects: subjects,
      buckets: buckets,
      results: this.sortByDate(results),
      currentWeekNumber: this.findCurrentWeekNumber(),
      isMobileDevice: (screen.width <= 640),
      resultsPresent: results.length > 0,
      account: Wrts.data.user.attributes,
      resultLength: results.length,
      headers: headers,
      totalWrongAnswerLength: totalWrongAnswerLength,
      totalRightAnswerLength: totalRightAnswerLength,
      listNames: this.getListNames(),
      listTotals: this.getListTotals(),
      humanizedDuration: this.getHumanizedDuration(),
      rows: rows,
      isMyWrongAnswersPage: true,
      bucketsClosed: this.readFromPopstate("buckets"),
      restriction: Wrts.data.restriction.attributes,
      streamedLists: streamed_lists,
      anyStreamedLists: streamed_lists.length > 0,
      reachedListLimit: this.reachedListLimit(),
      reachedBucketLimit: this.reachedBucketLimit(),
      subjectsClosed: this.readFromPopstate("subjects"),
    });
  },

  sum: function(arr) {
    var sum = 0;
    for (var i = arr.length; !!i--;){
      sum += arr[i];
    }
    return sum;
  },

  getListNames: function () {
    if (Wrts.data.results.length > 0) {
      var mappedListTitles = Wrts.data.results.map(function(result) { return result.get('list_title') }),
          uniqListTitles   = _.uniq(mappedListTitles);
      return uniqListTitles.join(', ')
    }
  },

  getListTotals: function (){
    if (Wrts.data.results.length > 0) {
      var mappedResultListIds = Wrts.data.results.map(function(result) { return result.get('list_id') }),
          uniqListIds   = _.uniq(mappedResultListIds);
      return uniqListIds.length;
    }
  },

  getHumanizedDuration: function () {
    if (Wrts.data.results.length > 0) {
      var mappedResultDuration = Wrts.data.results.map(function(result) { return result.getTotalAttemptDuration() }),
          totalResultDuration  = this.sum(mappedResultDuration);
      return Wrts.helpers.humanizeDuration(totalResultDuration);
    }
  },

  reachedListLimit: function() {
    var account = Wrts.data.user.attributes,
        maxLists = account.max_allowed_lists,
        listLength = Wrts.data.lists.length,
        streamedListlength = Wrts.data.streamed_lists.length;

    var user_list_length = listLength + streamedListlength;
    return user_list_length >= maxLists;
  },

  reachedBucketLimit: function() {
    var account = Wrts.data.user.attributes,
        maxBuckets = account.max_allowed_buckets,
        user_bucket_length = Wrts.data.buckets.length;

    return user_bucket_length >= maxBuckets;
  },

  readFromPopstate: function(type) {
    return (localStorage.getItem(type) === "hide");
  },

  getBuckets: function() {
    return Wrts.data.buckets.models.map(function(bucket) {
      return bucket.toJSON();
    });
  },

  getResults: function() {
    return Wrts.data.results.toJSON();
  },

  sortByDate: function(results) {
    sorted_results = _.sortBy(results, function(model){
      return model.created_at;
    });
    return sorted_results.reverse();
  },

  findCurrentWeekNumber: function() {
    Date.prototype.getWeek = function() {
      var onejan = new Date(this.getFullYear(),0,1);
      var today = new Date(this.getFullYear(),this.getMonth(),this.getDate());
      var dayOfYear = ((today - onejan +1)/86400000);
      return Math.ceil(dayOfYear/7)
    };
    var today = new Date();
    return today.getWeek();
  },

});
