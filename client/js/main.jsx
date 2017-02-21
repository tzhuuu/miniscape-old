var React = require('react');
var ReactDOM = require('react-dom');

/**
 * Libraries
 */

global.jQuery = require('jquery');
global.$ = jQuery;
require('./libraries/pixi.min.js');
require('./libraries/pixi-display.min.js');
// require('./libraries/pixi.js');
global.Bump = require('./libraries/bump.js');
// global.Phaser = require('./libraries/phaser.min.js');

/**
 * Components
 */

var MainComponent = require('./components/MainComponent.jsx');

/**
 * Add the components
 */

ReactDOM.render(
  <MainComponent />,
  document.getElementById('main-component')
);

require('./main');
