(function(Wrts) {
  var channel = {};

  Wrts.subscribe = function(eventName, callback) {
    if (!channel[eventName]) {
      channel[eventName] = [];
    }
    channel[eventName].push(callback)
  };

  Wrts.publish = function(eventName) {
    if (channel[eventName]) {
      var args = Array.prototype.slice.call(arguments),
          callbacks = channel[eventName];

      for (var i = 0, n = callbacks.length; i < n; i++) {
        callbacks[i].apply(this, args.slice(1));
      }
    }
  };

  Wrts.events = _.extend({}, Backbone.Events);
})(Wrts);