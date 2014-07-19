'use strict';

var Player = function(game, x, y, key, frame) {
  Phaser.Sprite.call(this, game, x, y, key, frame);
  this.animations.add('active', [0]);
  this.animations.add('waiting', [1]);

  this.baseKey = key;
  this.moving = false;
  this.scale = {x: 0.01, y: 0.01};
  this.anchor = {x: 0.5, y: 0.5};
  
  this.game.physics.arcade.enableBody(this);

  this.score = 0;
  this.isMyTurn = false;
  this.animIsMyTurn = true;
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  if (this.isMyTurn !== this.animIsMyTurn) {
    this.animIsMyTurn = this.isMyTurn;
    this.play(this.animIsMyTurn ? 'active' : 'waiting');
  }
};

Player.prototype.move = function(newX, newY) {
  this.moving = true;
  var tween = this.game.add.tween(this).to({x: newX, y: newY}, 500);
  tween.onComplete.add(this.finishMovement, this);
  tween.start();
};

Player.prototype.finishMovement = function() {
  this.moving = false;
};

module.exports = Player;
