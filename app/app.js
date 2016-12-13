App.App = function($app) {
  var router;

  var state = new Backbone.ViewState({
    requesting: false
  });

  var view = new Wrts.views.App({
    el: $app,
    state: state
  });

  App.app = {
    setView: function(viewClass, options) {
      if (!options) { options = {}; }
      if (this.currentView) {
        this.currentView.remove();
      }
      newView = new viewClass(options);
      this.currentView = newView;

      // give a real feedback feeling
      window.scrollTo(0, 0);

      // De gerenderde view moet niet op de hoogte zijn van
      // het element waarin het gerenderd wordt.
      view.getOutletEl().html(this.currentView.el);
    },

    getRouter: function() {
      return router;
    }
  };

  $(document)
    .ajaxSend(function() {
      state.set('requesting', true);
    })
    .ajaxComplete(function() {
      state.set('requesting', false);
    });

  $.when()
    .done(function() {
      router = new Wrts.Router();
      Backbone.history.start();

      // Prevent refresh with a popup
      function onBeforeunload() {
        var message = "Weet je zeker dat je de pagina wilt verlaten?",
        ev = ev || window.event;

        // For IE and Firefox
        if (ev) {
          ev.returnValue = message;
        }

        window.onbeforeunload = null;

        // For Safari
        return message;
      }

      var refreshProtectedPathRegexp = /exercises\/.\d*\/run/;

      Wrts.events.listenTo(Wrts.events, 'route', function(path) {
        if (refreshProtectedPathRegexp.test(path)) {
          window.onbeforeunload = onBeforeunload;
        } else {
          window.onbeforeunload = null;
        }
      });

    })
    .fail(function() {
      alert("Nog niet toegevoegd")
    });
};
