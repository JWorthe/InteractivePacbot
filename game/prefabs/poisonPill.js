'use strict';

var PoisonPill = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'poison-pill', frame);
  this.scale = {x: 0.01, y: 0.01};
  this.anchor = {x: 0.5, y: 0.5};

  this.score = 1;
};

PoisonPill.prototype = Object.create(Phaser.Sprite.prototype);
PoisonPill.prototype.constructor = PoisonPill;

PoisonPill.prototype.getBounds = function() {
  return new Phaser.Rectangle(this.x, this.y, 0.2, 0.2);
};

module.exports = PoisonPill;
