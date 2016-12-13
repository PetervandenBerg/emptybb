Wrts.views.Lists._FormActions = Wrts.BaseView.extend({
  NUMBER_OF_LINES_TO_ADD: 3,

  model: Wrts.models.List,

  cloneModel: function() {
    this.clone = new Wrts.models.List(
       _(this.model.attributes).clone()
    );
    this.clone.setListCollection(this.model.getListCollection());
  },

  events: {
    'click #submit-form'              : 'submitForm',
    'click .js-delete-row'            : 'deleteWordAtIndex',
    'click .explanation-close-button' : 'hideExplanationPopup',
    'touchstart .js-delete-row'       : 'deleteWordAtIndex',
    'click .js-toggle-shared'         : 'toggleShare',
    'click .disabled-trigger'         : 'showPremiumModal',
    'click .add-column-link'          : 'addColumn',
    'click .remove-column-link'       : 'removeColumn',
    'change .text-field--subject'     : 'subjectChange',
    'blur .text-field--word'          : 'wordChange',
    'blur .publisher-list-form input' : 'wordChange',
    'change .other-trigger select'    : 'publisherListSelectChange',
    'focus .text-field--word'         : _.debounce(function() {
                                          return this.wordFocus.apply(this, arguments);
                                        }, 15, true),
    'click .js-add-rows'              : 'addRows',
    'change form'                     : 'setModelAttributes',
    'change #publisher-select'        : 'loadPublisherMethods',
    'click .subscr-collection .type'  : 'toggleSelected',
    'click .extra-fields-trigger'     : 'togglePublisherListFields',
    'click .list-types input'         : 'toggleListType',
  },

  // Event functions
  // ===================================
  //
  toggleShare: function(ev) {
    this.clone.toggle('shared');
  },

  showPremiumModal: function(ev) {
    if ($(ev.target).hasClass('max-lists')) {
      $('.max-list-modal').click();
    } else {
      $('.premium-modal').click();
    }
    return false;
  },

  toggleListType: function(ev) {
    this.setModelAttributes();
    this.render();
  },

  toggleChevronClass: function(ev) {
    var faElement = $(ev.target).closest('.extra-fields-trigger').find('.fa');

    if ($(faElement).hasClass('fa-chevron-right')) {
      $(faElement).removeClass('fa-chevron-right');
      $(faElement).addClass('fa-chevron-down');
    } else {
      $(faElement).addClass('fa-chevron-right');
      $(faElement).removeClass('fa-chevron-down');
    }
    this.toggleOpenedInputField(ev);
  },

  toggleOpenedInputField: function(ev) {
    var newValue = $('.opened-trigger').val() == "false";
    $('.opened-trigger').val(String(newValue));
  },

  // Validate form
  validateForm: function() {
    if (this.clone.isValid()) {
      this.viewState.set("locked", true);
      return true;
    } else {
      this.viewState.set("locked", false);
      this.viewState.set("validationMessages", [this.clone.validationError]);
    }
    $('#submit-form').prop("disabled", false);
    return false;
  },

  submitForm: function(ev) {
    ev.target.disabled = "disabled";
    this.setModelAttributes({ clean: true });

    if (this.validateForm() ) {
      this.model.set(this.clone.attributes);
      this.model.setListCollection(this.clone.getListCollection());
      if (this.model.get('is_streamed_list') == true) {
        setTimeout(function() {
          $('.streamed-list-edited').show();
        }, 1000);
      }
      this.model.save();
    }
    setTimeout(function() {
      $(ev.target).prop("disabled", false);
    }, 1000);
    return false;
  },

  deleteWordAtIndex: function(ev){
    var $input = $(ev.currentTarget).prev('input'),
        index = $input.data("word-index");
    if (Wrts.helpers.isInteger(index)) {
      this.clone.removeWordFromWordlist(index);
      this.render();
    }
  },

  loadPublisherMethods: function(ev) {
    var id = $(ev.target).find('option:selected').val();

    if (id != "") {
      this.fetch_publisher_methods(id, function(methods) {
        $('.publisher-methods-select').closest('.col-md-4').replaceWith(methods);
      }, this.list_not_found);
    }
  },

  fetch_publisher_methods: function(id, callback, error) {
    $.get('/publishers/' + id + '/fetch_publisher_methods').done(function(methods) {
      callback(methods);
    }).fail(function(err) {
      error(err);
    });
  },

  hideExplanationPopup: function(){
    localStorage.setItem('popStateExplanation','shown');
    $('.word-explanation').hide();
  },

  wordChange: function(ev) {
    this.setModelAttributes();
  },

  wordFocus: function(ev) {
    this.setModelAttributes();
    var $input = $(ev.currentTarget),
        tabindex;

    if (this.clone.isAlmostFilled()) {
      tabindex = $input.attr('tabindex');
      this.clone.addWordToWordLists();
      this.$('input[tabindex='+tabindex+']').focus();
    }
  },

  subjectChange: function(ev) {
    var $input = $(ev.currentTarget),
        value  = $input.val(),
        $select,
        speechLocale;

    if (!Wrts.helpers.isPresent(value)) { return; }

    speechLocale = Wrts.data.speechLocales.findClosestSpeechLocale(value);
    if (speechLocale) {
      if (Wrts.data.restriction.get('speech')) {
        $select = $input.closest('.word_list_column').find('.speech select');
        $select.val(speechLocale.get('locale').toUpperCase());
      } else if ($.inArray(speechLocale.get('locale'), ['fy', 'it', 'el']) == -1) {
        $select = $input.closest('.word_list_column').find('.speech select');
        $select.val(speechLocale.get('locale').toUpperCase());
      }
    }
    this.setModelAttributes();
  },

  navigateToLists: function() {
    return this.navigate('/#', { trigger:true, replace:true });
  },

  navigateToList: function(id) {
    return this.navigate('/lists/' + id, { trigger:true, replace:true });
  },

  addRows: function(ev) {
    ev.preventDefault();
    this.setModelAttributes();
    for (i = 0; i < this.NUMBER_OF_LINES_TO_ADD; i++) {
      this.clone.addWordToWordLists();
    }
  },

  setModelAttributes: function(options){
    var attrs = this.getModelAttributesFromDOM(),
        listCollection = attrs.list_collection;

    listCollection.lists = listCollection.lists.filter(function(a) {return (a != undefined) });

    attrs = _.omit(attrs, 'list_collection');

    if ('shared' in attrs && attrs['shared'] === "on") {
      attrs['shared'] = true;
    }

    this.clone.set(attrs);
    if (attrs.publisher_list) {
      this.clone.set(attrs.publisher_list);
    }
    this.clone.setListCollection(listCollection, options);
  },

  handleError: function(jqXhr, textStatus) {
    var validationMessages = this.viewState.get('validationMessages') || [];
    validationMessages.push(textStatus);
    if ('responseJSON' in validationMessages[0]) {
      this.$validationMessagesUl.html( _(validationMessages[0].responseJSON["errors"]).join('') );
      this.$validationMessages.show();
    }
  },

  addColumn: function(e) {
    e.preventDefault();
    var data = $('#new-list-column').serialize().split('&');
    var columns = document.getElementsByClassName("word_list_column");
    var column_index = (data[1] != undefined ? data[1].split('=')[1] : 0);

    if (columns.length < 4) {
      new_column = this.cloneHtmlWordList(columns, column_index);
      document.getElementById('list_form').appendChild(new_column);
      this.recalculateColumnWidth();
      this.ensureDeleteButtonPresence();
      this.setModelAttributes();
      this.clone.trigger('add');
      _.defer(function(){ $('[data-toggle="tooltip"]').tooltip(); });
    } else {
      alert('Je hebt het maximum van 4 kolommen bereikt.')
    }

    $('.modal-backdrop').click();
    return false;
  },

  removeColumn: function(e) {
    e.preventDefault();
    var message = confirm("Weet je het zeker, je raakt alle ingevoerde woorden in deze kolom kwijt.");
    var data = $('#new-list-column').serialize().split('&');
    var columns = document.getElementsByClassName("word_list_column");
    var column_index = (data[1] != undefined ? data[1].split('=')[1] : 0);
    var deleteClickCount = this.viewState.get('deleteClickCount')

    if (message || deleteClickCount > 0) {
      this.viewState.set('deleteClickCount', 1)
      number_of_columns = document.getElementsByClassName("word_list_column").length;
      if (number_of_columns > 1) {
        $(e.target).closest('.word_list_column').remove();
        this.recalculateColumnWidth();
        this.ensureDeleteButtonPresence();
      }
      this.setModelAttributes();
      this.render();
      _.defer(function(){ $('[data-toggle="tooltip"]').tooltip(); });
    }
  },

  recalculateColumnWidth: function () {
    var columns = document.getElementsByClassName("word_list_column");
    var column_width = Math.round((12 / columns.length)).toString();

    for(var i = 0; i < columns.length; i++) {
      current_col_class = columns[i].className.split(" ")[3]
      new_col_class = "col-xs-" + column_width
      columns[i].classList.remove(current_col_class)
      columns[i].classList.add(new_col_class)
    } 
  },

  ensureDeleteButtonPresence: function () {
    var delete_buttons = document.getElementsByClassName("js-delete-row");
    var columns = document.getElementsByClassName("word_list_column");
    var last_column = columns[columns.length -1]
    var delete_button_element = "<div class='input-group-addon js-delete-row'><i class='fa fa-close'></i></div>"
    $(delete_buttons).remove();
    $(last_column).find('.word.form-group .input-group').each( function( i, el ) {
      $(el).append(delete_button_element);
    });
  },

  cloneHtmlWordList: function (columns, column_index) {
    var name_index = columns.length;
    var new_column = columns[column_index].cloneNode(true);
    $(new_column).find('.input-group-addon').remove();
    $(new_column).find("input").val("");
    $(new_column).find("select").val([]);
    $(new_column).find('.remove-button').prepend(this.removeColumnButton);
    this.addUniqIndexToFields(new_column, name_index);
    return new_column;
  },

  addUniqIndexToFields: function(new_column, name_index) {
    $(new_column).find('input').each( function( i, el ) {
      el.name = el.name.replace(/\d+/, name_index)
    });
    var hiddenSpeechFieldName = "list_collection[lists][" + name_index + "][speech_locale]";
    $(new_column).find('select').attr('name', hiddenSpeechFieldName);
  },

  addHiddenSpeechlocaleField: function(new_column, name_index) {
    var hiddenFieldValue = $(new_column).find("select").find('option:selected').val();
    var hiddenSpeechFieldName = "list_collection[lists][" + name_index + "][speech_locale]";
    var hiddenInput = "<input style='display:none;' name='" + hiddenSpeechFieldName + "' value='" + hiddenFieldValue  + "'>"
    this.appendHiddenFieldTo(new_column, hiddenInput);
  },

  appendHiddenFieldTo: function(new_column, input) {
    $(new_column).find("select").parent().append(input);
  },

  removeColumnButton: function() {
    return "<a class='remove-column-link' href='#'><img data-index='1' alt='wrts-remove-button' class='remove-button' height='20' src='/remove_column.png'></a>"
  },

  // Render functions
  // ===================================
  render: function() {
    this.$el.html( this.template(this.getTemplateData(this.clone)) );
    this.$submitButton         = this.$('button[type=submit]');
    this.$validationMessages   = this.$('.validation_messages');
    this.$validationMessagesUl = this.$validationMessages.find('> ul');
    this.updateComponents();
  },

  updateComponents: function() {
    var isLocked           = this.viewState.get('locked'),
        validationMessages = this.viewState.get('validationMessages') || [],
        messageElements;

    if (validationMessages.length === 0) {
      this.$validationMessages.hide();
    } else {
      messageElements = [];
      _(validationMessages).each(function(msg){
        messageElements.push([
          '<li>', msg, '</li>'
        ].join(''));
      });
      this.toggleLock();
      this.$validationMessagesUl.html(messageElements.join(''));
      this.$validationMessages.show();

      $('html, body').animate({
        scrollTop: $(".validation_messages").offset().top
      }, 1000);
    }
  },

  toggleLock: function(){
    this.viewState.set('locked');
  },

  togglePublisherListFields: function(ev){
    $(ev.target).closest('.publisher-list-form').find('.fields').toggle();
    this.toggleChevronClass(ev);
    this.setModelAttributes();
  },

  publisherListSelectChange: function(ev){
    this.setModelAttributes();
    if ($(ev.target).find('option:selected').val() == "anders") {
      $('.hidden-publisher-field').show();
      if ($('#publisher-select').find('option:selected').val() !== "anders") {
        $('.extra-publisher-field').attr('disabled', true);
      } else {
        $('.extra-publisher-field').attr('disabled', false);
      }
    } else {
      $('.hidden-publisher-field').hide();
    }
  },

  // Setters and getters
  // ===================================
  //

  getModelAttributesFromDOM: function(){
    return this.$el.find('form').serializeJSON();
  }
});
