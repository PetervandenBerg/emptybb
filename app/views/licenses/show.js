Wrts.views.Licenses.Show = Wrts.BaseView.extend({
  templateName: 'licenses/show',
  decorator: Wrts.decorators.Licenses.Show,

  init: function(options){
    this.render();
    _.defer(function(){ 
      $('[data-toggle="tooltip"]').tooltip();
    });
  },

  events: {
    'click .fa-times.red'                 : 'removeLicenseUser',
    'click .resend-invitation'              : 'resendInvitation',
    'keyup #search-form input'            : 'searchUsers',
  },

  // Event functions
  // ====================================================

  resendInvitation: function(ev){
    var licenseUserId = $(ev.target).closest('.license-container').data('license-user-id');
    $.post('/resend_license_invite/', {id: licenseUserId}).done(function(data) {
      $("*[data-license-user-id='" + data + "']").find('.resend-invitation').hide();
    }).fail(function(err) {
      alert('Er is iets misgegaan, probeer opnieuw.');
    });
    return false;
  },

  removeLicenseUser: function(ev) {
    var id = $(ev.target).closest('.license-container').data('license-user-id');

    $.post('/delete_license_user/', {id: id}).done(function(data) {
      location.reload();
    }).fail(function(err) {
      alert('Er is iets misgegaan, probeer opnieuw.');
    });
    return false;
  },

  searchUsers: function(ev){
    var searchTerm = $('#search-form input').val().trim(),
        licenseContainers = $('.license-container');

    if (searchTerm.length > 0) {
      matchedResults = licenseContainers.filter(function(i, licenseElement) {
        var licenseUserName = $(licenseElement).data('license-user-name').trim(),
            licenseUserEmail = $(licenseElement).data('license-user-email').trim(),
            searchTerm = $('#search-form input').val().trim(),
            regex = new RegExp(searchTerm,"gi"),
            matchedlicenseUserEmail = licenseUserEmail.match(regex);
            matchedlicenseUserName = licenseUserName.match(regex);

        return (matchedlicenseUserName != null || matchedlicenseUserEmail != null)
      });

      if (matchedResults.length > 0) {
        var total_results = matchedResults.length;

        $('.license-container').hide();
        $('.tabular thead tr').hide();
        $('.hidden-header').show();
        $('.hidden-header .result-length').html(total_results);
        matchedResults.show();

      } else {
        $('.license-container').show();
        $('.tabular thead tr').show();
        $('.hidden-header').show();
        $('.hidden-header .result-length').html('0');
      }
    } else {
      $('.hidden-header').hide();
      $('.license-container').show();
      $('.tabular thead tr').show();
    }
  },
});
