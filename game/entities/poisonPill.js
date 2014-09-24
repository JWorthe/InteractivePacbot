'use strict';

var EntityBase = require('../entities/entityBase');

var PoisonPill = function(game, x, y) {
  EntityBase.call(this, game, x, y, 'poison-pill');
};

PoisonPill.prototype = Object.create(EntityBase.prototype);
PoisonPill.prototype.constructor = PoisonPill;

module.exports = PoisonPill;
