'use strict';

var EntityBase = function(game, x, y, key) {
  Phaser.Sprite.call(this, game, x, y, key);
  this.scale = {x: 0.01, y: 0.01};
  this.anchor = {x: 0.5, y: 0.5};
};
EntityBase.prototype = Object.create(Phaser.Sprite.prototype);

EntityBase.prototype.getBounds = function() {
  return new Phaser.Rectangle(this.x, this.y, 0.5, 0.5);
};

module.exports = EntityBase;