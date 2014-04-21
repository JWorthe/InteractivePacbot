'use strict';

var Wall = require('../prefabs/wall');

function Play() {}

Play.prototype = {
  preload: function() {
  },
  create: function() {
    this.createWalls();
//    this.world.scale = {x:0.5, y:0.5};
  },
  update: function() {
  },
  createWalls: function() {
    this.walls = this.game.add.group();
    this.walls.add(new Wall(this.game, 0,0));
    this.walls.add(new Wall(this.game, 100,0));
    this.walls.add(new Wall(this.game, 200,0));
    this.walls.add(new Wall(this.game, 300,0));
    this.walls.add(new Wall(this.game, 400,0));
    this.walls.add(new Wall(this.game, 500,0));
    this.walls.add(new Wall(this.game, 600,0));
    this.walls.add(new Wall(this.game, 700,0));

    this.walls.add(new Wall(this.game, 0,100));
    this.walls.add(new Wall(this.game, 700,100));

    this.walls.add(new Wall(this.game, 0,200));
    this.walls.add(new Wall(this.game, 200,200));
    this.walls.add(new Wall(this.game, 500,200));
    this.walls.add(new Wall(this.game, 700,200));

    this.walls.add(new Wall(this.game, 0,300));
    this.walls.add(new Wall(this.game, 200,300));
    this.walls.add(new Wall(this.game, 500,300));
    this.walls.add(new Wall(this.game, 700,300));

    this.walls.add(new Wall(this.game, 0,400));
    this.walls.add(new Wall(this.game, 700,400));

    this.walls.add(new Wall(this.game, 0,500));
    this.walls.add(new Wall(this.game, 100,500));
    this.walls.add(new Wall(this.game, 200,500));
    this.walls.add(new Wall(this.game, 300,500));
    this.walls.add(new Wall(this.game, 400,500));
    this.walls.add(new Wall(this.game, 500,500));
    this.walls.add(new Wall(this.game, 600,500));
    this.walls.add(new Wall(this.game, 700,500));
  }
};

module.exports = Play;
