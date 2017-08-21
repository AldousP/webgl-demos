'use strict';

function PathSystem() {
	this.name = 'path';
	this.alpha = 0;

	this.pre = function () {

	};

	this.processEntity = function (entity, state, delta, entities) {
    var path = smx.path(entity);

    if (path) {
      var alpha = path.alpha;
      var ptLen = path.pts.length;
      var segmentCt = ptLen - 1;
      var localAlpha = alpha * segmentCt;
      var segmentIndex = Math.floor(localAlpha);
      localAlpha -= segmentIndex;
      if (segmentIndex > ptLen - 1) {
        segmentIndex = ptLen - 1;
      }

      var ptA = path.pts[segmentIndex];
      var ptB = path.pts[segmentIndex + 1];

      if (ptA && ptB) {
        var result = lerpVec(ptA, ptB, localAlpha);
        this.actions.updatePath(entity, new Vector(result.x, result.y));
      }
    }
  };

	this.post = function () {

	};

	this.handlers = {

  };

  this.actions = {
    updatePath: function (entity, pos) {
      var path = smx.path(entity);
      path.pos = pos;
    }
	};
}
