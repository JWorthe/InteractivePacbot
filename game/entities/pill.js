'use strict';

var EntityBase = require('../entities/entityBase');

var Pill = function(game, x, y) {
  EntityBase.call(this, game, x, y, 'pill');

  this.score = 1;
};

Pill.prototype = Object.create(EntityBase.prototype);
Pill.prototype.constructor = Pill;

module.exports = Pill;
