'use strict';

var Player = function(game, x, y, key, frame, soundKey) {
  var player = this;

  Phaser.Sprite.call(this, game, x, y, key, frame);
  this.animations.add('active', [0]);
  this.animations.add('waiting', [1]);
  this.animations.add('activePoison', [2]);
  this.animations.add('waitingPoison', [3]);

  this.baseKey = key;
  this.moving = false;
  this.scale = {x: 0.01, y: 0.01};
  this.anchor = {x: 0.5, y: 0.5};

  this.score = 0;
  this.maxScore = 1;
  this.isMyTurn = false;

  this.currentAnimation = {
    isMyTurn: true,
    poisonPillActive: false
  }

  this.hasPoisonPill = true;
  this.poisonPillActive = false;
  this.lastTween = null;

  this.scoreSound = game.sound.add(soundKey);


  //BEWARE! HORRIBLE HACK AHEAD!
  //Intercepts the call to get a new buffer so that we can set the playbackRate.
  var audioContext = this.scoreSound.context;
  var childContext = Object.create(audioContext);
  this.scoreSound.context = childContext;

  childContext.createBufferSource = function() {
    var source = audioContext.createBufferSource();
    var scoreFraction = player.score / player.maxScore;
    source.playbackRate.value = 0.75 + scoreFraction*6;
    return source;
  };
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  if (this.isMyTurn !== this.currentAnimation.isMyTurn || this.poisonPillActive !== this.currentAnimation.poisonPillActive) {
    this.currentAnimation.isMyTurn = this.isMyTurn;
    this.currentAnimation.poisonPillActive = this.poisonPillActive;

    var animation;
    if (!this.currentAnimation.isMyTurn) {
      if (!this.currentAnimation.poisonPillActive) {
        animation = 'waiting';
      }
      else {
        animation = 'waitingPoison'
      }
    }
    else {
      if (!this.currentAnimation.poisonPillActive) {
        animation = 'active';
      }
      else {
        animation = 'activePoison'
      }
    }
    this.play(animation);
  }
};

Player.prototype.move = function(newX, newY, callback, callbackContext) {
  this.moving = true;

  var tween = this.game.add.tween(this).to({x: newX, y: newY}, 500);
  tween.onComplete.add(callback, callbackContext);
  tween.onComplete.add(this.finishMovement, this);

  this.lastTween = tween;

  tween.start();
};

Player.prototype.multistepMove = function(moveX, moveY, teleportX, teleportY, finalX, finalY, callback, callbackContext) {
  this.moving = true;

  var firstTween = this.game.add.tween(this).to({x: moveX, y: moveY}, 500);

  firstTween.onComplete.add(function() {
    this.teleport(teleportX, teleportY);
    this.move(finalX, finalY, callback, callbackContext);
  }, this);

  firstTween.start();
}

Player.prototype.teleport = function(newX, newY) {
  this.x = newX;
  this.y = newY;
}

Player.prototype.finishMovement = function() {
  this.moving = false;
  this.lastTween = null;
};

Player.prototype.getBounds = function() {
  return new Phaser.Rectangle(this.x, this.y, 0.2, 0.2);
};

module.exports = Player;
