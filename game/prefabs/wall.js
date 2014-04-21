'use strict';

var Wall = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'wall', frame);

  // initialize your prefab here
};

Wall.prototype = Object.create(Phaser.Sprite.prototype);
Wall.prototype.constructor = Wall;

module.exports = Wall;