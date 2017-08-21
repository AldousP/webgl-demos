'use strict';

function PhysicsSystem() {
	this.name = 'physics';
	
	this.pre = function () {

	};

	this.processEntity = function (entity, state, delta) {

    var vel = entity.components[ComponentType.velocity];
		if (vel) {
      vel = entity.components[ComponentType.velocity].velocity;
      addVecVec(entity.components[ComponentType.position].position, sclVec(cpyVec(vel), delta));
      if (entity.components[ComponentType.acceleration]) {
        var accl = entity.components[ComponentType.acceleration].acceleration;
        addVecVec(vel, sclVec(cpyVec(accl), delta));
      }
		}
	};

	this.post = function () {

	}
}
