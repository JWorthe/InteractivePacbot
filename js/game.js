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
},{"./states/boot":3,"./states/gameover":4,"./states/menu":5,"./states/play":6,"./states/preload":7}],2:[function(require,module,exports){
'use strict';

var Wall = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'wall', frame);

  // initialize your prefab here
};

Wall.prototype = Object.create(Phaser.Sprite.prototype);
Wall.prototype.constructor = Wall;

module.exports = Wall;

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"../prefabs/wall":2}],7:[function(require,module,exports){
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