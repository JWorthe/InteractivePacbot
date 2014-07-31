'use strict';

var Orientation = function() {
	this.onLeft = new Phaser.Signal();
	this.onRight = new Phaser.Signal();
	this.onUp = new Phaser.Signal();
	this.onDown = new Phaser.Signal();

	var previousEvent = {
		gamma: 0,
		beta: 0
	};

	var threshhold = 15;

	var processOrientationEvent = function(event) {
		if (event.gamma < -threshhold && previousEvent.gamma >= -threshhold) {
			this.onLeft.dispatch();
		}
		if (event.gamma > threshhold && previousEvent.gamma <= threshhold) {
			this.onRight.dispatch();
		}
		if (event.beta < -threshhold && previousEvent.beta >= -threshhold) {
			this.onUp.dispatch();
		}
		if (event.beta > threshhold && previousEvent.beta <= threshhold) {
			this.onDown.dispatch();
		}


		previousEvent = event;
	}

	window.addEventListener('deviceorientation', processOrientationEvent);
}


module.exports = Orientation;
