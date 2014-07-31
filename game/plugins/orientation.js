'use strict';

var Orientation = function() {
	var self = this;

	self.onLeft = new Phaser.Signal();
	self.onRight = new Phaser.Signal();
	self.onUp = new Phaser.Signal();
	self.onDown = new Phaser.Signal();

	self.previousEvent = {
		gamma: 0,
		beta: 0
	};

	self.threshhold = 15;

	if (window.DeviceOrientationEvent) {
		window.addEventListener('deviceorientation', function(eventData) {
			if (eventData.gamma < -self.threshhold && self.previousEvent.gamma >= -self.threshhold) {
				self.onLeft.dispatch();
			}
			if (eventData.gamma > self.threshhold && self.previousEvent.gamma <= self.threshhold) {
				self.onRight.dispatch();
			}
			if (eventData.beta < -self.threshhold && self.previousEvent.beta >= -self.threshhold) {
				self.onUp.dispatch();
			}
			if (eventData.beta > self.threshhold && self.previousEvent.beta <= self.threshhold) {
				self.onDown.dispatch();
			}

			self.previousEvent.gamma = eventData.gamma;
			self.previousEvent.beta = eventData.beta;
		});
	}
};


module.exports = Orientation;
