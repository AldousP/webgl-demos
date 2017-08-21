'use strict';

var SPoly = {
  /**
   * Conversion constant for degrees-to-radians.
   */
  DEG_RAD: 57.2958,

  tmpA: new SVec.Vector(),
  tmpB: new SVec.Vector(),
  tmpC: new SVec.Vector(),
  tmpD: new SVec.Vector(),

  /**
   * Polygon class. Pts describing local position.
   * @param pts of the Polygon
   * @constructor
   */
  Polygon: function (pts) {
    this.pts = pts ? pts : [];
  },

  /**
   * Returns true if the provided shapes, at the provided locations overlap.
   * @param polyA
   * @param polyB
   * @param posA
   * @param posB
   * @returns {boolean} if the Polygons overlap
   */
  overlaps: function (polyA, polyB, posA, posB) {
    var polyAxes = [];
    var colliderAxes = [];
    var polyOverlaps = [];

    for (var i = 0; i < polyA.pts.length; i++) {
      SVec.setVecVec(this.tmpC, polyA.pts[i]); // World values (world + local)
      SVec.setVecVec(this.tmpD, polyA.pts[ SMath.wrapIndex(i + 1, polyA.pts.length) ]);

      SVec.addVecVec(this.tmpC, posA);
      SVec.addVecVec(this.tmpD, posA);

      SVec.setVecVec(this.tmpA, this.tmpC);
      SVec.subVecVec(this.tmpA, this.tmpD); // edge
      SVec.setVec(this.tmpB, -this.tmpA.y, this.tmpA.x); // normal
      SVec.normVec(this.tmpB);
      polyAxes.push(SVec.cpyVec(this.tmpB));
    }

    for (i = 0; i < polyB.pts.length; i++) {
      SVec.setVecVec(this.tmpC, polyB.pts[i]); // World values (world + local)
      SVec.setVecVec(this.tmpD, polyB.pts[ SMath.wrapIndex(i + 1, polyB.pts.length) ]);

      SVec.addVecVec(this.tmpC, posB);
      SVec.addVecVec(this.tmpD, posB);

      SVec.setVecVec(this.tmpA, this.tmpC);
      SVec.subVecVec(this.tmpA, this.tmpD); // edge
      SVec.setVec(this.tmpB, -this.tmpA.y, this.tmpA.x); // normal
      SVec.normVec(this.tmpB);
      colliderAxes.push(SVec.cpyVec(this.tmpB));
    }


    // for (var axe in polyAxes) {
    //   this.tmpA.set(0, 0);
    //   var proj1 = project(polygon, axe);
    //   var proj2 = project(collider, axe);
    //   var overlap = SolMath.overlap(proj1.x, proj1.y, proj2.x, proj2.y);
    //   polyOverlaps.add(new PVector().set(axe).setMag(overlap.y - overlap.x));
    // }
    //
    // for (var axe in colliderAxes) {
    //   tmp1.set(0, 0);
    //   var proj1 = project(polygon, axe);
    //   var proj2 = project(collider, axe);
    //   var overlap = SolMath.overlap(proj1.x, proj1.y, proj2.x, proj2.y);
    //   polyOverlaps.add(new PVector().set(axe).setMag(overlap.y - overlap.x));
    // }
    //
    // if (polyOverlaps.size() > 0) {
    //   var shortest = polyOverlaps.get(0);
    //   for (var polyOverlap in polyOverlaps) {
    //     if (polyOverlap.mag() < shortest.mag()) {
    //       shortest = polyOverlap;
    //     }
    //   }
    //   polygon.position.add(shortest.mult(-1));
    // }
    return false;
  },

  /**
   * Generate a new Polygon
   * @param vertCount the amount of vertices in the polygon
   * @param radius the radius of the polygon
   * @param startingDegree beginning rotation in radians
   * @param scaleX horizontal scaling
   * @param scaleY vertical scaling
   */
  generatePolygon: function (vertCount, radius, startingDegree, scaleX, scaleY) {
    startingDegree = startingDegree ? startingDegree : 0;
    var circDiv = (2 * Math.PI)  / vertCount;
    var polygon = new SPoly.Polygon();
    for (var i = 0; i < vertCount; i++ ) {
      polygon.pts.push(
          new SVec.Vector (
              (Math.cos(startingDegree + circDiv * i) * radius) * (scaleX ? scaleX : 1),
              (Math.sin(startingDegree + circDiv * i) * radius) * (scaleY ? scaleY : 1)
          )
      )
    }
    return polygon;
  },

  /**
   * Convenience method for generating a square for a given width.
   * @param width of the square
   * @returns a Polygon with four vertices at the designated width.
   */
  polySquare: function (width) {
    return this.generatePolygon(4, width / 2, 45 / this.DEG_RAD, 1.25, 1.2)
  },

  /**
   * Convenience method for generating a circle with the given radius.
   * @param radius of the circle
   * @returns a Polygon with thirty-two vertices and the designated radius.
   */
  polyCircle: function (radius) {
    return this.generatePolygon(32, radius, 45 / this.DEG_RAD, 1.25, 1.2)
  }
};