'use strict';

function AnimationSystem() {
	this.name = 'animation';

  this.processEntity = function (entity, state, delta, entities) {
    var anim = smx.anim(entity);
    var animMap = smx.aniMap(entity);
    if (anim) {
      anim.progress += delta;
      if (anim.progress > anim.length) {
        anim.progress = .1;
      }
    }

    if (animMap) {
      animMap.progress += delta;
      if (animMap.progress > animMap.animationMap.animations[animMap.activeState].length) {
        animMap.progress = .1;
      }
    }
  };

  var that = this;
  this.listeners = {
    setFlip: function (payload) {
      that.act('setAnimationFlip', payload.entityID, payload);
    }
  };

  this.actions = {
    setAnimationFlip : {
      components: [ComponentType.animation],
      method: function ( components, payload ) {
        components[ComponentType.animation].flipped = payload.flipped;
      }
    }
  };
}