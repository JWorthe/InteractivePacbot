'use strict';

var Player = function(game, x, y, key, frame) {
  Phaser.Sprite.call(this, game, x, y, key, frame);

  this.moving = false;
  this.scale = {x: 0.01, y: 0.01};
  this.anchor = {x: 0.5, y: 0.5};
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {  
};

Player.prototype.move = function(newX, newY) {
  if (this.moving) {
    return;
  }

  this.moving = true;
  var tween = this.game.add.tween(this).to({x: newX, y: newY}, 500);
  tween.onComplete.add(this.finishMovement, this);
  tween.start();
};

Player.prototype.finishMovement = function() {
  this.moving = false;
};

module.exports = Player;
