'use strict';

var SVec = {};

/**
 * Class definition for a Vector and common methods for operating on one or more Vectors.
 */

/**
 * Creates a Vector containing the given x & y.
 * Additionally, calculates a length field.
 *
 * @param x
 * @param y
 */
SVec.Vector = function Vector(x, y) {
  this.x = x ? x : 0;
  this.y = y ? y : 0;
  this.len = Math.sqrt((x * x) + (y * y));
};

/**
 * For ease of logging.
 */
SVec.Vector.prototype.toString = function () {
  return this.x + ', ' + this.y;
};

/**
 * Global methods for Vector operations.
 * Returns references to Vector for chaining.
 * Every function triggers a calcLen() call which
 * recalculates the length of the Vector.
 */

/**
 * Sets the length field of the given Vector according to its x & y values.
 * @param vec
 */
SVec.calcLen = function (vec) {
  vec.len = Math.sqrt((vec.x * vec.x) + (vec.y * vec.y));
};

/**
 * Returns the distances between the two Vectors.
 */
SVec.dst = function (vec1, vec2) {
  return Math.sqrt((vec1.x - vec2.x) * (vec1.x - vec2.x) + (vec1.y - vec2.y) * (vec1.y - vec2.y));
};

/**
 * Sets the x & y values of the given Vector to the provided constants.
 */
SVec.setVec = function (vec, x, y) {
  vec.x = x;
  vec.y = y;
  SVec.calcLen(vec);
  return vec;
};

/**
 * Sets the x & y values of the given Vector to the values in the second Vector.
 */
SVec.setVecVec = function (vec1, vec2) {
  return SVec.setVec(vec1, vec2.x, vec2.y);
};

/**
 * Returns a new Vector, as a copy of the provided Vector.
 */
SVec.cpyVec = function (vec) {
  return new SVec.Vector(vec.x, vec.y);
};

/**
 * Scales the values of the provided Vector by the designated scalar.
 */
SVec.sclVec = function (vec, scalar) {
  vec.x *= scalar;
  vec.y *= scalar;
  SVec.calcLen(vec);
  return vec;
};

/**
 * Multiplies the values of the first Vector by the second.
 */
SVec.multVec = function (vec1, vec2) {
  vec1.x *= vec2.x;
  vec1.y *= vec2.y;
  SVec.calcLen(vec1);
  return vec1;
};

/**
 * Adds the provided constants to the provided Vector
 */
SVec.addVecConst = function (vec, x, y) {
  vec.x += x;
  vec.y += y;
  SVec.calcLen(vec);
  return vec;
};

/**
 * Adds the contents of the second Vector to the first.
 */
SVec.addVecVec = function (vec, vec2) {
  return SVec.addVecConst(vec, vec2.x, vec2.y);
};

/**
 * Subtracts the contents of the second Vector from the first.
 */
SVec.subVecVec = function (vec, vec2) {
  return SVec.addVecConst(vec, -vec2.x, -vec2.y);
};

/**
 * Normalizes the provided Vector
 */
SVec.normVec = function (vec) {
  vec.x /= vec.len;
  vec.y /= vec.len;
  SVec.calcLen(vec);
  return vec;
};

/**
 * Rotates the provided Vector's values by the provided rotation in radians.
 */
SVec.rotVec = function (vec, rot) {
  if (!vec || rot === null) return;
  var currRot = Math.atan2(vec.y, vec.x);
  vec.x = Math.cos(currRot + rot * -1) * vec.len;
  vec.y = Math.sin(currRot + rot * -1) * vec.len;
  SVec.calcLen(vec);
  return vec;
};

/**
 * Returns a {x, y} pair object containing the interpolated value
 * between the provided Vectors at the designated alpha value.
 */
SVec.lerpVec = function (vecA, vecB, alpha) {
  return {
    x: vecA.x + (vecB.x - vecA.x) * alpha,
    y: vecA.y + (vecB.y - vecA.y) * alpha
  }
};

/**
 * Makes the vector its perpendicular
 */
SVec.perp = function (vec) {
  return SVec.setVec(vec, vec.y, -vec.x);
};

SVec.project = function () {
  // PVector axisNorm = axis.copy().normalize();
  // float min = entity.vertices.get(0).copy().add(entity.position).dot(axisNorm);
  // float max = min;
  // for (int i = 0; i < entity.vertices.size(); i++) {
  //   float proj = entity.vertices.get(i).copy().add(entity.position).dot(axisNorm);
  //   if (proj < min) {
  //     min = proj;
  //   }
  //
  //   if (proj > max) {
  //     max = proj;
  //   }
  // }
  // return new PVector(min, max);
};
