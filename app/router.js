App.Router = Backbone.Router.extend({
  routes: {
    "*path": "overview"
  },

  // Start all routers in namespace routers
  initialize: function() {
    var routers = App.routers;
    for (var routerName in routers) {
      if (routers.hasOwnProperty(routerName)) {
        var router = new routers[routerName]();
        router.bind('route', this._routeChange);
      }
    }
    // This shoud be implemented for all routers
    this.bind('route', this._routeChange);
    App.helpers.generateUrlTemplateHelper("root", "overview");
  },

  overview: function() {
    //set some view
    App.app.setView(App.views.FirstTime);
  },

  _routeChange: function() {
    var path = Backbone.history.getFragment();
    App.events.trigger('route', path);
    App.publish("trackView", path);
  },

});
