'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(1750, 1100, Phaser.AUTO, 'interactive-pacbot');

  var Orientation = require('./plugins/orientation');
  game.orientation = new Orientation();

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};