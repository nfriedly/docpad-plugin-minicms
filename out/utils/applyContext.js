// Generated by IcedCoffeeScript 1.6.3-g
(function() {
  var applyContext;



  applyContext = function(input, context) {
    var item, key, res, val, _i, _len;
    if (input instanceof Array) {
      res = [];
      for (_i = 0, _len = input.length; _i < _len; _i++) {
        item = input[_i];
        res.push(applyContext(item, context));
      }
      return res;
    } else if (typeof input === 'function') {
      return input.apply(context);
    } else if (typeof input === 'object') {
      res = {};
      for (key in input) {
        val = input[key];
        res[key] = applyContext(val, context);
      }
      return res;
    } else {
      return input;
    }
  };

  module.exports = applyContext;

}).call(this);
