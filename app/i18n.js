App.I18n.translate = function(key, options) {
  if (!key){ return; }
  var _options = {};
  if (options) {
    _options = options
  }

  var splitKeys = key.split("."),
      space = Wrts.data.I18n,
      lastKeyIndex = splitKeys.length - 1,
      error = false;

  if (_options.scope){
    var scopeKeys = _options.scope.split(".").reverse();
    for (var i = 0, n = scopeKeys.length; i < n; i++){
      splitKeys.unshift(scopeKeys[i]);
    }
    lastKeyIndex = splitKeys.length - 1;
  }
  splitKeys = _(splitKeys).map(function(k){
    return k.toLowerCase();
  });

  if (lastKeyIndex > 0) {
    for (var i = 0, n = lastKeyIndex; i < n && !error; i++) {
      if (space[splitKeys[i]]) {
        space = space[splitKeys[i]];
      } else {
        error = true;
      }
    }
  }
  result = space[splitKeys[lastKeyIndex]];
  if (typeof result === 'undefined') {
    var translation = Wrts.data.I18n.locale + ".javascript." + splitKeys.join('.')
    console.warn("%c missing translation: ", "background-color: red; color: pink", translation);
    return "<span class='translation-missing' " + 'data-translation= ' + translation + ">" + splitKeys[splitKeys.length - 1] + "<span>"

  } else {
    return result;
  }
};
App.I18n.t = App.I18n.translate;
