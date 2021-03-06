'use strict';

function Load() {
  this.loadingSprite = null;
}

Load.prototype = {
  preload: function() {
    this.loadingSprite = this.add.sprite(this.game.width/2,this.game.height/2, 'preloader');
    this.loadingSprite.anchor.setTo(0.5, 0.5);
    this.load.setPreloadSprite(this.loadingSprite);


    this.load.image('wall', 'assets/images/wall.svg');
    this.load.spritesheet('player-a', 'assets/images/player-a-spritesheet.svg', 100, 100);
    this.load.spritesheet('player-b', 'assets/images/player-b-spritesheet.svg', 100, 100);
    this.load.image('pill', 'assets/images/pill.svg');
    this.load.image('bonus-pill', 'assets/images/bonus-pill.svg');
    this.load.image('poison-pill', 'assets/images/poison-pill.svg');

    this.load.bitmapFont('spaced-scorefont-a', 'assets/fonts/scorefont-a.png', 'assets/fonts/scorefont.fnt', undefined, 10);
    this.load.bitmapFont('scorefont-a', 'assets/fonts/scorefont-a.png', 'assets/fonts/scorefont.fnt');
    this.load.audio('omSound', 'assets/audio/om.ogg', true);

    this.load.bitmapFont('spaced-scorefont-b', 'assets/fonts/scorefont-b.png', 'assets/fonts/scorefont.fnt', undefined, 10);
    this.load.bitmapFont('scorefont-b', 'assets/fonts/scorefont-b.png', 'assets/fonts/scorefont.fnt');
    this.load.audio('nomSound', 'assets/audio/nom.ogg', true);

    this.load.audio('owSound', 'assets/audio/ow.ogg', true);

    this.load.text('level', 'assets/levels/maze.lvl');

    this.load.image('hud-bg', 'assets/images/hud-bg.svg');
    this.load.image('controller-diagram', 'assets/images/controller-diagram.svg');
    this.load.image('keys-a', 'assets/images/keyboard-control-a.svg');
    this.load.image('keys-b', 'assets/images/keyboard-control-b.svg');
  },
  create: function() {
    this.game.state.start('play');
  }
};

module.exports = Load;
