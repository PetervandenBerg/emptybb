Wrts.views.Transactions.Licenses = Wrts.BaseView.extend({
  templateName: 'transactions/licenses',
  decorator: Wrts.decorators.Transactions.Licenses,

  init: function() {
    this.render();
  },

  events: {
    'click .table-header.plus'          : 'togglePlusTablebody',
    'click .table-header.pro'           : 'toggleProTablebody',
    'change #plan-type'                 : 'toggleTotals',
    'keyup #license-amount-input'       : 'toggleTotals',
    'blur #license-amount-input'        : 'toggleTotals',
    'click #submit-form'                : 'submitForm',
  },

  // Event functions
  // ===================================
  //

  submitForm: function(ev) {
    $('#license-form').submit();
  },

  togglePlusTablebody: function(ev) {
    $('.plus-hidden').fadeIn();
    $('.pro-hidden').fadeOut();
  },

  toggleProTablebody: function(ev) {
    $('.pro-hidden').fadeIn();
    $('.plus-hidden').fadeOut();
  },

  toggleTotals: function(ev) {
    var amount = Math.round($('#license-amount-input').val()),
        plan_price = this.findPlanPriceFromDom(),
        price = this.calculateTotal(amount, plan_price);

    if (amount && amount > 2 && amount < 50) {
      $('.licenses .group-totals').show();
      var newPrice = this.calculatePrices(amount, 10, plan_price);
      var discount = this.calculateDiscount(amount, 10, plan_price);
    } else if (amount && amount > 49 && amount < 100) {
      $('.licenses .group-totals').show();
      var newPrice =  this.calculatePrices(amount, 15, plan_price);
      var discount = this.calculateDiscount(amount, 15, plan_price);
    } else if (amount && amount > 99 && amount < 10000) {
      $('.licenses .group-totals').show();
      var newPrice = this.calculatePrices(amount, 20, plan_price);
      var discount = this.calculateDiscount(amount, 20, plan_price);
    } else {
      $('.licenses .group-totals').hide();
      $('.invalid-license-amount').show();
    }

    if (newPrice) {
      $('.invalid-license-amount').hide();
      $('.price').html(price);
      $('.total-price').html(newPrice);
      $('.discount-price').html(discount);
    }
  },

  findPlanPriceFromDom: function() {
    var planTypeId = $('#plan-type').find('option:selected').val();
    return Wrts.data.subscription_types.get(planTypeId).get('year_plan_price');
  },

  calculatePrices: function(amount, percentage, year_price) {
    var number = (year_price * ((100 - percentage) / 100) * amount),
        fixedNumber = parseFloat(number.toFixed(2)),
        goodNumber = this.addZeroes(String(fixedNumber)).replace('.', ',');
    return goodNumber;
  },

  calculateDiscount: function(amount, percentage, year_price) {
    var number = (((year_price / 100) * percentage) * amount),
        fixedNumber = parseFloat(number.toFixed(2)),
        goodNumber = this.addZeroes(String(fixedNumber)).replace('.', ',');
    return goodNumber;
  },

  calculateTotal: function(amount, year_price) {
    var number = (year_price * amount),
        fixedNumber = parseFloat(number.toFixed(2)),
        goodNumber = this.addZeroes(String(fixedNumber)).replace('.', ',');
    return goodNumber;
  },

  addZeroes: function(num) {
    var value = Number(num);
    var res = num.split(".");
    if(num.indexOf('.') === -1) {
      value = value.toFixed(2);
      num = value.toString();
    } else if (res[1].length < 3) {
      value = value.toFixed(2);
      num = value.toString();
    }
    return num
  }

});
