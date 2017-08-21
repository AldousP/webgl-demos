'use strict';

function BackgroundSystem() {
	this.name = 'background';

	this.pre = function (state) {
		sm.gfx.clear(state.bgColor);
		if (sm.conf.debug.active) {
      sm.gfx.setStrokeColor(Color.white);
      sm.gfx.drawLine(-sm.gfx.width, 0, sm.gfx.width, 0);
      sm.gfx.drawLine(0, -sm.gfx.height, 0, sm.gfx.height);
    }
	};
}