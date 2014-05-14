'use strict';

var Wall = require('../prefabs/wall');
var Player = require('../prefabs/player');
var Pill = require('../prefabs/pill');

function Play() {}

Play.prototype = {
  addToMap: function(x, y) {
    if (!this.map) {
      this.map = [];
    }
    if (!this.map[x]) {
      this.map[x] = [];
    }

    this.map[x][y] = true;
  },
  removeFromMap: function(x,y) {
    if (!this.map || !this.map[x]) {
      return;
    }
    this.map[x][y] = false;
  },
  checkMap: function(x,y) {
    if (!this.map || !this.map[x]) {
      return false;
    }
    return this.map[x][y];
  },
  preload: function() {
  },
  create: function() {
    this.createWalls();
    this.createPills();

    this.world.scale = {x:100, y:100};
    this.world.bounds = {x: -50, y:-50, width: this.game.width, height: this.game.height};
    this.world.camera.setBoundsToWorld();

    this.playerA = new Player(this.game, 1, 2, 'player-a', 0);
    this.game.add.existing(this.playerA);
    this.addPlayerControls();

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
  },
  update: function() {
    this.game.physics.arcade.overlap(this.playerA, this.pills, this.playerPillCollision, null, this);
  },
  createWalls: function() {
    this.walls = this.game.add.group();

    this.walls.add(new Wall(this.game, 0,0));
    this.walls.add(new Wall(this.game, 1,0));
    this.walls.add(new Wall(this.game, 2,0));
    this.walls.add(new Wall(this.game, 3,0));
    this.walls.add(new Wall(this.game, 4,0));
    this.walls.add(new Wall(this.game, 5,0));
    this.walls.add(new Wall(this.game, 6,0));
    this.walls.add(new Wall(this.game, 7,0));

    this.walls.add(new Wall(this.game, 0,1));
    this.walls.add(new Wall(this.game, 7,1));

    this.walls.add(new Wall(this.game, 0,2));
    this.walls.add(new Wall(this.game, 2,2));
    this.walls.add(new Wall(this.game, 5,2));
    this.walls.add(new Wall(this.game, 7,2));

    this.walls.add(new Wall(this.game, 0,3));
    this.walls.add(new Wall(this.game, 2,3));
    this.walls.add(new Wall(this.game, 5,3));
    this.walls.add(new Wall(this.game, 7,3));

    this.walls.add(new Wall(this.game, 0,4));
    this.walls.add(new Wall(this.game, 7,4));

    this.walls.add(new Wall(this.game, 0,5));
    this.walls.add(new Wall(this.game, 1,5));
    this.walls.add(new Wall(this.game, 2,5));
    this.walls.add(new Wall(this.game, 3,5));
    this.walls.add(new Wall(this.game, 4,5));
    this.walls.add(new Wall(this.game, 5,5));
    this.walls.add(new Wall(this.game, 6,5));
    this.walls.add(new Wall(this.game, 7,5));

    this.walls.forEach(function(wall) {
      this.addToMap(wall.x, wall.y);
    }, this);
  },
  createPills: function() {
    this.pills = this.game.add.group();

    this.pills.add(new Pill(this.game, 1,1));
    this.pills.add(new Pill(this.game, 2,1));
    this.pills.add(new Pill(this.game, 3,1));
    this.pills.add(new Pill(this.game, 4,1));
    this.pills.add(new Pill(this.game, 5,1));
    this.pills.add(new Pill(this.game, 6,1));

    this.pills.add(new Pill(this.game, 3,2));
    this.pills.add(new Pill(this.game, 4,2));

    this.pills.add(new Pill(this.game, 3,3));
    this.pills.add(new Pill(this.game, 4,3));

    this.pills.add(new Pill(this.game, 1,4));
    this.pills.add(new Pill(this.game, 2,4));
    this.pills.add(new Pill(this.game, 3,4));
    this.pills.add(new Pill(this.game, 4,4));
    this.pills.add(new Pill(this.game, 5,4));
    this.pills.add(new Pill(this.game, 6,4));
  },
  addPlayerControls: function() {
    var controls = {
      up: Phaser.Keyboard.UP,
      down: Phaser.Keyboard.DOWN,
      left: Phaser.Keyboard.LEFT,
      right: Phaser.Keyboard.RIGHT
    };
    this.game.input.keyboard.addKeyCapture([
      controls.up,
      controls.down,
      controls.left,
      controls.right
    ]);

    this.game.input.keyboard.addKey(controls.up).onDown.add(this.movePlayer.bind(this, this.playerA, 0, -1), this);
    this.game.input.keyboard.addKey(controls.down).onDown.add(this.movePlayer.bind(this, this.playerA, 0, 1), this);
    this.game.input.keyboard.addKey(controls.left).onDown.add(this.movePlayer.bind(this, this.playerA, -1, 0), this);
    this.game.input.keyboard.addKey(controls.right).onDown.add(this.movePlayer.bind(this, this.playerA, 1, 0), this);
  },
  movePlayer: function(player, deltaX, deltaY) {
    var newX = player.x + deltaX;
    var newY = player.y + deltaY;

    if (!this.checkMap(newX, newY)) {
      player.move(newX, newY);
    }
  },
  playerPillCollision: function(player, pill) {
    player.score++;
    pill.destroy();

    console.log(this.playerA.score);
  }
};

module.exports = Play;
