'use strict';

var EntityBase = require('../entities/entityBase');

var Wall = function(game, x, y) {
  EntityBase.call(this, game, x, y, 'wall');
};

Wall.prototype = Object.create(EntityBase.prototype);
Wall.prototype.constructor = Wall;

module.exports = Wall;
