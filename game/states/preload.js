'use strict';

function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
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
  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('play');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;
