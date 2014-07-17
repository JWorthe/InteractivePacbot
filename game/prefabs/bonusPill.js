'use strict';

var BonusPill = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'bonus-pill', frame);
  this.scale = {x: 0.01, y: 0.01};
  this.anchor = {x: 0.5, y: 0.5};
  
  this.game.physics.arcade.enableBody(this);
  this.score = 10;
};

BonusPill.prototype = Object.create(Phaser.Sprite.prototype);
BonusPill.prototype.constructor = BonusPill;

module.exports = BonusPill;
