'use strict';

var SFormat = {
  float_two_pt : function (val) {
    return parseFloat((Math.round(val * 100) / 100).toFixed(2));
  },

  float_one_pt : function (val) {
    return parseFloat((Math.round(val * 100) / 100).toFixed(1));
  }
};