'use strict';

var Player = require('../entities/player');
var Pill = require('../entities/pill');
var BonusPill = require('../entities/bonusPill');
var Wall = require('../entities/wall');
var PoisonPill = require('../entities/poisonPill');
var Hud = require('../entities/hud');

var CollisionMap = require('../entities/collisionMap')

function Play() {}

Play.prototype = {
  create: function() {
    this.readLevelFile();
    this.addGameHud();

    this.world.scale = {x:50, y:50}; //manually tweaked based on size of level file
    this.world.bounds = {x: -425, y:-25, width: this.game.width, height: this.game.height};
    this.world.camera.setBoundsToWorld();

    this.setupPlayerControls();

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
      this.displayVictoryText();

      this.game.time.events.add(5000, function() {
        this.game.state.start('play');
      }, this);
    }

    this.pollPlayerInput();
  },
  readLevelFile: function() {
    this.pills = this.game.add.group();
    this.players = this.game.add.group();
    this.walls = this.game.add.group();
    this.poisonPills = this.game.add.group();
    this.map = new CollisionMap();

    var levelText = this.game.cache.getText('level');
    var splitRows = levelText.split('\n');

    this.gameHeight = splitRows.length;
    this.gameWidth = splitRows.reduce(function(currentMax, nextRow) {
      return Math.max(currentMax, nextRow.trim().length);
    }, 0);
    
    for (var y=0; y<splitRows.length; y++) {
      for (var x=0; x<splitRows[y].length; x++) {
        switch(splitRows[y][x]) {
          case '#':
            this.walls.add(new Wall(this.game, x, y));
            this.map.addToMap(x, y);
            break;
          case '.':
            this.pills.add(new Pill(this.game, x, y));
            break;
          case '*':
            this.pills.add(new BonusPill(this.game, x, y));
            break;
          case 'A':
            this.playerA = new Player(this.game, x, y, 'player-a', 'omSound');
            this.players.add(this.playerA);
            break;
          case 'B':
            this.playerB = new Player(this.game, x, y, 'player-b', 'nomSound');
            this.players.add(this.playerB);
            break;
          case '|':
            this.map.addToMap(x, y);
            break;
          }
      }
    }
    
    var totalScore = this.pills.children.reduce(function(score, nextPill) {
      return score + nextPill.score;
    }, 0);

    this.players.forEach(function(player) {
      player.maxScore = totalScore;
    }, this);

    this.respawnX = Math.ceil(this.gameWidth/2)-1;
    this.respawnY = Math.ceil(this.gameHeight/2)-1;

    this.playerB.isMyTurn = true;
  },
  addGameHud: function() {
    this.hudA = new Hud(this.game, this.playerA, this.gameWidth-0.5, -0.5, 'spaced-scorefont-a', 'keys-a');
    this.hudB = new Hud(this.game, this.playerB, -8.5, -0.5, 'spaced-scorefont-b', 'keys-b');
  },
  setupPlayerControls: function() {
    this.playerBControls = {
      up: Phaser.Keyboard.W,
      left: Phaser.Keyboard.A,
      down: Phaser.Keyboard.S,
      right: Phaser.Keyboard.D,
      poison: Phaser.Keyboard.Q
    };
    this.playerAControls = {
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

    this.game.input.keyboard.addKey(this.controls.reset).onDown.add(function() {
      this.game.state.start('play');
    },this);
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
  playerPillCollision: function(player, pill) {
    player.score += pill.score;
    pill.destroy();
    player.scoreSound.play();
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
  pollPlayerInput: function() {
    if (this.game.input.gamepad.pad2.connected) {
      this.pollGamepadForPlayer(this.game.input.gamepad.pad2, this.playerA);
    }
    if (this.game.input.gamepad.pad1.connected) {
      this.pollGamepadForPlayer(this.game.input.gamepad.pad1, this.playerB);
    }

    this.pollKeyboardForPlayer(this.playerAControls, this.playerA);
    this.pollKeyboardForPlayer(this.playerBControls, this.playerB);    
  },
  pollGamepadForPlayer: function(pad, player) {
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
  pollKeyboardForPlayer: function(controls, player) {
    if (this.game.input.keyboard.isDown(controls.up)) {
      this.movePlayer(player, 0, -1);
    }
    if (this.game.input.keyboard.isDown(controls.down)) {
      this.movePlayer(player, 0, 1);
    }
    if (this.game.input.keyboard.isDown(controls.left)) {
      this.movePlayer(player, -1, 0);
    }
    if (this.game.input.keyboard.isDown(controls.right)) {
      this.movePlayer(player, 1, 0);
    }

    var poisonKey = this.game.input.keyboard.addKey(controls.poison);
    if (poisonKey.isDown && player.keyboardPoisonLastPressed < poisonKey.timeDown) {
      player.keyboardPoisonLastPressed = poisonKey.timeDown;
      this.togglePoisonPill(player);
    }
  },
  
  togglePoisonPill: function(player) {
    if (player.hasPoisonPill) {
      player.poisonPillActive = !player.poisonPillActive;
    }
  },
  movePlayer: function(player, deltaX, deltaY) {
    var newX = player.x + deltaX;
    var newY = player.y + deltaY;
    var placePoisonPill = player.hasPoisonPill && player.poisonPillActive &&
        (Math.abs(this.respawnX-player.x)>1.1 || Math.abs(this.respawnY-player.y)>1.1);

    //cannot move into walls, when it isn't your turn, or when you're already moving
    if (this.map.checkMap(newX, newY) || !player.isMyTurn || player.moving) {
      return;
    }

    //special rules about moving around respawn area
    if (Math.abs(newX-this.respawnX)<=1 && Math.abs(newY-this.respawnY)<=1) {
      //cannot move into respawn area (only outwards)
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

    //intermediate and teleport are used for a 'multistep' move when wrapping around the screen.
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
  
  togglePlayerTurn: function() {
    for (var i=0; i<this.players.children.length; ++i) {
      this.players.children[i].isMyTurn = !this.players.children[i].isMyTurn;
      this.players.children[i].canBeEaten = true;
    }
    this.players.sort('isMyTurn');
  },
  displayVictoryText: function() {
    if (this.playerA.score > this.playerB.score) {
      this.createVictoryText('RED WINS', 'a');
    }
    else if (this.playerA.score < this.playerB.score) {
      this.createVictoryText('YELLOW WINS', 'b');
    }
    else {
      var victoryColor = this.playerA.isMyTurn ? 'b' : 'a';
      this.createVictoryText('DRAW', victoryColor);
    }
  },
  createVictoryText: function(newText, winnerLetter) {
    this.victoryText = this.game.add.bitmapText(this.world.width/2/this.world.scale.x, 2, 'scorefont-'+winnerLetter, newText, 2);
    this.victoryText.position.x = (this.world.width/this.world.scale.x)/2 - 8 - this.victoryText.textWidth/2 - 0.5;
  },
  shutdown: function() {
    function removeKeyCaptures(controls, keyboard) {
      for (var index in controls) {
        if (controls.hasOwnProperty(index)) {
          keyboard.removeKey(controls[index]);
        }
      }
    }
    removeKeyCaptures(this.playerAControls, this.game.input.keyboard);
    removeKeyCaptures(this.playerBControls, this.game.input.keyboard);
    removeKeyCaptures(this.controls, this.game.input.keyboard);
  }
};

module.exports = Play;
