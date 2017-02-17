var React = require('react');
var ReactDOM = require('react-dom');

/**
 * Libraries
 */

global.jQuery = require('jquery');
global.$ = jQuery;

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
