(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'interactive-pacbot');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":5,"./states/gameover":6,"./states/menu":7,"./states/play":8,"./states/preload":9}],2:[function(require,module,exports){
'use strict';

var Pill = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'pill', frame);
  this.scale = {x: 0.01, y: 0.01};
  this.anchor = {x: 0.5, y: 0.5};
  
  this.game.physics.arcade.enableBody(this);
};

Pill.prototype = Object.create(Phaser.Sprite.prototype);
Pill.prototype.constructor = Pill;

Pill.prototype.update = function() {
};

module.exports = Pill;

},{}],3:[function(require,module,exports){
'use strict';

var Player = function(game, x, y, key, frame) {
  Phaser.Sprite.call(this, game, x, y, key, frame);

  this.moving = false;
  this.scale = {x: 0.01, y: 0.01};
  this.anchor = {x: 0.5, y: 0.5};
  
  this.game.physics.arcade.enableBody(this);

  this.score = 0;
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {  
};

Player.prototype.move = function(newX, newY) {
  if (this.moving) {
    return;
  }

  this.moving = true;
  var tween = this.game.add.tween(this).to({x: newX, y: newY}, 500);
  tween.onComplete.add(this.finishMovement, this);
  tween.start();
};

Player.prototype.finishMovement = function() {
  this.moving = false;
};

module.exports = Player;

},{}],4:[function(require,module,exports){
'use strict';

var Wall = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'wall', frame);
  this.scale = {x: 0.01, y: 0.01};
  this.anchor = {x: 0.5, y: 0.5};
};

Wall.prototype = Object.create(Phaser.Sprite.prototype);
Wall.prototype.constructor = Wall;

module.exports = Wall;

},{}],5:[function(require,module,exports){
'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{"../prefabs/pill":2,"../prefabs/player":3,"../prefabs/wall":4}],9:[function(require,module,exports){
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
    this.load.image('player-a', 'assets/images/player-a.svg');
    this.load.image('pill', 'assets/images/pill.svg');
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