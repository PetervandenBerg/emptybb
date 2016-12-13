(function(helpers) {
  /**
  * Regex matching the diacritics (see above).
  */
  var diacriticsRegexp = new RegExp(unescape('[%u03aa%u00c8%u00ed%u03ab%u00c9%u00dc%u0386%u00ee%u00dd%u00ef%u03ac%u00ca%u0388%u03ad%u00cb%u00df%u0389%u00f1%u00cc%u038a%u00f2%u03d3%u03ae%u00cd%u00e0%u00f3%u03d4%u03af%u00ce%u00e1%u03b0%u00f4%u00cf%u00e2%u038c%u00d0%u00f5%u00d1%u00e3%u00f6%u00d2%u00e4%u038f%u00d3%u00e5%u00f8%u0390%u00d4%u00e6%u00f9%u00e7%u00fa%u00d5%u00e8%u03ca%u00fb%u00d6%u00e9%u03cb%u00fc%u03cc%u00fd%u00d8%u00ea%u00c6%u00d9%u00eb%u03cd%u00ff%u00c7%u00da%u00ec%u03ce]'),'g');

  /**
   * Replaces the diacritics with their non-diacritic versions.
   * a' is changed to a, Eszett is changed to ss etc.
   */
  helpers.replaceDiacritics = function(text) {
    /**
    * Diacritics to normal characters conversion:
    * a + ' maps to a, Eszett maps to ss etc.
    */
    var diacriticsConv = [['%u03aa','%u0399'],['%u00c8','%u0045'],['%u00ed','%u0069'],['%u03ab','%u03a5'],['%u00c9','%u0045'],['%u00dc','%u0055'],['%u0386','%u0391'],['%u00ee','%u0069'],['%u00dd','%u0059'],['%u00ef','%u0069'],['%u03ac','%u03b1'],['%u00ca','%u0045'],['%u0388','%u0395'],['%u03ad','%u03b5'],['%u00cb','%u0045'],['%u00df','%u0073%u0073'],['%u0389','%u0397'],['%u00f1','%u006e'],['%u00cc','%u0049'],['%u038a','%u0399'],['%u00f2','%u006f'],['%u03d3','%u03a5'],['%u03ae','%u03b7'],['%u00cd','%u0049'],['%u00e0','%u0061'],['%u00f3','%u006f'],['%u03d4','%u03a5'],['%u03af','%u03b9'],['%u00ce','%u0049'],['%u00e1','%u0061'],['%u03b0','%u03c5'],['%u00f4','%u006f'],['%u00cf','%u0049'],['%u00e2','%u0061'],['%u038c','%u039f'],['%u00d0','%u0044'],['%u00f5','%u006f'],['%u00d1','%u004e'],['%u00e3','%u0061'],['%u00f6','%u006f'],['%u00d2','%u004f'],['%u00e4','%u0061'],['%u038f','%u03a9'],['%u00d3','%u004f'],['%u00e5','%u0061'],['%u00f8','%u006f'],['%u0390','%u03b9'],['%u00d4','%u004f'],['%u00e6','%u0061%u0065'],['%u00f9','%u0075'],['%u00e7','%u0063'],['%u00fa','%u0075'],['%u00d5','%u004f'],['%u00e8','%u0065'],['%u03ca','%u03b9'],['%u00fb','%u0075'],['%u00d6','%u004f'],['%u00e9','%u0065'],['%u03cb','%u03c5'],['%u00fc','%u0075'],['%u03cc','%u03bf'],['%u00fd','%u0079'],['%u00d8','%u004f'],['%u00ea','%u0065'],['%u00c6','%u0041%u0045'],['%u00d9','%u0055'],['%u00eb','%u0065'],['%u03cd','%u03c5'],['%u00ff','%u0079'],['%u00c7','%u0043'],['%u00da','%u0055'],['%u00ec','%u0069'],['%u03ce','%u03c9']];

    if (!text.match(diacriticsRegexp)) return text;

    for (var i = 0; i < diacriticsConv.length; i++) {
      text = text.replace(
        new RegExp(unescape(diacriticsConv[i][0]), 'g'),
        unescape(diacriticsConv[i][1])
      );
    }
    return text;
  };

  /**
   * Replaces the unicode dashes with their non-unicode versions.
   * http://www.fileformat.info/info/unicode/category/Pd/list.htm
   */
  helpers.replaceDash = function(text) {
    return text.replace(/[\u002D\u058A\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D\u2212\u2043]/, '-');
  },  

  /**
   * Replace some common occuring unicode quotes with their non-unicode versions.
   * https://www.cs.sfu.ca/~ggbaker/reference/characters/
   * http://unicodelookup.com/#quo
   */
  helpers.replaceQuotes = function(text) {
    return text.replace(/[`\u2018\u2019\u201B\u2032\u0301\u0300]/, '\'').
      replace(/[\u201C\u201D\u201F\u2033\u3003\u301D\u301E\uFF02]/, '"');
  },

  helpers.replaceSpaces = function(text) {
    return text.replace(/[\u00AD]/, '').
      replace(/[\u00A0\u2002\u2003\t]/, ' ').
      replace(/[\u2026]/, '...');
  },

  /**
   * Remove leading and trailing spaces by nothing and merge multiple spaces into one.
   */

  helpers.removeSpaces = function(text) {
    return text.replace(/\s+/, ' ').replace(/^\s+/, '').replace(/\s+$/, '');
  },

  /**
   * Returns text without the first article.
   */
  helpers.removeArticle= function(text) {
    return text.replace(/^\s*((de|het|een|der|die|das|le|la|les|an|a|the)\s+|l')/, '');
  };

  helpers.removePunctuation = function(text) {
    text = this.replaceDash(text);
    text = this.replaceQuotes(text);
    text = this.replaceSpaces(text);
    text = this.removeSpaces(text);
    return text.replace(/\s*[-,._+:!?\[\]\(\)]\s*/g, '');
  };

  helpers.shuffleCharacters = function(text) {
    return _(text.split(' ')).chain().map(function(word) {
      return _.shuffle(word.split('')).join('');
    }).shuffle().value().join(' ');
  };

  /**
  * Keeps only the first letter of each word.
  * Replaces the other non-whitespace characters with .
  */
  helpers.firstLetterOnly = function(text) {
    var chars = text.split(''),
        buffer = [], result = [],
        i, n = chars.length, c;

    for (i = 0; i < n; i++) {
      c = chars[i];
      if (c.match(/\w/) || c.match(diacriticsRegexp)) {
        // a word character: if this is the first character,
        // add it to the result, otherwise add a period
        buffer.push(buffer.length === 0 ? c : '.');
      } else {
        // a non-word character: end the previous word
        if (buffer.length > 0) {
          result.push(buffer.join(''));
          buffer = [];
        }
        result.push(c);
      }
    }
    if (buffer.length > 0) {
      result.push(buffer.join(''));
    }
    return result.join('');
  };

  helpers.gradeForCountryConfiguration = function(percentage, configuration) {
    if (configuration === "dutch") {
      // don't use toFixed, it has rounding issues!
      str = Math.round((percentage/10) * 10) / 10;
    } else if (configuration === "letter") {
      switch (true) {
        case (percentage < 59):
          str = "E/F";
          break;
        case (percentage < 70):
          str = "D";
          break;
        case (percentage < 80):
          str = "C";
          break;
        case (percentage < 90):
          str = "B";
          break;
        case (percentage >= 90):
          str = "A";
          break;
      }
    } else if(configuration === "german"){
      str = Math.round(10 - ((percentage/10) * 10) / 10);

    } else {
      str = Math.round(percentage) + "%";
    }
    return str;
  };

  /**
   * Calculates the edit distance to find small typos.
   * Returns an associative array:
   *   distance:  the edit distance
   *   rows:  results from the backtracking function
   *   retryText:  the text to show in a retry ("the ap.le")
   */
  helpers.smallTypo = function(givenAnswer, correctAnswer) {
    var i, j, d, m = [[0]],
        givenAnswerLength = givenAnswer.length,
        correctAnswerLength = correctAnswer.length,
        givenAnswerChars = givenAnswer.split(''),
        correctAnswerChars = correctAnswer.split(''),
        rows, retryText;

    // calculate edit distance
    for (i=1; i<=givenAnswerLength; i++) {
      m[i] = [i];
    }
    for (j=1; j<=correctAnswerLength; j++) {
      m[0][j] = j;
    }
    for (i=1; i<=givenAnswerLength; i++) {
      for (j=1; j<=correctAnswerLength; j++) {
        d = givenAnswerChars[i-1]==correctAnswerChars[j-1] ? 0 : 1;
        m[i][j] =
          Math.min( m[i-1][j-1] + d,
          Math.min( m[i-1][j] + 1,
                    m[i][j-1] + 1 ));
      }
    }

    // trackback
    rows = helpers.editDistanceTrackback([[],[],[]], m, givenAnswerLength, correctAnswerLength, givenAnswerChars, correctAnswerChars);

    // retry-text
    retryText = [];
    for (i=0; i<rows[0].length; i++) {
      switch(rows[1][i]) {
        case '|':
          // keep: copy character
          retryText.push(rows[0][i]);
          break;
        case 'c':
          // change: show space or period
          retryText.push(rows[2][i]==' ' ? ' ' : '.');
          break;
        case 'i':
          // insert: show period
          retryText.push(rows[2][i]==' ' ? ' ' : '.');
          break;
        case 'x':
          // delete: show nothing
          break;
      }
    }

    return { distance: m[givenAnswerLength][correctAnswerLength], rows: rows, retryText: retryText.join('') };
  };

  /**
   * Trackback function to find the path to the edit distance.
   * (Used by smallTypo).
   */
  helpers.editDistanceTrackback = function(rows, m, i, j, a, b) {
    var editDistanceTrackback = Wrts.helpers.editDistanceTrackback,
        diag, diag_ch;

    if (i > 0 && j > 0) {
      diag = m[i-1][j-1];
      diag_ch = '|';

      if (a[i-1]!=b[j-1]) {
        diag = 1 + diag;
        diag_ch = 'c';
      }

      if (m[i][j]==diag) {   // change or match
        rows[0].unshift(a[i-1]);
        rows[1].unshift(diag_ch);
        rows[2].unshift(b[j-1]);
        return editDistanceTrackback(rows, m, i-1, j-1, a, b);

      } else if (m[i][j]==m[i-1][j]+1) {   // delete
        rows[0].unshift(a[i-1]);
        rows[1].unshift('x');
        rows[2].unshift('-');
        return editDistanceTrackback(rows, m, i-1, j, a, b);

      } else {   // insert
        rows[0].unshift('.');
        rows[1].unshift('i');
        rows[2].unshift(b[j-1]);
        return editDistanceTrackback(rows, m, i, j-1, a, b);
      }

    } else if (i > 0) {
      rows[0].unshift(a[i-1]);
      rows[1].unshift('x');
      rows[2].unshift('.');
      return editDistanceTrackback(rows, m, i-1, j, a, b);

    } else if (j > 0) {
      rows[0].unshift('.');
      rows[1].unshift('i');
      rows[2].unshift(b[i-1]);
      return editDistanceTrackback(rows, m, i, j-1, a, b);

    } else {
      return rows;
    }
  };

})(Wrts.helpers);