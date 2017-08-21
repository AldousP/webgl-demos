'use strict';

function StateMachineSystem(machineMapping) {
	this.name = 'statemachine';
	this.machineMapping = machineMapping;
	
	this.pre = function () {

	};

	this.queuedTransitions = [];

	this.processEntity = function (entity, state, delta, entities) {



	};
}
