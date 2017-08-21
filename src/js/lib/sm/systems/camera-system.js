'use strict';

function CameraSystem() {
  this.name = 'camera';

  this.pre = function () {

  };

  this.processEntity = function (entity, state, delta, entities) {

  };

  this.post = function () {

  };

  var that = this;
  this.listeners = {
    updateCameraPos: function (payload) {
      that.act('updateCamPos', payload.entityID, payload);
    },
    zoomCamIn: function (payload) {
      that.act('zoomCamIn', payload.entityID, payload);
    },
    zoomCamOut: function (payload) {
      that.act('zoomCamOut', payload.entityID, payload);
    }
  };

  this.actions = {
    updateCamPos : {
      components: [ComponentType.camera],
      method: function ( components, payload ) {
        components.cam.conf.pos = cpyVec(payload.pos);
      }
    },

    zoomCamIn : {
      components: [ComponentType.camera],
      method: function ( components, payload ) {
        components.cam.conf.zoom += payload.amt
      }
    },

    zoomCamOut : {
      components: [ComponentType.camera],
      method: function ( components, payload ) {
        components.cam.conf.zoom -= payload.amt;
        if (components.cam.conf.zoom < 0) {
          components.cam.conf.zoom = 0;
        }
      }
    }
  };
}
