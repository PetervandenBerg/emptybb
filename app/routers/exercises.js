Wrts.helpers.registerRouter('Exercises', {
  routes: {
    'exercises/retry_failed/:result_id': { to: 'retryFailed',         as: 'retry_failed_exercise' },
    'exercises/retry_results':           { to: 'retryResults',        as: 'retry_failed_results'  },
    'exercises/save_as_list/:result_id': { to: 'saveAsList',          as: 'save_as_list'          },
    'exercises/save_result/:result_id':  { to: 'saveResult',          as: 'save_result'           },
    'exercises/save_results_as_list':    { to: 'saveResultsAsList',   as: 'save_results_as_list'  },
    'exercises/retry/:result_id':        { to: 'retry',               as: 'retry_exercise'        },
    'exercises/prepare' :                { to: 'prepare',             as: 'prepare_exercise'      },
    'exercises/:list_id/prepare':        { to: 'prepare',             as: 'prepare_by_list'       },
    'exercises/prepare_by_lists/:ids':   { to: 'prepare_by_lists',    as: 'prepare_by_lists'      },
    'exercises/:id/run':                 { to: 'run',                 as: 'run'                   },
    'exercises/restart':                 { to: 'restart',             as: 'restart'               }
  },

  retry: function (result_id) {
    var result = Wrts.data.results.get(result_id),
        exercise = result.toExercise();

    Wrts.data.exercises.add(exercise);
    return this.navigate(
      '/exercises/'+exercise.cid+"/run", {trigger: true, replace: true}
    );
  },

  retryFailed: function(result_id) {
    var result = Wrts.data.results.get(result_id);
        oldConfig = result.getConfiguration();

    var exercise = result.toExercise({
      onlyFailedAttemps: true,
      configuration: oldConfig
    });

    if (exercise.getConfiguration().exerciseType == "multiple_choice") {
      exercise.generateRandomAnswers();
    }

    Wrts.data.exercises.add(exercise);
    return this.navigate(
      '/exercises/'+exercise.cid+"/run", {trigger: true, replace: true}
    );
  },

  retryResults: function() {
    var results = Wrts.data.results.models;
    for (i = 0; i < results.length; i++) { 
      result = results[i];
      if (i == 0) {
        exercise = result.toExercise({
          onlyFailedAttemps: true,
        }); 
      } else {
        var newExercise = result.toExercise({
          onlyFailedAttemps: true,
        }); 

        var newAttempts = newExercise.get('attempts').models;
        exercise.get('attempts').push(newAttempts);
      }
    }
    Wrts.data.exercises.add(exercise);
    return this.navigate(
      '/exercises/'+exercise.cid+"/run", {trigger: true, replace: true}
    );
  },

  restart: function(){
    var exercise = Wrts.data.exercises.last(),
        attempts = exercise.getAnsweredAttempts();

    _(attempts).each(function(attempt) {
      attempt.clearFromAnswers();
    });

    return this.navigate(
      '/exercises/'+exercise.cid+"/run", {trigger: true, replace: true}
    );
  },

  saveAsList: function(result_id) {
    var result = Wrts.data.results.get(result_id);
    var list = result.getLists();

    var new_list = new Wrts.models.List();
    var title = "Foute antwoorden " + Wrts.helpers.railsTimeNow();

    new_list.set('title', title);
    new_list.set('shared', false);

    var new_list_collection = result.getWrongAnswersList(list);
    new_list.setListCollection(new_list_collection);

    Wrts.app.setView(
      Wrts.views.Lists.Create, { model: new_list }
    );
  },

  saveResultsAsList: function() {
    var new_list = new Wrts.models.List();
    var title = "Foute antwoorden " + Wrts.helpers.railsTimeNow();
    new_list.set('title', title);
    new_list.set('shared', false);
    var new_list_collection = Wrts.data.results.getWrongAnswerLists();
    new_list.setListCollection(new_list_collection);
    Wrts.app.setView(
      Wrts.views.Lists.Create, { model: new_list }
    ); 
  },

  saveResult: function(result_id, lists) {
    if (lists) {
      var result  = Wrts.data.results.get(result_id),
          listIds = lists.split('&').filter(function(n){ return n != "" });
      $(listIds).each(function(i,id){ 
        result.set('list_id', id);
        result.save();
      });
    }
  },

  prepare: function(list_id) {
    var options = {},
        list = (Wrts.data.lists.get(list_id) !== undefined) ? Wrts.data.lists.get(list_id) : Wrts.data.streamed_lists.get(list_id);

    if (list_id) {
      options.listIds = [parseInt(list_id)];
    }
    if (list == undefined) {
      return this.fetch_streamed_lists(list_id, options);
    }
    Wrts.app.setView(Wrts.views.Exercises.Prepare, options);
  },

  fetch_streamed_lists: function(ids, options) {
    $.ajax({
      type: 'GET',
      url: '/streamed_lists',
      data: {
        ids: ids
      },
      dataType: 'JSON',
      success: function(data) {
        $(data).each(function(i, list){
          var list = new Wrts.models.List(data);
          list.attributes.hidden = true;
          list.hidden = true;
          list = list.parse(data);
          Wrts.data.streamed_lists.add(list);
        });
        Wrts.app.setView(Wrts.views.Exercises.Prepare, options);
      },
      error: function(data){
        console.log('kak')
      }
    });
  },

  prepare_by_lists: function(lists) {
    var options = {},
        list_ids = lists.split('&');

    if (lists) {
      options.listIds = list_ids;
    }

    var ids_to_fetch = list_ids.filter(function(list_id){
      var list = (Wrts.data.lists.get(list_id) !== undefined) ? Wrts.data.lists.get(list_id) : Wrts.data.streamed_lists.get(list_id);
      return (list == undefined);
    });

    if (ids_to_fetch) {
      return this.fetch_streamed_lists(ids_to_fetch, options);
    }

    Wrts.app.setView(Wrts.views.Exercises.Prepare, options);
  },

  run: function(id){
    var exercise = Wrts.data.exercises.get(id);
    if (!exercise) {
      return this.navigate("/", {trigger: true, replace: true});
    }

    Wrts.app.setView(
      Wrts.views.Exercises.Run, {model: exercise}
    );
  },

  show: function(id){
    var exercise = Wrts.data.exercises.get(id);

    Wrts.app.setView(
      Wrts.views.Exercises.Show, {model: exercise}
    );
  },

});
