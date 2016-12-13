$(function() {
  var fadeOutEl;

  closeEl = function(index, element) {
    var $el, msec;
    $el = $(element);
    msec = (index + 1) * 100;
    return setTimeout((function() {
      return $el.alert('close');
    }), msec);
  };

  return setTimeout((function() {
    var msec, parent;
    parent = $("#flashes");
    msec = (parent.children().length + 2 ) * 100;
    return parent.children().each(closeEl);
    parent.closest(".row").remove();
    }), 5000);
});

