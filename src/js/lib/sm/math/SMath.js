'use strict';

/**
 * Global math utility object.
 */
var SMath = {
  rand: function (floor, ceil) {
    return (ceil - floor) * Math.random() + floor;
  },

  project: function (val, originRangeA, originRangeB, targetRangeA, targetRangeB ) {
    var originSpan = originRangeB - originRangeA;
    var targetSpan = targetRangeB - targetRangeA;
    return (val / originSpan) * targetSpan + targetRangeA;
  },
  
  clamp: function (val, rangeA, rangeB) {
    if (val < rangeA) {
      return rangeA
    } else if (val > rangeB) {
      return rangeB;
    }
    return val;
  },

  /**
   * Returns the interpolated value between two colors.
   */
  lerpColor: function (colorA, colorB, alpha) {
    return colorA;
  },

  /**
   * Returns the interpolated value between two constants.
   */
  lerp: function (valA, valB, alpha) {
    return valA + (valB - valA) * alpha;
  },
  
  wrapIndex: function (index, length) {
    if (index > length - 1) {
      index = this.wrapIndex(index - length, length);
    }
    return index;
  }
};
