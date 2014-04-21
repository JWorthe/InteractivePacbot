'use strict';

var Wall = require('../prefabs/wall');
var Player = require('../prefabs/player');

function Play() {}

Play.prototype = {
  preload: function() {
  },
  create: function() {
    this.createWalls();
//    this.world.scale = {x:0.5, y:0.5};
    this.playerA = new Player(this.game, 100, 200, 'player-a', 0, {
      up: Phaser.Keyboard.UP,
      down: Phaser.Keyboard.DOWN,
      left: Phaser.Keyboard.LEFT,
      right: Phaser.Keyboard.RIGHT
    });
    this.game.add.existing(this.playerA);
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
