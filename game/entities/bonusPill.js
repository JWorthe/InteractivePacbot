'use strict';

var EntityBase = require('../entities/entityBase');

var BonusPill = function(game, x, y) {
  EntityBase.call(this, game, x, y, 'bonus-pill');

  this.score = 10;
};

BonusPill.prototype = Object.create(EntityBase.prototype);
BonusPill.prototype.constructor = BonusPill;

module.exports = BonusPill;
