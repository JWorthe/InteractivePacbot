'use strict';

var Pill = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'pill', frame);
  this.scale = {x: 0.01, y: 0.01};
  this.anchor = {x: 0.5, y: 0.5};

  this.score = 1;
};

Pill.prototype = Object.create(Phaser.Sprite.prototype);
Pill.prototype.constructor = Pill;

Pill.prototype.getBounds = function() {
  return new Phaser.Rectangle(this.x, this.y, 0.2, 0.2);
};

module.exports = Pill;
