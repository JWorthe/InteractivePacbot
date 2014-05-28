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
    this.createPlayers();

    this.world.scale = {x:100, y:100};
    this.world.bounds = {x: -50, y:-50, width: this.game.width, height: this.game.height};
    this.world.camera.setBoundsToWorld();

    this.addPlayerControls();

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.playerAScoreText = this.game.add.bitmapText(-0.1, -0.4, 'spaced-scorefont','0',1);
    this.playerBScoreText = this.game.add.bitmapText(this.world.width/this.world.scale.x - 2.1, -0.4, 'spaced-scorefont','0',1);

    this.victoryText = this.game.add.bitmapText(this.world.width/2/this.world.scale.x, 2, 'scorefont', '', 1);

    this.gameWon = false;
  },
  update: function() {
    this.game.physics.arcade.overlap(this.players, this.pills, this.playerPillCollision, null, this);

    if (!this.gameWon && this.pills.total === 0) {
      this.gameWon = true;
      if (this.playerA.score > this.playerB.score) {
        this.setVictoryText("PLAYER A WINS");
      }
      else if (this.playerA.score < this.playerB.score) {
        this.setVictoryText("PLAYER B WINS");
      }
      else {
        this.setVictoryText("DRAW");
      }

      var self = this;
      setTimeout(function() {
        self.game.state.start('play');
      }, 5000);
    }
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
  createPlayers: function() {
    this.players = this.game.add.group();

    this.playerA = new Player(this.game, 1, 2, 'player-a', 0);
    this.playerB = new Player(this.game, 6, 2, 'player-b', 0);
    this.players.add(this.playerA);
    this.players.add(this.playerB);

    this.updatePlayerTurn(0);
  },
  addPlayerControls: function() {
    this.playerAControls = {
      up: Phaser.Keyboard.W,
      left: Phaser.Keyboard.A,
      down: Phaser.Keyboard.S,
      right: Phaser.Keyboard.D
    }
    this.playerBControls = {
      up: Phaser.Keyboard.UP,
      left: Phaser.Keyboard.LEFT,
      down: Phaser.Keyboard.DOWN,
      right: Phaser.Keyboard.RIGHT
    };

    function addKeyCaptures(controls, keyboard) {
      for (var index in controls) {
        if (controls.hasOwnProperty(index)) {
          keyboard.addKeyCapture(controls[index]);
        }
      }
    }
    addKeyCaptures(this.playerAControls, this.game.input.keyboard);
    addKeyCaptures(this.playerBControls, this.game.input.keyboard);

    this.game.input.keyboard.addKey(this.playerAControls.up).onDown.add(this.movePlayer.bind(this, this.playerA, 0, -1), this);
    this.game.input.keyboard.addKey(this.playerAControls.down).onDown.add(this.movePlayer.bind(this, this.playerA, 0, 1), this);
    this.game.input.keyboard.addKey(this.playerAControls.left).onDown.add(this.movePlayer.bind(this, this.playerA, -1, 0), this);
    this.game.input.keyboard.addKey(this.playerAControls.right).onDown.add(this.movePlayer.bind(this, this.playerA, 1, 0), this);

    this.game.input.keyboard.addKey(this.playerBControls.up).onDown.add(this.movePlayer.bind(this, this.playerB, 0, -1), this);
    this.game.input.keyboard.addKey(this.playerBControls.down).onDown.add(this.movePlayer.bind(this, this.playerB, 0, 1), this);
    this.game.input.keyboard.addKey(this.playerBControls.left).onDown.add(this.movePlayer.bind(this, this.playerB, -1, 0), this);
    this.game.input.keyboard.addKey(this.playerBControls.right).onDown.add(this.movePlayer.bind(this, this.playerB, 1, 0), this);
  },
  movePlayer: function(player, deltaX, deltaY) {
    var newX = player.x + deltaX;
    var newY = player.y + deltaY;

    if (!this.checkMap(newX, newY) && player.isMyTurn) {
      player.move(newX, newY);
      this.togglePlayerTurn();
    }
  },
  playerPillCollision: function(player, pill) {
    player.score++;
    pill.destroy();

    this.playerAScoreText.setText(this.playerA.score+'');
    this.playerBScoreText.setText(this.playerB.score+'');
  },
  togglePlayerTurn: function() {
    this.updatePlayerTurn((this.playerTurn+1)%this.players.length);
  },
  updatePlayerTurn: function(newPlayerTurn) {
    this.playerTurn = newPlayerTurn;
    for (var i=0; i<this.players.children.length; ++i) {
      this.players.children[i].isMyTurn = (i === this.playerTurn);
    }
    console.log("Player " + this.playerTurn + "'s turn");
  },
  setVictoryText: function(newText) {
    this.victoryText.setText(newText);
    this.victoryText.position.x = this.world.width/2/this.world.scale.x - this.victoryText.textWidth/2 - 0.5;
  },
  shutdown: function() {  
    this.game.input.keyboard.removeKey(this.playerAControls.up);
    this.game.input.keyboard.removeKey(this.playerAControls.down);
    this.game.input.keyboard.removeKey(this.playerAControls.left);
    this.game.input.keyboard.removeKey(this.playerAControls.right);

    this.game.input.keyboard.removeKey(this.playerBControls.up);
    this.game.input.keyboard.removeKey(this.playerBControls.down);
    this.game.input.keyboard.removeKey(this.playerBControls.left);
    this.game.input.keyboard.removeKey(this.playerBControls.right);
  }
};

module.exports = Play;
