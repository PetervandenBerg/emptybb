Wrts.helpers.registerRouter('Teachers', {
  routes: {
    'teachers/create' : { to: 'create',  as: 'new_teacher' },
    'teachers/:id'    : { to: 'show',    as: 'show' },
  },

  create: function() {
    var teacher = new Wrts.models.Teacher();

    Wrts.app.setView(
      Wrts.views.Teachers.Create, { model: teacher }
    );
  },

  show: function(id) {
    if (id && id != undefined) {
      this.fetch_teacher(id, function(teacher) {
        Wrts.app.setView(
          Wrts.views.Teachers.Show, { model: teacher }
        );
      });
    } else {
      Wrts.app.getRouter().navigate(new_teacher_url, {trigger: true});
    }
  },

  fetch_teacher: function(id, callback, error) {
    $.get('/teachers/'+ id + '.json').done(function(data) {
      var teacher = new Wrts.models.Teacher();
      callback(teacher);
    }).fail(function(err) {
      this.teacher_not_found(err);
    });
  },

  teacher_not_found: function(err) {
    alert('Geen docent gevonden, probeer opnieuw.');
  }
});
