Wrts.views.Teachers.Create = Wrts.views.Teachers._FormActions.extend({
  templateName: 'teachers/create',
  decorator: Wrts.decorators.Teachers.Create,

  events: _.extend(Wrts.views.Teachers._FormActions.prototype.events, {
    'change .select.country'                            : 'showFollowUpFields',
    'change #user_school_association_type'              : 'showRightSchoolSpecs',
    'change .school_association_specification'          : 'showSchoolPlaces',
    'change .print_subject input'                       : 'checkIfLast'
  }),

  init: function(){
    this.cloneModel();

    this.viewState = new Backbone.ViewState();
    this.listenTo(this.clone,     'add',                       this.render);
    this.listenTo(this.viewState, 'change:locked',             this.updateComponents);
    this.listenTo(this.viewState, 'change:validationMessages', this.updateComponents);
    this.listenTo(this.model,     'error',                     this.handleError);
    this.listenTo(this.model,     'sync',                      this.afterSync);
    view = this;

    $.when(Wrts.data.school_association.fetch(), Wrts.data.school_place.fetch())
      .done(function() {
        view.render();
      })
      .fail(function() {
        Wrts.helpers.throwError("Not implemented yet");
      });
  },

  afterSync: function () {
  },

  showFollowUpFields: function (ev) {
    $('.form-group.school-association').show()
  },

  showRightSchoolSpecs: function (ev) {
    var value = $(ev.target).val();
    $('.school_association_specification option').hide();
    $('.form-group.education_level').show();

    if (value === "Basisschool (Groep 1 t/m 9)") {
      $('.school_association_specification option.specify').show();
      $('.school_association_specification option.basis').show();
    } else if (value === "Voortgezet onderwijs (VMBO/HAVO/VWO)") {
      $('.school_association_specification option.specify').show();
      $('.school_association_specification option.voorgezet').show();
    } else if (value === "Middelbaar- en hoger onderwijs (MBO/HBO/WO)") {
      $('.school_association_specification option.specify').show();
      $('.school_association_specification option.hoger').show();
    } else {
      $('.school_association_specification option.specify').show();
      $('.school_association_specification option.other').show();
    }
    return false;
  },

  showSchoolPlaces: function (ev) {
    $('.form-group.school_place').show();
  },

});
