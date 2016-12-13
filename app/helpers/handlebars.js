//  format an ISO date using Moment.js
//  http://momentjs.com/
//  moment syntax example: moment(Date("2011-07-18T15:50:52")).format("MMMM YYYY")
//  usage: {{dateFormat creation_date format="MMMM YYYY"}}
Handlebars.registerHelper('dateFormat', function(context, block) {
  if (window.moment && context && moment(context).isValid()) {
    var f = block.hash.format || "MMM Do, YYYY";
    return moment(new Date(context)).format(f);
  }else{
    return context;   //  moment plugin not available. return data as is.
  };
});

//translation
Handlebars.registerHelper('t', function(context, options) {
  var translation = Wrts.I18n.t(context, options.hash);
  return new Handlebars.SafeString(translation);
});

Handlebars.registerHelper('isRestrictedExercise', function(context, options) {
  if (Wrts.data.restriction.attributes.start_exercise != true) {
    return "disabled='disabled'"
  }
});

Handlebars.registerHelper('isDisabled', function(context, options) {
  var restriction = Wrts.data.restriction;

  if (restriction.get(context) != true) {
    return "disabled='disabled'"
  }
});

Handlebars.registerHelper('amountResults', function(results, options) {
  return results.length;
});

Handlebars.registerHelper('isDisabledClass', function(context, options) {
  var restriction = Wrts.data.restriction;

  if (restriction.get(context) != true) {
    return "disabled-trigger "
  }
});

Handlebars.registerHelper('ifIsOwner', function(id, options) {
  if(id === Wrts.data.user.id) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper('ifIsOwnResult', function(v1, options) {
  if(v1.user_id === Wrts.data.user.id) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper('ifIsNotOwnResult', function(v1, options) {
  if(v1.user_id !== Wrts.data.user.id) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper('ifLocaleAllowed', function(locale, options) {
  if (Wrts.data.restriction.get('speech') == false && $.inArray(locale, ['FY', 'IT', 'EL']) != -1) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

Handlebars.registerHelper('include', function(options) {
    var context = {},
        mergeContext = function(obj) {
            for(var k in obj)context[k]=obj[k];
        };
    mergeContext(this);
    mergeContext(options.hash);
    return options.fn(context);
});

Handlebars.registerHelper('asset_path', function(context, options) {
  var asset_prefix = '/assets/',
      hostRegex = /(^https?\:\/\/)/,
      match = hostRegex.exec(context);
  if (match && match.length > 0) {
    return new Handlebars.SafeString(context);
  } else {
    return new Handlebars.SafeString(asset_prefix + context);
  }
});

Handlebars.registerHelper('downcased', function(option, value) {
  return option.toLowerCase();
});

Handlebars.registerHelper('selected', function(option, value) {
  if (option === value) {
    return ' selected';
  } else {
    return '';
  }
});

Handlebars.registerHelper('uniPrice', function(option, value) {
  return option.replace('.', ',');
});

Handlebars.registerHelper('joinMutipleAnswers', function(option, value) {
  return option.join(' , ');
});

Handlebars.registerHelper('camelCased', function(option, value) {
  if (option == "" || option == null) {
    return option;
  } else {
    var firstLetter = option[0].toUpperCase(),
        rest        = option.slice(1);
    return firstLetter + rest;
  }
});

Handlebars.registerHelper('consoleLogVariable', function(option, value) {
  console.log(option);
});

Handlebars.registerHelper('inspectVariable', function(option, value) {
  debugger
});

Handlebars.registerHelper('activeClass', function(foo, bar){
  if (foo == bar) {
    return 'active'
  }
});

Handlebars.registerHelper("humanizeIndex", function(index) {
  return index + 1;
});

Handlebars.registerHelper("conditional", function(result, stringA, stringB) {
  var str = result ? stringA : stringB;
  return new Handlebars.SafeString(str);
});
Handlebars.registerHelper("translated_conditional", function(result, stringA, stringB) {
  var str = result ? stringA : stringB;
  return new Handlebars.SafeString(Wrts.I18n.translate(str));
});

Handlebars.registerHelper("log", function(something) {
  console.log(something);
});

Handlebars.registerHelper('strip_characters', function(text) {
  text = Handlebars.Utils.escapeExpression(text);
  text = text.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚâêîôÂÊÎÔãõÃÕçÇ:]+/g, " ");
  return new Handlebars.SafeString(text);
});

Handlebars.registerHelper('subject_to_url', function(text) {
  //text = Handlebars.Utils.escapeExpression(text);
  text = text.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚâêîôÂÊÎÔãõÃÕçÇ:|]/g, " "); // Note the ^ not operator
  text = text.replace(/\s/g, '.');
  text = text.replace(/[|]{2}/, '-');
  return new Handlebars.SafeString(text);
});

Handlebars.registerHelper('subject_to_display', function(text) {
  text = Handlebars.Utils.escapeExpression(text);
  text = text.replace(/[|]{2}/g, ' - ');
  return new Handlebars.SafeString(text);
});

Handlebars.registerHelper("is_one", function(count, options) {
  return count == 1 ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('ifEq', function(a, b, options) {
  if(a == b) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

Handlebars.registerHelper('unlessNull', function(value, options) {
  if(value != null) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

Handlebars.registerHelper('humanizeAnswer', function(value, options) {
  function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
  }

  if (value.filter( onlyUnique )[0] === false) {
    return 'fout';
  } else {
    return value.filter( onlyUnique ).join(',');
  }
});
