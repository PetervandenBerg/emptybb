Wrts.helpers.registerRouter = function(namespace, router) {
  /**
  * @name parseRoutes
  * @description parses the routeObjects in router.
  * for example: '/some/furl/:id': { as: 'some_featurette', to: 'routerFunction' }
  * gets converted to a basic route (for fallback), but generates an url helper
  * so in hbs: {{some_featurette_url 123}} becomes "/some/furl/123"
  */
  function parseRoutes(routes) {
    for (var action in routes) {
      if (routes.hasOwnProperty(action) && typeof routes[action] === 'object') {
        var routeObj = routes[action];
        if (routeObj.as && routeObj.to) {
          Wrts.helpers.generateUrlTemplateHelper(routeObj.as, action);
          routes[action] = routeObj.to;
        } else {
          Wrts.helpers.throwError("registerRouter: router action parse error");
        }
      }
    }
  }

  if (router.routes) {
    parseRoutes(router.routes);
  }

  Wrts.decorators[namespace] = {};
  Wrts.views[namespace] = {};
  Wrts.routers[namespace] = Backbone.Router.extend(router);
};