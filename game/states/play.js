'use strict';

var Player = require('../prefabs/player');
var Pill = require('../prefabs/pill');
var BonusPill = require('../prefabs/bonusPill');
var Wall = require('../prefabs/wall');
var PoisonPill = require('../prefabs/poisonPill');

function Play() {}

Play.prototype = {
  preload: function() {
  },
  create: function() {
    this.readLevelFile();

    this.world.scale = {x:50, y:50};
    this.world.bounds = {x: -25, y:-25, width: this.game.width, height: this.game.height};
    this.world.camera.setBoundsToWorld();

    this.setupPlayerControls();

    this.playerAScoreText = this.game.add.bitmapText(-0.1, -0.4, 'spaced-scorefont-a','0',2);
    this.playerBScoreText = this.game.add.bitmapText(this.world.width/this.world.scale.x - 4.5, -0.4, 'spaced-scorefont-b','0',2);

    this.gameWon = false;
  },
  update: function() {
    this.checkForPlayerPillCollisions();
    this.checkForPlayerPoisonPillCollisions();

    if (this.playerA.canBeEaten && this.playerB.canBeEaten &&
      Phaser.Rectangle.intersects(this.playerA.getBounds(), this.playerB.getBounds())) {
      this.playerPlayerCollision(this.playerA, this.playerB);
    }

    if (!this.gameWon && this.pills.total === 0) {
      this.gameWon = true;
      if (this.playerA.score > this.playerB.score) {
        this.setVictoryText('RED WINS', 'a');
      }
      else if (this.playerA.score < this.playerB.score) {
        this.setVictoryText('YELLOW WINS', 'b');
      }
      else {
        var victoryColor = this.playerA.isMyTurn ? 'b' : 'a';
        this.setVictoryText('DRAW', victoryColor);
      }

      var self = this;
      setTimeout(function() {
        self.game.state.start('play');
      }, 5000);
    }

    this.pollPlayerInput();
  },
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

  checkForPlayerPillCollisions: function() {
    var pillCollisions = [];
    this.players.forEach(function(player) {
      var playerBounds = player.getBounds();
      this.pills.forEach(function(pill) {
        var pillBounds = pill.getBounds();
        if (Phaser.Rectangle.intersects(playerBounds, pillBounds)) {
          pillCollisions.push({player:player, pill:pill});
        }
      }, this);
    }, this);
    for (var i=0; i<pillCollisions.length; i++) {
      this.playerPillCollision(pillCollisions[i].player, pillCollisions[i].pill);
    }
  },
  checkForPlayerPoisonPillCollisions: function() {
    var pillCollisions = [];
    this.players.forEach(function(player) {
      var playerBounds = player.getBounds();
      this.poisonPills.forEach(function(pill) {
        var pillBounds = pill.getBounds();
        if (Phaser.Rectangle.intersects(playerBounds, pillBounds)) {
          pillCollisions.push({player:player, pill:pill});
        }
      }, this);
    }, this);
    for (var i=0; i<pillCollisions.length; i++) {
      this.playerPoisonPillCollision(pillCollisions[i].player, pillCollisions[i].pill);
    }
  },
  pollPlayerInput: function() {
    if (this.game.input.gamepad.pad1.connected) {
      this.pollAnalogStickForPlayer(this.game.input.gamepad.pad1, this.playerA);
    }
    if (this.game.input.gamepad.pad2.connected) {
      this.pollAnalogStickForPlayer(this.game.input.gamepad.pad2, this.playerB);
    }

    if (this.game.input.keyboard.isDown(this.playerAControls.up)) {
      this.movePlayer(this.playerA, 0, -1);
    }
    if (this.game.input.keyboard.isDown(this.playerAControls.down)) {
      this.movePlayer(this.playerA, 0, 1);
    }
    if (this.game.input.keyboard.isDown(this.playerAControls.left)) {
      this.movePlayer(this.playerA, -1, 0);
    }
    if (this.game.input.keyboard.isDown(this.playerAControls.right)) {
      this.movePlayer(this.playerA, 1, 0);
    }
    if (this.game.input.keyboard.isDown(this.playerBControls.up)) {
      this.movePlayer(this.playerB, 0, -1);
    }
    if (this.game.input.keyboard.isDown(this.playerBControls.down)) {
      this.movePlayer(this.playerB, 0, 1);
    }
    if (this.game.input.keyboard.isDown(this.playerBControls.left)) {
      this.movePlayer(this.playerB, -1, 0);
    }
    if (this.game.input.keyboard.isDown(this.playerBControls.right)) {
      this.movePlayer(this.playerB, 1, 0);
    }
  },
  pollAnalogStickForPlayer: function(pad, player) {
    if (pad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.2) {
      this.movePlayer(player, -1, 0);
    }
    if (pad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.2) {
      this.movePlayer(player, 1, 0);
    }
    if (pad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.2) {
      this.movePlayer(player, 0, -1);
    }
    if (pad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.2) {
      this.movePlayer(player, 0, 1);
    }

    var poisonButton = pad.getButton(Phaser.Gamepad.XBOX360_A);
    if (poisonButton.isDown && player.gamepadPoisonLastPressed < poisonButton.timeDown) {
      player.gamepadPoisonLastPressed = poisonButton.timeDown;
      this.togglePoisonPill(player);
    }
  },
  readLevelFile: function() {
    this.pills = this.game.add.group();
    this.players = this.game.add.group();
    this.walls = this.game.add.group();
    this.poisonPills = this.game.add.group();

    var levelText = this.game.cache.getText('level');
    var splitRows = levelText.split('\n');

    for (var x=0; x<splitRows.length; x++) {
      for (var y=0; y<splitRows[x].length; y++) {
        switch(splitRows[x][y]) {
          case '#':
            this.walls.add(new Wall(this.game, x, y));
            break;
          case '.':
            this.pills.add(new Pill(this.game, x, y));
            break;
          case '*':
            this.pills.add(new BonusPill(this.game, x, y));
            break;
          case 'A':
            this.playerA = new Player(this.game, x, y, 'player-a', 0, 'omSound');
            this.players.add(this.playerA);
            break;
          case 'B':
            this.playerB = new Player(this.game, x, y, 'player-b', 0, 'nomSound');
            this.players.add(this.playerB);
            break;
          case '|':
            this.addToMap(x, y);
            break;
          }
      }
    }

    var maxScore = 0;
    this.pills.forEach(function(pill) {
      maxScore += pill.score;
    }, this);

    this.players.forEach(function(player) {
      player.maxScore = maxScore;
    }, this);

    this.gameWidth = 0;
    this.gameHeight = 0;
    this.walls.forEach(function(wall) {
      this.addToMap(wall.x, wall.y);
      if (wall.x >= this.gameWidth) {
        this.gameWidth = wall.x+1;
      }
      if (wall.y >= this.gameHeight) {
        this.gameHeight = wall.y+1;
      }
    }, this);
    this.respawnX = Math.ceil(this.gameWidth/2)-1;
    this.respawnY = Math.ceil(this.gameHeight/2)-1;

    this.updatePlayerTurn(0);
  },

  setupPlayerControls: function() {
    this.playerAControls = {
      up: Phaser.Keyboard.W,
      left: Phaser.Keyboard.A,
      down: Phaser.Keyboard.S,
      right: Phaser.Keyboard.D,
      poison: Phaser.Keyboard.Q
    };
    this.playerBControls = {
      up: Phaser.Keyboard.UP,
      left: Phaser.Keyboard.LEFT,
      down: Phaser.Keyboard.DOWN,
      right: Phaser.Keyboard.RIGHT,
      poison: Phaser.Keyboard.ENTER
    };
    this.controls = {
      reset: Phaser.Keyboard.ESC
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
    addKeyCaptures(this.controls, this.game.input.keyboard);

    this.game.input.gamepad.start();

    this.game.orientation.onLeft.add(function() {
      this.movePlayer(this.players.children[this.playerTurn], -1, 0);
    }, this);
    this.game.orientation.onRight.add(function() {
      this.movePlayer(this.players.children[this.playerTurn], 1, 0);
    }, this);
    this.game.orientation.onUp.add(function() {
      this.movePlayer(this.players.children[this.playerTurn], 0, -1);
    }, this);
    this.game.orientation.onDown.add(function() {
      this.movePlayer(this.players.children[this.playerTurn], 0, 1);
    }, this);

    this.game.input.keyboard.addKey(this.playerBControls.poison).onDown.add(this.togglePoisonPill.bind(this, this.playerB), this);
    this.game.input.keyboard.addKey(this.playerAControls.poison).onDown.add(this.togglePoisonPill.bind(this, this.playerA), this);

    this.game.input.keyboard.addKey(this.controls.reset).onDown.add(function() {
      this.game.state.start('play');
    },this);
  },
  togglePoisonPill: function(player) {
    if (player.hasPoisonPill) {
      player.poisonPillActive = !player.poisonPillActive;
    }
  },
  movePlayer: function(player, deltaX, deltaY) {
    var newX = player.x + deltaX;
    var newY = player.y + deltaY;
    var placePoisonPill = player.hasPoisonPill && player.poisonPillActive && (Math.abs(this.respawnX-player.x)>1.1 || Math.abs(this.respawnY-player.y)>1.1);

    //cannot move into walls, when it isn't your turn, or when you're already moving
    if (this.checkMap(newX, newY) || !player.isMyTurn || player.moving) {
      return;
    }

    if (Math.abs(newX-this.respawnX)<=1 && Math.abs(newY-this.respawnY)<=1) {
      //cannot move into respawn area
      if (Math.abs(newX-this.respawnX)<Math.abs(player.x-this.respawnX) ||
          Math.abs(newY-this.respawnY)<Math.abs(player.y-this.respawnY)) {
        return;
      }

      //cannot eat opponent when leaving respawn block
      for (var playerIndex=0; playerIndex<this.players.children.length; ++playerIndex) {
        var opponent = this.players.children[playerIndex];
        if (Math.abs(newX-opponent.x)<0.1 && Math.abs(newY-opponent.y)<0.1) {
          return;
        }
      }
    }

    var posionPillX = player.x;
    var posionPillY = player.y;
    if (placePoisonPill) {
      player.hasPoisonPill = false;
    }

    var intermediateX = newX;
    var teleportX = newX;
    var intermediateY = newY;
    var teleportY = newY;

    if (newX >= this.gameWidth) {
      newX = 0;
      teleportX = -1;
    }
    if (newX < 0) {
      newX = this.gameWidth-1;
      teleportX = this.gameWidth;
    }
    if (newY >= this.gameHeight) {
      newY = 0;
      teleportY = -1;
    }
    if (newY < 0) {
      newY = this.gameHeight-1;
      teleportY = this.gameHeight;
    }

    if (newX === intermediateX && newY === intermediateY) {
      player.move(newX, newY, function() {
        if (placePoisonPill) {
          this.poisonPills.add(new PoisonPill(this.game, posionPillX, posionPillY));
          player.poisonPillActive = false;
        }
        this.togglePlayerTurn();
      }, this);
    }
    else {
      player.multistepMove(intermediateX, intermediateY, teleportX, teleportY, newX, newY, function() {
        if (placePoisonPill) {
          this.poisonPills.add(new PoisonPill(this.game, posionPillX, posionPillY));
          player.poisonPillActive = false;
        }
        this.togglePlayerTurn();
      }, this);
    }
  },
  playerPillCollision: function(player, pill) {
    player.score += pill.score;
    pill.destroy();
    player.scoreSound.play();

    this.playerAScoreText.setText(this.playerA.score+'');
    this.playerBScoreText.setText(this.playerB.score+'');
  },
  playerPoisonPillCollision: function(player, poisonPill) {
    if (player.lastTween) {
      player.lastTween.onComplete.add(player.teleport.bind(player, this.respawnX, this.respawnY), player);
    }
    else {
      player.teleport(this.respawnX, this.respawnY);
    }

    poisonPill.destroy();
    player.respawnSound.play();
  },
  playerPlayerCollision: function(playerA, playerB) {
    var eatenPlayer = playerA.isMyTurn ? playerB : playerA;

    if (eatenPlayer.lastTween) {
      eatenPlayer.lastTween.onComplete.add(eatenPlayer.teleport.bind(eatenPlayer, this.respawnX, this.respawnY), eatenPlayer);
    }
    else {
      eatenPlayer.teleport(this.respawnX, this.respawnY);
    }
    eatenPlayer.canBeEaten = false;
    eatenPlayer.respawnSound.play();
  },
  togglePlayerTurn: function() {
    this.updatePlayerTurn((this.playerTurn+1)%this.players.length);
  },
  updatePlayerTurn: function(newPlayerTurn) {
    this.playerTurn = newPlayerTurn;
    for (var i=0; i<this.players.children.length; ++i) {
      this.players.children[i].isMyTurn = (i === this.playerTurn);
      this.players.children[i].canBeEaten = true;
    }
  },
  setVictoryText: function(newText, winnerLetter) {
    this.victoryText = this.game.add.bitmapText(this.world.width/2/this.world.scale.x, 2, 'scorefont-'+winnerLetter, newText, 2);
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

    this.game.input.keyboard.removeKey(this.controls.reset);
  }
};

module.exports = Play;
