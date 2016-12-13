Wrts.helpers.registerRouter('Results', {
  routes: {
    "results/:id":      {to: "show", as: "show_result" },
    "my_results":       {to: "my_results", as: "my_results" },
    "my_wrong_answers": {to: "my_wrong_answers", as: "my_wrong_answers" }
  },

  show: function(id){
    var result = Wrts.data.results.get(id);
    if (!result) {
      return this.navigate("/", {trigger: true, replace: true});
    }
    Wrts.app.setView(
      Wrts.views.Results.Show, {model: result}
    );
  },

  my_results: function(){
    Wrts.app.setView(
      Wrts.views.Results.MyResults, {}
    );
  },

  my_wrong_answers: function(){
    Wrts.app.setView(
      Wrts.views.Results.WrongAnswers, {}
    );
  }
});
