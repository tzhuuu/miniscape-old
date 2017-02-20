// globals
global.bump = new Bump(PIXI);

var Character = require('./models/character');
var Projectile = require('./models/projectile');

// requires
var Q = require('q');

var Map = require('./map');
var Config = require('./config');

var CharacterStore = require('./stores/characterStore');
var ProjectileStore = require('./stores/projectileStore');

var Layers = require('./layers');
var Settings = require('./settings');

var stage;
var renderer;

var init = function(state, mainLoop) {
  var deferred = Q.defer();

  initPixi();
  loadAssets().then(function() {
    loadMiniscape();
    setup();
    deferred.resolve();
  }, function(err) {
    console.log('could not load assets');
    deferred.reject();
  }).then(null, function(err) {
    console.log(err);
    deferred.reject();
  });

  state.update = loading;
  mainLoop(renderer, stage);

  return deferred.promise;
}

var loading = function(timeDelta) {
  console.log('loading loading');
}

var initPixi = function() {
  // create the renderer
  renderer = PIXI.autoDetectRenderer(256, 256);
  renderer.backgroundColor = 0x061639;
  renderer.view.style.position = "absolute";
  renderer.view.style.display = "block";
  renderer.autoResize = true;

  // Enforce a 16:9 ratio
  Settings.unit = Math.floor(Math.min(window.innerWidth/16, window.innerHeight/9));

  renderer.resize(window.innerWidth, window.innerHeight);

  // add the canvas to the HTML document
  document.body.appendChild(renderer.view);

  // create a container object called the `stage`
  stage = new PIXI.Container();
  renderer.render(stage);
}

var loadAssets = function() {
  var deferred = Q.defer();

  // initialize socket.io connection
  var socket = require('./sockets/socket');
  socket.init();

  // load sounds

  // load images
  PIXI.loader
    .add(Config.assets.images)
    .load(function() {
      deferred.resolve();
    });

  return deferred.promise;
}

var loadMiniscape = function() {

  // create the container layers
  Layers.setStage(stage);
  Layers.setRenderer(renderer);
  for (var i = 0; i < Config.layers.length; i++) {
    var l = Config.layers[i];
    Layers.addLayer(l.name, l.zIndex, l.parent);
  }

  // load extensions
  require('./utils/extensions');

  // load pixi keyboard
  require('./utils/keyboard');

  // load settings

  // attach game hooks
}

var setup = function() {

  var width = window.innerWidth;
  var height = window.innerHeight;

  // create the map
  var mapContainer = new PIXI.Container();
  mapContainer.zIndex = 10;
  Layers.getLayer('background').addChild(mapContainer);
  var textures = {
    base: PIXI.loader.resources['./imgs/ground61.png'].texture,
    ground: PIXI.loader.resources['./imgs/ground61.png'].texture,
    wall: PIXI.loader.resources['./imgs/ground62.png'].texture,
    water: PIXI.loader.resources['./imgs/ground67.png'].texture,
  }
  // mapString = [
  //   "            XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  //   "                                       X",
  //   "                                       X",
  //   "                                       X",
  //   "                                       X",
  //   "                                       X",
  //   "                                       X",
  //   "                                       X",
  //   "                                       X",
  //   "                                       X",
  //   "                                       X",
  //   "                                       X",
  //   "                                       X",
  //   "                                       X",
  //   "                                       X",
  //   "                                       X",
  //   "                                       X",
  //   "                                       X",
  //   "                                       X",
  //   "                                       X",
  //   "                                       X",
  //   "X                                      X",
  //   "X           C                          X"
  // ];
  mapString = [
    "XXXXXXXXXXXXXX",
    "X            X",
    "X            X",
    "X            X",
    "X            X",
    "X            X",
    "X            X",
    "X            X",
    "XXXXXXXXXXXXXX",
  ]
  var map = Map.createMap(mapString, {' ': 'base', 'X' : 'wall', 'C': 'water'},
                          textures, mapContainer, Settings.unit);
  Map.addMap('town', map);

  // create isaac sprite from texture
  var isaac = new Character({
    'texture': PIXI.loader.resources["./imgs/isaac.png"].texture,
    'name': 'isaac',
    'x': 1.5,
    'y': 1.5,
    'speed': 5,
    'faceDir': 'down',
    'bulletSpeed': 8,
    'shotSpeed': 200,
    'isShooting': false,
    'projectileOptions': {
      'radius': 10
    }
  });

  var krampus = new Character({
    'texture': PIXI.loader.resources["./imgs/krampus.png"].texture,
    'name': 'krampus',
    'x': 5,
    'y': 0,
    'speed': 0,
    'faceDir': 'down',
    'bulletSpeed': 1,
    'shotSpeed': 1000,
    'isShooting': true,
    'projectileOptions': {
      'radius': 10,
      'growthRate': 1.0025
    }
  });

  CharacterStore.addCharacter('isaac', isaac);
  CharacterStore.addCharacter('krampus', krampus);

  Layers.getLayer('characters').addChild(isaac);
  Layers.getLayer('characters').addChild(krampus);

  // rerender stage
  renderer.render(stage);
  stage.updateLayersOrder();

  initControls();
}

var initControls = function(){

  var keyboard = require('./utils/keyboard');
  var isaac = CharacterStore.getCharacter('isaac');

  isaac.zOrder = -10;

  var w = keyboard(87),
      a = keyboard(65),
      s = keyboard(83),
      d = keyboard(68),
      i = keyboard(73),
      j = keyboard(74),
      k = keyboard(75),
      l = keyboard(76);
  var movePresses = [0, 0, 0, 0, 0];
  var moveDir = [0, 0];
  var facePresses = [0, 0, 0, 0, 0];

  var movementKeys = [w, a, s, d];
  movementKeys.map(function(key, index) {
    key.press = function() {
      isaac.setVelocity(movePresses, index + 1);
    }
    key.release = function() {
      isaac.setVelocity(movePresses, -index - 1);
    }
  });

  var shootKeys = [i, j, k, l];
  shootKeys.map(function(key, index) {
    key.press = function() {
      isaac.isShooting = true;
      isaac.setFaceDir(facePresses, index + 1);
    }
    key.release = function() {
      key.isUp = true;
      if (i.isUp && j.isUp && k.isUp && l.isUp) {
        isaac.isShooting = false;
      }
      isaac.setFaceDir(facePresses, -index - 1);
    }
  });
}

module.exports = init;
