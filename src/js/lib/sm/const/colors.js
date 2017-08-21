'use strict';
if (!sc) {
  var sc = {};
}


sc.color = {
  clear: "rgba(0, 0, 0, 0)",
  white : "#FFFFFF",
  black : "#000",
  red : "#FF0000",
  green : "#00FF00",
  blue : "#0000FF",
  pink : "#FF00FF",
  yellow : "#FFFF00",
  cyan : "#00FFFF",
  orange : "#FF8800",
  dark_blue : "#000180"
};

/**
 * @return {string}
 */
sc.color.RGBA = function (R, G, B, A) {
  return 'rgba(' + R + ", " + G + ', ' + B + ', ' + A + ')';
};

sc.color.randColor = function () {
  return sc.color.RGBA(
      Math.floor(SMath.rand(0, 255)),
      Math.floor(SMath.rand(0, 255)),
      Math.floor(SMath.rand(0, 255)),
      SFormat.float_two_pt(SMath.rand(0, 1))
  );
};