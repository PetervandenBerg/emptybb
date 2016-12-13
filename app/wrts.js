window.App = {
  models: {},
  collections: {},
  views: {},
  decorators: {},
  routers: {},
  helpers: {},
  data: {},
  I18n: {},

  ns: function (namespace) {
    var parts = namespace.split('.'),
        parent = Wrts;

    for (var i = 0; i < parts.length; i++) {
      // create a prop/namespace if it doesn't exist
      if (typeof parent[parts[i]] === "undefined") {
        parent[parts[i]] = {};
      }
      parent = parent[parts[i]];
    }
    return parent;
  }
};
