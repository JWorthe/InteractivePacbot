'use strict';

window.onload = function () {
  var game = new Phaser.Game(1750, 1100, Phaser.AUTO, 'interactive-pacbot');

  game.state.add('boot', require('./states/boot'));
  game.state.add('load', require('./states/load'));
  game.state.add('play', require('./states/play'));
  

  game.state.start('boot');
};