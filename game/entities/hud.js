'use strict';

var Hud = function(game, player, x, y, scorefontKey, keyboardSpriteKey) {
    Phaser.Group.call(this, game);
    this.x = x;
    this.y = y;
    this.player = player;
    this.scale = {x: 0.02, y: 0.02};

    this.background = new Phaser.Sprite(this.game, 0, 0, 'hud-bg');
    this.add(this.background);
    this.scoreText = new Phaser.BitmapText(this.game, 172, 10, scorefontKey, '0', 100);
    this.add(this.scoreText);

    this.poisonIndicator = new Phaser.Sprite(this.game, 200, 150, 'poison-pill');
    this.poisonIndicator.anchor = {x:0.5, y:0.5};
    this.add(this.poisonIndicator);

    this.controllerDiagram = new Phaser.Sprite(this.game, 0, 300, 'controller-diagram');
    this.controllerDiagram.scale = {x: 0.5, y: 0.5};
    this.add(this.controllerDiagram);

    this.keyboardControls = new Phaser.Sprite(this.game, 0, 600, keyboardSpriteKey);
    this.keyboardControls.scale = {x: 0.5, y: 0.5};
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
        this.scoreText.x = 200 - numberOfDigits*30;
    }

    if (this.poisonIndicator && !this.player.hasPoisonPill) {
        this.poisonIndicator.destroy();
        this.poisonIndicator = null;
    }
};

module.exports = Hud;
