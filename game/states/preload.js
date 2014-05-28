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
    this.load.image('player-a', 'assets/images/player-a.svg');
    this.load.image('player-b', 'assets/images/player-b.svg');
    this.load.image('pill', 'assets/images/pill.svg');

    this.load.bitmapFont('spaced-scorefont', 'assets/fonts/scorefont.png', 'assets/fonts/scorefont.fnt', undefined, 10);
    this.load.bitmapFont('scorefont', 'assets/fonts/scorefont.png', 'assets/fonts/scorefont.fnt');
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
