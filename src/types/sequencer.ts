import { Easing } from "bezier-easing";

class Sequencer {
  length: number; // MS
  position: number; // 0 - 1
  playing: boolean;
  direction: number;
  type: SequenceType;
  easing: Easing;
  easedPosition: number;

  constructor (length: number, type?: SequenceType, easing?: Easing) {
    this.length = length;
    this.position = 0;
    this.playing = false;
    this.direction = 1;
    this.type = type ? type : SequenceType.NORMAL;
    this.easing = easing;
  }

  start () {
    this.playing = true;
    this.position = 0;
    this.easedPosition = 0;
  }

  play () {
    this.playing = true;
  }

  stop () {
    this.playing = false;
    this.position = 0;
    this.easedPosition = 0;
  }

  pause () {
    this.playing = false;
  }

  update (delta) {
    let { length, position, direction, playing, type, easing } = this;
    if (length && playing) {
      this.position = ((length * position) + (delta * direction)) / length;
    }

    switch (type) {
      case SequenceType.NORMAL:
        if (position > 1) {
          this.position = 1;
          this.playing = false;
        }
        break;
      case SequenceType.PING_PONG:
        if (position < 0) {
          this.direction = -1 * direction;
          this.position = 0;
        }

        if (position > 1) {
          this.direction = -1 * direction;
          this.position = 1;
        }

        break;
      case SequenceType.LOOPING:
        if (position > 1) {
          this.position = 0;
        }
        break;
    }

    if (easing) {
      this.easedPosition = easing(position)
    }
  }
}

enum SequenceType {
  NORMAL,
  PING_PONG,
  LOOPING
}

export { SequenceType, Sequencer }