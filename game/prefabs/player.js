'use strict';

var Player = function(game, x, y, key, frame, soundKey) {
  var player = this;

  Phaser.Sprite.call(this, game, x, y, key, frame);
  this.animations.add('active', [0]);
  this.animations.add('waiting', [1]);

  this.baseKey = key;
  this.moving = false;
  this.scale = {x: 0.01, y: 0.01};
  this.anchor = {x: 0.5, y: 0.5};

  this.game.physics.arcade.enableBody(this);

  this.score = 0;
  this.maxScore = 1;
  this.isMyTurn = false;
  this.animIsMyTurn = true;

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
  }
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
