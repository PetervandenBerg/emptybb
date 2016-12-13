Wrts.views.Results.MyResults = Wrts.BaseView.extend({
  templateName: 'results/my_results',
  decorator: Wrts.decorators.Results.MyResults,

  init: function(options){
    this.render();
    pageModel = this;
    _.defer(function(){ 
      $('[data-toggle="tooltip"]').tooltip(); 
      if ($('.week-number').val() == pageModel.findCurrentWeekNumber()){
        $('.weekly-button.next').hide();
        $('.result-weekly-header').html('Deze week');
        $('.results.list-container').hide().slice(0, 5).show();
      }
      if ($('.week-shown').length == 0) {
        $('.weekly-button.week').click();
      }
      if ($('#bar-container').html() == "") {
        $('.weekly-button.week').click();
      }
    });
  },

  events: {
    'click .header-collapse'                  : 'toggleSidebarCollapse',
    'click .week-container .weekly-button'    : 'loadWeeklyData',
    'change #my-result-select'                : 'submitForm',
    'click .subscr-collection .type'          : 'toggleSelected',
    'click .more-results'                     : 'showAllResults',
  },

  submitForm: function() {
    $('.loading').show();
    pageModel = this;
    currentWeek = $('.week-number').val();
    selectedOption = $('#my-result-select option:selected').val();

    $.ajax({
      type: 'POST',
      data: $('form').serialize(),
      url: "/weekly_results",
      success: function(data) {
        var results = JSON.parse(data.results);
        Wrts.data.results.reset(results, { parse: true });
        Wrts.app.setView(
          Wrts.views.Results.MyResults, {}
        );
        pageModel.loadLineChart(data.line_chart_data);
        pageModel.loadBarChart(data.bar_chart_data);
        pageModel.setWeekDetails(currentWeek, data);
        pageModel.setNewFilterValues(pageModel, data, selectedOption);
        $('.results.list-container').hide().slice(0, 5).show();
        if (results.length > 5) { $('.more-results').show() }
        $("body").append("<div class='week-shown' style='display:none'></div>")
      },
      error: function(data){
        console.log('kak');
      }
    });
  },

  setWeekDetails: function(currentWeek, data) {
    $('.week-number').val(currentWeek);
    $('.result-weekly-header').html('Week ' + String(currentWeek));
    $('.result-weekly-dates').html(data.start_day + " - " + data.end_day);  
  },

  setNewFilterValues: function(pageModel, data, selectedOption) {
    $('#my-result-select').html(pageModel.subjectsOptionsFromResults(data.uniq_subject_filters));
    $("#my-result-select option[value='"+selectedOption+"']").attr('selected', true);
  },

  showAllResults: function(ev) {
    ev.preventDefault();
    $('.results.list-container').show();
    $(ev.target).hide();
  },

  subjectsOptionsFromResults: function(subjects) {
    var options = '';

    options += '<option selected value="all">Alle</option>'
    $.each(subjects, function(id, subject) {
      options += '<option value="' + subject + '">' + subject + '</option>';
    });
    return options;
  },

  loadWeeklyData: function(ev) {
    ev.preventDefault();
    var addition = $(ev.target).closest('.weekly-button').data('addition'),
        currentWeek = $('.week-number').val(),
        newWeeknumber = parseInt(currentWeek) + addition;

    if (addition == 0) {
      $('.week-number').val(this.findCurrentWeekNumber());
    } else {
      $('.week-number').val(newWeeknumber);
    }

    this.submitForm();
    return false;
  },

  loadLineChart: function(data) {
    $('#line-chart-container').highcharts(data);
  },

  loadBarChart: function(data) {
    $('#bar-container').highcharts(data);
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
  }
});
