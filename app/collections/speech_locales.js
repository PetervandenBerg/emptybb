(function(){
  'use strict';
  Wrts.collections.SpeechLocales = Backbone.Collection.extend({
    model: Wrts.models.SpeechLocale,
    findClosestSpeechLocale: function(triggerWord) {
      var distanceFunction = Wrts.helpers.distanceFunction,
          minDistance      = 2,
          matchingSpeechLocale;

      if (!triggerWord) { return undefined; }
      triggerWord = triggerWord.toLowerCase();

      this.each(function(speechLocale) {
        var currentMinDistance = 2;
        var distance = _(speechLocale.get('triggerWords'))
          .chain()
            .map(function(word){
              var distance = distanceFunction(triggerWord, word);
              if (distance < currentMinDistance) {
                currentMinDistance = distance;
                matchingSpeechLocale = speechLocale;
              }
            })
            .min()
          .value();

        if (currentMinDistance < minDistance) {
          minDistance = currentMinDistance;
          matchingSpeechLocale = speechLocale;
        }
      });
      return minDistance < 2 ? matchingSpeechLocale : undefined;
    }
  });
})();


