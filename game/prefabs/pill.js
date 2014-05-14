'use strict';

var Pill = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'pill', frame);
  this.scale = {x: 0.01, y: 0.01};
  this.anchor = {x: 0.5, y: 0.5};
  // initialize your prefab here
  
};

Pill.prototype = Object.create(Phaser.Sprite.prototype);
Pill.prototype.constructor = Pill;

Pill.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Pill;
