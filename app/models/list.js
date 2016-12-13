Wrts.models.List = Wrts.BaseModel.extend({
  ALMOST_THRESHOLD: 2,

  validator: Wrts.validators.ListValidator,

  initialize: function() {
    //this.listCollection = this.get('list_collection') || {};
  },

  parse: function (json) {
    if (json.list_collection) {
      this.setListCollection(json.list_collection);
      json = _(json).omit('list_collection');
    }
    return json;
  },

  toJSON: function() {
    var json = Backbone.Model.prototype.toJSON.call(this);
    return json;
  },

  getListCollection: function() {
    return _.clone(this.listCollection || {});
  },

  sanitizeCollection: function(listCollection) {
    var sanitized = { lists: [] };
    _(listCollection.lists).each(function(wordList){
      sanitized.lists.push(wordList);
    });
    return sanitized;
  },

  setListCollection: function(listCollection, options) {
    if (options && options.clean === true) {
      listCollection = this.sanitizeCollection(listCollection);
    }
    this.listCollection = listCollection;
  },

  createWordLists: function(numberOfSubjects, numberOfEmptyWords) {
    var listCollection = this.getListCollection();
    var createArray = function(numberOf) {
      var arr = [];
      for (var i = 0, n = numberOf; i < n; i++) {
        arr.push({ word: "" });
      }
      return arr;
    };

    var lists = [];
    for (var i = 0; i < numberOfSubjects; i++) {
      lists.push({
        subject: "",
        words: createArray(numberOfEmptyWords || 5)
      });
    }

    listCollection.lists = lists;

    this.setListCollection(listCollection);
  },

  addWordList: function() {
    var listCollection     = this.getListCollection(),
        numberOfLists      = listCollection.lists.length,
        numberOfEmptyWords = listCollection.lists[0].words.length;

    function createEmptyWords(numberOfEmptyWords) {
      var creation = [];
      for (var i = 0; i < numberOfEmptyWords; i++) {
        creation.push({ word: "" });
      }
      return creation;
    }

    if (numberOfLists < 4) {
      listCollection.lists.push({
        subject: '',
        words: createEmptyWords(numberOfEmptyWords)
      });

      this.setListCollection(listCollection);
      return true;
    } else {
      return false;
    }
  },

  removeWordList: function(index) {
    var listCollection     = this.getListCollection(),
        numberOfLists      = listCollection.lists.length;

    listCollection.lists.splice(parseInt(index), 1)
    this.setListCollection(listCollection);
  },

  removeWordFromWordlist: function(index){
    var listCollection = this.getListCollection();
    for (var i = 0, n = listCollection.lists.length; i < n; i++) {
      listCollection.lists[i].words.splice(index, 1);
    }
    this.setListCollection(listCollection);
  },

  addWordToWordLists: function() {
    var listCollection = this.getListCollection();
    for (var i = 0, n = listCollection.lists.length; i < n; i++) {
      // Prevent exception when lists.words is empty
      if ( !listCollection.lists[i].words) {
        listCollection.lists[i].words = []
      }
      var times = 10;
      for(var ii=0; ii < times; ii++){
        listCollection.lists[i].words.push({ word: "" });
      }
    }
    this.setListCollection(listCollection);
    this.trigger("add");
    $('html, body').animate({
      scrollTop: $(".word.form-group:last").offset().top -300
    }, 0);
  },

  toggleArchive: function(){
    if ( this.get("archived") ) {
      this.set("archived", false);
    } else{
      this.set("archived", true);
      this.trigger("archived");
    }
    this.save();
  },

  isAllFilled: function() {
    return this.isAllEmpty();
  },

  isAlmostFilled: function() {
    var emptyWordsOnly = function(word) {
      return Wrts.helpers.isEmpty(word.word);
    };

    var memoFunc = function(memo, list) {
      return memo + _(list.words).filter(emptyWordsOnly).length;
    };

    var numberOfEmpty = _(this.getListCollection().lists).reduce(memoFunc, 0);
    return numberOfEmpty <= this.ALMOST_THRESHOLD;
  },

  isAllEmpty: function() {
    return _(this.getListCollection().lists).any(function(list) {
      return Wrts.helpers.isAnyPresent(list.words);
    });
  },

  hasParams: function(params) {
    if (!params) { return true; }

    var has = true;

    if (params.subject) {
      has = _(this.getSubjects()).include(params.subject);
    }
    return has;
  },

  getWordListsBySubject: function(subject){
    return _(this.getListCollection().lists).findWhere({"subject": subject});
  },

  getWordListByIndex: function(index){
    return this.getListCollection().lists[index];
  },

  getWordlistsWithoutSubject: function(subject) {
    return _(this.getListCollection().lists).reject(function(lc){
      return lc.subject === subject;
    });
  },

  getWordlistsWithoutIndex: function(index) {
    return _(this.getListCollection().lists).reject(function(lc, i){
      return i === index;
    });
  },

  getWordCount: function() {
    return this.getListCollection().lists[0].words.length;
  },

  getCreatedAt: function(){
    return new moment(this.get('created_at'));
  },

  getSubjects: function(){
    return _(this.getListCollection().lists).map(function(wordList){
      return $.trim(wordList.subject);
    });
  },

  getSubjectsIndexMap: function() {
    if ($.isEmptyObject(this.getListCollection())) {
      this.listCollection = this.attributes.list_collection;
    }

    return _(this.getListCollection().lists).map(function(wordList, index) {
      return {
        subject: wordList.subject,
        index: index
      };
    });
  },

  getLocales: function(){
    return _(this.getListCollection().lists).map(function(wordList){
      return wordList.speech_locale;
    });
  },

  toggle: function(attribute){
    this.set(attribute, !this.get(attribute));
  },

  toJSON: function() {
    var json = Backbone.Model.prototype.toJSON.call(this);
    json.list_collection = this.getListCollection();
    return json;
  },

  url: function(){
    new_or_edit = (this.isNew() || this.get('is_streamed_list'));
    return 'lists' + (new_or_edit ? '' : '/' + this.id);
  },
});
