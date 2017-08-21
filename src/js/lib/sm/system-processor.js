'use strict';

function SystemProcessor(handler) {
  if (!handler) sm.log.error('No handler provided. ', 'sysproc');

  this.systems = [];
  this.entityMapper = handler;
  this.systemNameList = [];
  this.delta = 0;

  this.fireEvent = function (event, payload) {
    var that = this;
    payload.eventName = event;
    this.systems.forEach(function (system) {
      if (system.event) {
        system.event(payload, that.entityMapper.entities, that.delta);
      }

      var listeners = system.listeners;
      if (listeners && listeners[event]) {
        listeners[event](payload, that.entityMapper.entities, that.delta);
      }
    })
  };

  this.processEntities = function (delta) {
    this.delta = delta;
    var state = this.state;
    if (state && !state.systemStates) {
      state.systemStates = {};
    }

    var systemStates = state.systemStates;
    var entities = this.entityMapper.entities;
  	this.systems.forEach(function (system) {
  	  if (!systemStates[system.name]) {
  	    systemStates[system.name] = {};
      }

  		if (system.pre) {
				system.pre(systemStates[system.name]);
			}
		});

  	var that = this;
    that.systems.forEach(function (system) {
      system.fireEvent = that.fireEvent.bind(that);
      for (var i = 0; i < entities.length; i ++) {
        if (system.processEntity) {
          system.processEntity(
              entities[i],
              systemStates[system.name],
              delta,
              entities
          );
        }
      }
    });

		this.systems.forEach(function (system) {
			if (system.post) {
        system.post(systemStates[system.name]);
			}
		});
  };

  this.addSystem = function (system) {
    system.processor = this;

    if (this.systemNameList.indexOf(system.name) !== -1) {
      sm.log.error('Duplicate system name declaration! : ' +  system.name, 'sysproc');
    }

    system.act = function (action, id, payload) {
      var actions = Object.keys(system.actions);
      actions.forEach(function ( actionName ) {
        if (actionName === action) {
          var actionInstance = system.actions[actionName];
          var entity = system.processor.entityMapper.entities[id];
          var components = {};
          actionInstance.components.forEach(function ( component ) {
            if (entity.components && entity.components[component]) {
              components[component] = entity.components[component];
            }
          });

          if (Object.keys(components).length > 0) {
            actionInstance.method(components, payload);
          }
        }
      });
    };

    this.systemNameList.push(system.name);
    this.systems.push(system);
    if (system.init) {
      var state = this.state.systemStates[system.name];

      if (!state) {
        state = {};
      }

      system.init(state);
      this.state.systemStates[system.name] = state;
    }
  };
}