Wrts.collections.QaSubjects = Backbone.Collection.extend({
  getQuestionQaTypes: function() {
    return this.filter(function(qaSubject) {
      return qaSubject.get('qaType') === 'question';
    });
  }
});
