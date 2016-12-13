$(document).ready(function() {

  $( "#sortable.covers" ).sortable({
    axis: 'x, y',
    handle: '.cover__handle',
    placeholder: 'cover__placeholder',
    update: function() {
      var data = $(this).sortable('serialize'),
          url  = $(this).data('update-url');
      $.post(url, data);
    }
  });
  
  $( "#sortable.lists" ).sortable({
    axis: 'y',
    handle: '.list__handle',
    placeholder: 'list__placeholder',
    update: function() {
      var data = $(this).sortable('serialize'),
          url  = $(this).data('update-url');
      $.post(url, data);
    }
  });

  $( "#sortable" ).disableSelection();
});

