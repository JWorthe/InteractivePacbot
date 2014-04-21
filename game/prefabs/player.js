'use strict';

var Player = function(game, x, y, key, frame, controls) {
  Phaser.Sprite.call(this, game, x, y, key, frame);

  this.moving = false;

  this.game.input.keyboard.addKeyCapture([
    controls.up,
    controls.down,
    controls.left,
    controls.right
  ]);

  this.game.input.keyboard.addKey(controls.up).onDown.add(this.moveUp, this);
  this.game.input.keyboard.addKey(controls.down).onDown.add(this.moveDown, this);
  this.game.input.keyboard.addKey(controls.left).onDown.add(this.moveLeft, this);
  this.game.input.keyboard.addKey(controls.right).onDown.add(this.moveRight, this);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {  
};

Player.prototype.moveUp = function() {
  this.move(0, -100);
};
Player.prototype.moveDown = function() {
  this.move(0, 100);
};
Player.prototype.moveLeft = function() {
  this.move(-100, 0);
};
Player.prototype.moveRight = function() {
  this.move(100, 0);
};

Player.prototype.move = function(deltaX, deltaY) {
  if (this.moving) {
    return;
  }

  var newX = this.x + deltaX;
  var newY = this.y + deltaY;

  if (!this.canMoveToNewLocation(newX, newY)) {
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

Player.prototype.canMoveToNewLocation = function(newX, newY) {
    return true;
};

module.exports = Player;
