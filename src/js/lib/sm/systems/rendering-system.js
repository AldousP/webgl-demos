'use strict';

function RenderingSystem() {
  this.name = 'rendering';
  this.sheetNames = [];
  this.sheetFiles = [];

  this.loadData = function (file, state) {
    var assetLocation = state.assets + file;
    var rootLoc = assetLocation.substring(0, assetLocation.lastIndexOf('/'));
    var fileObj = {};
    fetch(assetLocation).then(function (resp) {return resp.json()})
    .then( function (data) {
      var imgAsset = rootLoc + '/' + data.meta.image;
      fileObj.frames = data.frames;
      var img = new Image();
      img.src = imgAsset;
      img.onload = function () {
        fileObj.img = img;
      }
    });
    this.sheetNames.push(file);
    this.sheetFiles.push(fileObj);
  };

  this.processEntity = function (entity, state, delta, entities, recursion) {
    var renderRoot = smx.renderRoot(entity);
    if (!renderRoot && !recursion) return 0;

    if (!recursion) {
      state.renderData = {
        positionSum : new Vector(),
        rotationSum : 0
      };
    } else {
      if (renderRoot && !this.errored) {
        this.errored = true;
        sm.log.error('Redundant RenderRoot component found on [' + entity.ID + ']' + entity.name + ' expect bugs.')
      }
    }

    var pos = smx.pos(entity);
    var poly = smx.poly(entity);
    var rot = smx.rot(entity);
    var col = smx.col(entity);
    var colB = smx.colB(entity);
    var clip = smx.clip(entity);
    var children = smx.children(entity);
    var cam = smx.cam(entity);
    var text = smx.text(entity);
    var anim = smx.anim(entity);
    var animMap = smx.aniMap(entity);
    var path = smx.path(entity);

    var priorPos = cpyVec(state.renderData.positionSum);
    var priorRot = state.renderData.rotationSum;

    if (rot) {
      state.renderData.rotationSum += rot;
    }

    if (pos) {
      addVecVec(state.renderData.positionSum,  rotVec(cpyVec(pos), priorRot ? priorRot : 0));
    }

    if (rot) {
      state.renderData.priorRot = rot;
    }

    if (col) {
      sm.gfx.setStrokeColor(col);
    }

    if (clip) {
      sm.gfx.clipPoly(poly, state.renderData.positionSum, state.renderData.rotationSum);
      sm.gfx.setFillColor(colB);
      sm.gfx.drawPolygon(poly, state.renderData.positionSum, true, state.renderData.rotationSum);
      if (sm.conf.debug.active && false) {
        sm.gfx.setStrokeColor(Color.white);
        sm.gfx.drawLine(-sm.gfx.width, 0, sm.gfx.width, 0);
        sm.gfx.drawLine(0, -sm.gfx.height, 0, sm.gfx.height);
      }
    }

    if (poly && pos) {
      sm.gfx.setStrokeColor(col);
      sm.gfx.setFillColor(colB);
      sm.gfx.drawPolygon(poly, state.renderData.positionSum, colB, state.renderData.rotationSum);
    }

    if (path) {
      var lastPt = null;
      path.pts.forEach(function (pt) {
        if (lastPt) {
          sm.gfx.drawLine(lastPt.x, lastPt.y, pt.x, pt.y);
        }
        lastPt = pt;
      });
    }

    if (children) {
      if (cam) {
        sm.gfx.preDraw();
        var scaleX = cam.zoom;
        var scaleY = cam.zoom;
        sm.ctx.setTransform(scaleX, 0, 0, scaleY, sm.gfx.width / 2, sm.gfx.height / 2, 320);
        sm.ctx.translate(-cam.pos.x, cam.pos.y);
        state.renderData.rotationSum += cam.rotation / DEG_RAD;
      }

      for (var i = 0; i < children.length; i++) {
        sm.gfx.preDraw();
        this.processEntity(entities[children[i]], state, delta, entities, true);
        sm.gfx.postDraw();
      }
    }
    var sheetIndex = -1;
    if (anim && pos) {
      sheetIndex = this.sheetNames.indexOf(anim.handle);
      if (sheetIndex < 0) {
        this.loadData(anim.handle, state);
      } else {
        this.drawAnimation(
            this.sheetFiles[sheetIndex],
            anim.progress,
            pos.x,
            pos.y,
            anim.width,
            anim.height,
            state.renderData.rotationSum,
            anim.flipped
        );
      }
    }

    if (animMap && pos) {
      var conf = animMap.animationMap;
      var animations = conf.animations;
      var activeAnimation = animations[animMap.activeState];
      var file = activeAnimation.file;

      sheetIndex = this.sheetNames.indexOf(file);
      if (sheetIndex < 0) {
        this.loadData(file, state);
      } else {
        this.drawAnimation(
            this.sheetFiles[sheetIndex],
            animMap.progress,
            pos.x,
            pos.y,
            activeAnimation.width,
            activeAnimation.height,
            state.renderData.rotationSum,
            activeAnimation.flipped
        );
      }
    }

    if (text && pos) {
      if (text.conf) {
        sm.gfx.setTextConf(text.conf);
      }
      sm.gfx.text(
          text.strings,
          state.renderData.positionSum.x,
          state.renderData.positionSum.y,
          state.renderData.rotationSum);
    }

    if (cam) {
      sm.gfx.postDraw();
      state.renderData.rotationSum -= cam.rotation / DEG_RAD;

    }

    if (pos) {
      state.renderData.positionSum = priorPos;
    }

    if (rot) {
      state.renderData.rotationSum = priorRot;
    }
  };

  this.drawAnimation = function (animationObject, progress, x, y, w, h, rot, flipped) {
    var frames = animationObject.frames;
    if (frames) {
      var image = animationObject.img;
      var frameCount = Object.keys(frames).length;
      var activeFrame = Math.floor(frameCount* progress);
      var frame = frames[activeFrame - 1];
      if (frame) {
        frame = frame.frame;
        sm.ctx.beginPath();
        // sm.gfx.preDraw();
        sm.gfx.setStrokeColor(Color.green);
        sm.ctx.rotate(rot);
        sm.ctx.translate(x, -y);


        var skewX = w / frame.w;
        var skewY = h / frame.h;
        sm.ctx.scale(skewX, skewY);
        sm.ctx.rect(
            -frame.w / 2,
            -frame.h / 2,
            frame.w,
            frame.h
        );
        sm.ctx.clip();
        sm.gfx.drawImage(
            image,
            -frame.x - frame.w / 2,
            -frame.y - frame.h / 2,
            frame.w, frame.h,
            flipped
        );
        // sm.gfx.postDraw();
        sm.ctx.closePath();
      }
    }
  }
}