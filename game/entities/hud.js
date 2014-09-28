'use strict';

var Hud = function(game, player, x, y, scorefontKey, keyboardSpriteKey) {
  Phaser.Group.call(this, game);
  this.x = x;
  this.y = y;
  this.player = player;
  this.scale = {x: 0.01, y: 0.01};

  this.background = new Phaser.Sprite(this.game, 0, 0, 'hud-bg');
  this.add(this.background);
  this.scoreText = new Phaser.BitmapText(this.game, 344, 20, scorefontKey, '0', 200);
  this.add(this.scoreText);

  this.poisonIndicator = new Phaser.Sprite(this.game, 400, 300, 'poison-pill');
  this.poisonIndicator.scale = {x: 2, y: 2}; //bigger than an actual poison pill
  this.poisonIndicator.anchor = {x: 0.5, y: 0.5};
  this.add(this.poisonIndicator);

  this.controllerDiagram = new Phaser.Sprite(this.game, 0, 600, 'controller-diagram');
  this.add(this.controllerDiagram);

  this.keyboardControls = new Phaser.Sprite(this.game, 0, 1200, keyboardSpriteKey);
  this.add(this.keyboardControls);

  this.currentScore = 0;
};

Hud.prototype = Object.create(Phaser.Group.prototype);
Hud.prototype.constructor = Hud;

Hud.prototype.update = function() {
  if (this.currentScore !== this.player.score) {
    this.currentScore = this.player.score;
    this.scoreText.setText(this.player.score+'');

    var numberOfDigits = Math.floor(Math.log(this.currentScore)/Math.log(10))+1;
    this.scoreText.x = 400 - numberOfDigits*60;
  }

  if (this.poisonIndicator && !this.player.hasPoisonPill) {
    this.poisonIndicator.destroy();
    this.poisonIndicator = null;
  }
};

module.exports = Hud;
