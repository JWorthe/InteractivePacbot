(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(1750, 1100, Phaser.AUTO, 'interactive-pacbot');

  var Orientation = require('./plugins/orientation');
  game.orientation = new Orientation();

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./plugins/orientation":2,"./states/boot":9,"./states/gameover":10,"./states/menu":11,"./states/play":12,"./states/preload":13}],2:[function(require,module,exports){
'use strict';

var Orientation = function() {
	var self = this;

	self.onLeft = new Phaser.Signal();
	self.onRight = new Phaser.Signal();
	self.onUp = new Phaser.Signal();
	self.onDown = new Phaser.Signal();

	self.previousEvent = {
		gamma: 0,
		beta: 0
	};

	self.threshhold = 15;

	if (window.DeviceOrientationEvent) {
		window.addEventListener('deviceorientation', function(eventData) {
			if (eventData.gamma < -self.threshhold && self.previousEvent.gamma >= -self.threshhold) {
				self.onLeft.dispatch();
			}
			if (eventData.gamma > self.threshhold && self.previousEvent.gamma <= self.threshhold) {
				self.onRight.dispatch();
			}
			if (eventData.beta < -self.threshhold && self.previousEvent.beta >= -self.threshhold) {
				self.onUp.dispatch();
			}
			if (eventData.beta > self.threshhold && self.previousEvent.beta <= self.threshhold) {
				self.onDown.dispatch();
			}

			self.previousEvent.gamma = eventData.gamma;
			self.previousEvent.beta = eventData.beta;
		});
	}
};


module.exports = Orientation;

},{}],3:[function(require,module,exports){
'use strict';

var BonusPill = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'bonus-pill', frame);
  this.scale = {x: 0.01, y: 0.01};
  this.anchor = {x: 0.5, y: 0.5};

  this.score = 10;
};

BonusPill.prototype = Object.create(Phaser.Sprite.prototype);
BonusPill.prototype.constructor = BonusPill;

BonusPill.prototype.getBounds = function() {
  return new Phaser.Rectangle(this.x, this.y, 0.2, 0.2);
};

module.exports = BonusPill;

},{}],4:[function(require,module,exports){
'use strict';

var Hud = function(game, player, x, y, scorefontKey, keyboardSpriteKey) {
    Phaser.Group.call(this, game);
    this.x = x;
    this.y = y;
    this.player = player;
    this.scale = {x: 0.02, y: 0.02};


    this.background = new Phaser.Sprite(this.game, 0, 0, 'hud-bg');
    this.add(this.background);
    this.scoreText = new Phaser.BitmapText(this.game, 172, 10, scorefontKey, '0', 100);
    this.add(this.scoreText);

    this.poisonIndicator = new Phaser.Sprite(this.game, 200, 150, 'poison-pill');
    //this.poisonIndicator.scale = {0.1, 0.1};
    this.poisonIndicator.anchor = {x:0.5, y:0.5};
    this.add(this.poisonIndicator);

    this.controllerDiagram = new Phaser.Sprite(this.game, 0, 300, 'controller-diagram');
    this.controllerDiagram.scale = {x: 0.5, y: 0.5};
    this.add(this.controllerDiagram);

    this.keyboardControls = new Phaser.Sprite(this.game, 0, 600, keyboardSpriteKey);
    this.keyboardControls.scale = {x: 0.5, y: 0.5};
    this.add(this.keyboardControls);

    this.currentScore = 0;
};

Hud.prototype = Object.create(Phaser.Group.prototype);
Hud.prototype.constructor = Hud;

Hud.prototype.update = function() {
    if (this.currentScore !== this.player.score) {
        this.currentScore = this.player.score;
        this.scoreText.setText(this.player.score+'');

        var numberOfDigits = Math.floor(Math.log(this.currentScore)/Math.log(10))+1;
        this.scoreText.x = 200 - numberOfDigits*30;
    }

    if (this.poisonIndicator && !this.player.hasPoisonPill) {
        this.poisonIndicator.destroy();
        this.poisonIndicator = null;
    }
};

module.exports = Hud;

},{}],5:[function(require,module,exports){
'use strict';

var Pill = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'pill', frame);
  this.scale = {x: 0.01, y: 0.01};
  this.anchor = {x: 0.5, y: 0.5};

  this.score = 1;
};

Pill.prototype = Object.create(Phaser.Sprite.prototype);
Pill.prototype.constructor = Pill;

Pill.prototype.getBounds = function() {
  return new Phaser.Rectangle(this.x, this.y, 0.2, 0.2);
};

module.exports = Pill;

},{}],6:[function(require,module,exports){
'use strict';

var Player = function(game, x, y, key, frame, soundKey) {
  var player = this;

  Phaser.Sprite.call(this, game, x, y, key, frame);
  this.animations.add('active', [0]);
  this.animations.add('waiting', [1]);
  this.animations.add('activePoison', [2]);
  this.animations.add('waitingPoison', [3]);

  this.baseKey = key;
  this.moving = false;
  this.scale = {x: 0.01, y: 0.01};
  this.anchor = {x: 0.5, y: 0.5};

  this.score = 0;
  this.maxScore = 1;
  this.isMyTurn = false;
  this.canBeEaten = true;

  this.currentAnimation = {
    isMyTurn: true,
    poisonPillActive: false
  }

  this.hasPoisonPill = true;
  this.poisonPillActive = false;
  this.gamepadPoisonLastPressed = Number.NEGATIVE_INFINITY;
  this.lastTween = null;

  this.scoreSound = game.sound.add(soundKey);
  this.respawnSound = game.sound.add('owSound');


  //BEWARE! HORRIBLE HACK AHEAD!
  //Intercepts the call to get a new buffer so that we can set the playbackRate.
  var audioContext = this.scoreSound.context;
  var childContext = Object.create(audioContext);
  this.scoreSound.context = childContext;

  childContext.createBufferSource = function() {
    var source = audioContext.createBufferSource();
    var scoreFraction = player.score / player.maxScore;
    source.playbackRate.value = 0.75 + scoreFraction*6;
    return source;
  };
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  if (this.isMyTurn !== this.currentAnimation.isMyTurn || this.poisonPillActive !== this.currentAnimation.poisonPillActive) {
    this.currentAnimation.isMyTurn = this.isMyTurn;
    this.currentAnimation.poisonPillActive = this.poisonPillActive;

    var animation;
    if (!this.currentAnimation.isMyTurn) {
      if (!this.currentAnimation.poisonPillActive) {
        animation = 'waiting';
      }
      else {
        animation = 'waitingPoison'
      }
    }
    else {
      if (!this.currentAnimation.poisonPillActive) {
        animation = 'active';
      }
      else {
        animation = 'activePoison'
      }
    }
    this.play(animation);
  }
};

Player.prototype.move = function(newX, newY, callback, callbackContext) {
  this.moving = true;

  var tween = this.game.add.tween(this).to({x: newX, y: newY}, 500);
  tween.onComplete.add(callback, callbackContext);
  tween.onComplete.add(this.finishMovement, this);

  this.lastTween = tween;

  tween.start();
};

Player.prototype.multistepMove = function(moveX, moveY, teleportX, teleportY, finalX, finalY, callback, callbackContext) {
  this.moving = true;

  var firstTween = this.game.add.tween(this).to({x: moveX, y: moveY}, 500);

  firstTween.onComplete.add(function() {
    this.teleport(teleportX, teleportY);
    this.move(finalX, finalY, callback, callbackContext);
  }, this);

  firstTween.start();
}

Player.prototype.teleport = function(newX, newY) {
  this.x = newX;
  this.y = newY;
}

Player.prototype.finishMovement = function() {
  this.moving = false;
  this.lastTween = null;
};

Player.prototype.getBounds = function() {
  return new Phaser.Rectangle(this.x, this.y, 0.2, 0.2);
};

module.exports = Player;

},{}],7:[function(require,module,exports){
'use strict';

var PoisonPill = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'poison-pill', frame);
  this.scale = {x: 0.01, y: 0.01};
  this.anchor = {x: 0.5, y: 0.5};

  this.score = 1;
};

PoisonPill.prototype = Object.create(Phaser.Sprite.prototype);
PoisonPill.prototype.constructor = PoisonPill;

PoisonPill.prototype.getBounds = function() {
  return new Phaser.Rectangle(this.x, this.y, 0.2, 0.2);
};

module.exports = PoisonPill;

},{}],8:[function(require,module,exports){
'use strict';

var Wall = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'wall', frame);
  this.scale = {x: 0.01, y: 0.01};
  this.anchor = {x: 0.5, y: 0.5};
};

Wall.prototype = Object.create(Phaser.Sprite.prototype);
Wall.prototype.constructor = Wall;

module.exports = Wall;

},{}],9:[function(require,module,exports){
'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/images/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],10:[function(require,module,exports){
'use strict';

function GameOver() {}

GameOver.prototype = {
  preload: function () {
  },
  create: function () {
  },
  update: function () {
  }
};

module.exports = GameOver;

},{}],11:[function(require,module,exports){
'use strict';

function Menu() {}

Menu.prototype = {
  preload: function() {
  },
  create: function() {
  },
  update: function() {
  }
};

module.exports = Menu;

},{}],12:[function(require,module,exports){
'use strict';

var Player = require('../prefabs/player');
var Pill = require('../prefabs/pill');
var BonusPill = require('../prefabs/bonusPill');
var Wall = require('../prefabs/wall');
var PoisonPill = require('../prefabs/poisonPill');
var Hud = require('../prefabs/hud');

function Play() {}

Play.prototype = {
  preload: function() {
  },
  create: function() {
    this.readLevelFile();

    this.world.scale = {x:50, y:50};
    this.world.bounds = {x: -425, y:-25, width: this.game.width, height: this.game.height};
    this.world.camera.setBoundsToWorld();

    this.setupPlayerControls();

    this.gameWon = false;

    this.hudA = new Hud(this.game, this.playerA, this.gameWidth-0.5, -0.5, 'spaced-scorefont-a', 'keys-a');
    this.hudB = new Hud(this.game, this.playerB, -8.5, -0.5, 'spaced-scorefont-b', 'keys-b');

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
    if (this.game.input.gamepad.pad2.connected) {
      this.pollAnalogStickForPlayer(this.game.input.gamepad.pad2, this.playerA);
    }
    if (this.game.input.gamepad.pad1.connected) {
      this.pollAnalogStickForPlayer(this.game.input.gamepad.pad1, this.playerB);
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

    for (var y=0; y<splitRows.length; y++) {
      for (var x=0; x<splitRows[y].length; x++) {
        switch(splitRows[y][x]) {
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

    this.playerB.isMyTurn = true;
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

    this.game.orientation.onLeft.add(this.moveActivePlayer.bind(this, -1, 0), this);
    this.game.orientation.onRight.add(this.moveActivePlayer.bind(this, 1, 0), this);
    this.game.orientation.onUp.add(this.moveActivePlayer.bind(this, 0, -1), this);
    this.game.orientation.onDown.add(this.moveActivePlayer.bind(this, 0, 1), this);

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
  moveActivePlayer: function(deltaX, deltaY) {
    var activePlayer = null;
    for (var i=0; i<this.players.children.length; ++i) {
      if (this.players.children[i].isMyTurn) {
        activePlayer = this.players.children[i];
      }
    }

    movePlayer(activePlayer, deltaX, deltaY);
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
    for (var i=0; i<this.players.children.length; ++i) {
      this.players.children[i].isMyTurn = !this.players.children[i].isMyTurn;
      this.players.children[i].canBeEaten = true;
    }
    this.players.sort('isMyTurn');
  },
  setVictoryText: function(newText, winnerLetter) {
    this.victoryText = this.game.add.bitmapText(this.world.width/2/this.world.scale.x, 2, 'scorefont-'+winnerLetter, newText, 2);
    this.victoryText.position.x = (this.world.width/this.world.scale.x)/2 - 8 - this.victoryText.textWidth/2 - 0.5;
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

},{"../prefabs/bonusPill":3,"../prefabs/hud":4,"../prefabs/pill":5,"../prefabs/player":6,"../prefabs/poisonPill":7,"../prefabs/wall":8}],13:[function(require,module,exports){
'use strict';

function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('wall', 'assets/images/wall.svg');
    this.load.spritesheet('player-a', 'assets/images/player-a-spritesheet.svg', 100, 100);
    this.load.spritesheet('player-b', 'assets/images/player-b-spritesheet.svg', 100, 100);
    this.load.image('pill', 'assets/images/pill.svg');
    this.load.image('bonus-pill', 'assets/images/bonus-pill.svg');
    this.load.image('poison-pill', 'assets/images/poison-pill.svg');

    this.load.bitmapFont('spaced-scorefont-a', 'assets/fonts/scorefont-a.png', 'assets/fonts/scorefont.fnt', undefined, 10);
    this.load.bitmapFont('scorefont-a', 'assets/fonts/scorefont-a.png', 'assets/fonts/scorefont.fnt');
    this.load.audio('omSound', 'assets/audio/om.ogg', true);

    this.load.bitmapFont('spaced-scorefont-b', 'assets/fonts/scorefont-b.png', 'assets/fonts/scorefont.fnt', undefined, 10);
    this.load.bitmapFont('scorefont-b', 'assets/fonts/scorefont-b.png', 'assets/fonts/scorefont.fnt');
    this.load.audio('nomSound', 'assets/audio/nom.ogg', true);

    this.load.audio('owSound', 'assets/audio/ow.ogg', true);

    this.load.text('level', 'assets/levels/maze.lvl');

    this.load.image('hud-bg', 'assets/images/hud-bg.svg');
    this.load.image('controller-diagram', 'assets/images/controller-diagram.svg');
    this.load.image('keys-a', 'assets/images/keyboard-control-a.svg');
    this.load.image('keys-b', 'assets/images/keyboard-control-b.svg');
  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('play');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[1])