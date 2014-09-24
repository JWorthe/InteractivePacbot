'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/images/preloader.gif');
  },
  create: function() {
    this.game.state.start('load');
  }
};

module.exports = Boot;
