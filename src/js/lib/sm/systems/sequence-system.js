'use strict';

var SequenceType = {
  NORMAL: 0,
  PING_PONG: 1,
  REVERSED: 2
};

var easers = {
  squared: function (val) {
    return Math.pow(val, 2);
  }
};

function SequenceSystem(sequenceActions) {
	this.name = 'sequencing';
	this.sequenceActions = sequenceActions ? sequenceActions : {};
	
	this.pre = function () {

	};

  /**
   * Iterates over every entity with a sequence component and
   * updates the current alpha of the sequence based on user-defined
   * fields.
   */
	this.processEntity = function (entity, state, delta, entities) {
    var seq = smx.sequence(entity);
    if (seq) {
      var that = this;
      seq.forEach(function (sequence) {
        var actions = that.sequenceActions[sequence.name];
        if (!actions) {
          actions = {};
        }

        if (!sequence.dir) {
          sequence.dir = 1;
        }

        if (!sequence.type) {
          sequence.type = SequenceType.NORMAL;
        }
        sequence.pos = ((sequence.length * sequence.pos) + delta * sequence.dir) / sequence.length;

        if (sequence.pos > 1) {
          if (actions && actions.complete ) {
            actions.complete(entity)
          }

          switch (sequence.type) {
            case SequenceType.NORMAL:
              sequence.pos -= 1;
              break;
            case SequenceType.PING_PONG:
              sequence.pos = 1 - (sequence.pos - 1);
              sequence.dir = sequence.dir ? sequence.dir * -1 : -1
          }
        }

        if (sequence.pos < 0) {
          switch (sequence.type) {
            case SequenceType.PING_PONG:
              if (actions && actions.complete ) {
                actions.complete(entity)
              }
              sequence.pos = Math.abs(sequence.pos);
              sequence.dir = sequence.dir ? sequence.dir * -1 : -1
          }
        }

        var result = sequence.pos;
        if (sequence.easing && easers[sequence.easing]) {
          result = easers[sequence.easing](sequence.pos);
        }

        if (actions && actions.update ) {
          actions.update(entity, result)
        }
      });
	  }
  };

	this.post = function () {

	};

	this.handlers = {

  };

}
