// aliases
global.Container = PIXI.Container,
global.autoDetectRenderer = PIXI.autoDetectRenderer,
global.loader = PIXI.loader,
global.resources = PIXI.loader.resources,
global.Sprite = PIXI.Sprite,
global.Graphics = PIXI.Graphics,
global.Container = PIXI.Container;

// globals
global.characters;
global.projectiles;
global.foreground;
global.state;
global.renderer;
global.stage;
global.bump = new Bump(PIXI);

// requires
var Character = require('./models/character');
var Projectile = require('./models/projectile');
var Map = require('../../game/maps/map');

var init = function(gameLoop, map) {
  preload(gameLoop, map);
  initPixi();
  // gameLoop();
}

// load textures
var preload = function(gameLoop, map) {
  return PIXI.loader
    .add([
       "./imgs/isaac.png",
       "./imgs/krampus.png",
       "./imgs/ground61.png",
       "./imgs/ground62.png",
       "./imgs/ground67.png",
     ])
    .load(function() {
      setup(gameLoop, map)
    });
}

// pixi attaching keyboard handlers
var keyboard = function(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  // the `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  // the `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  // attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}


// set up pixi
var initPixi = function() {
  // create the renderer
  renderer = autoDetectRenderer(256, 256);
  renderer.backgroundColor = 0x061639;
  renderer.view.style.position = "absolute";
  renderer.view.style.display = "block";
  renderer.autoResize = true;
  renderer.resize(window.innerWidth, window.innerHeight);

  // add the canvas to the HTML document
  document.body.appendChild(renderer.view);

  // create a container object called the `stage`
  stage = new Container();

  // tell stage to order layers by zIndex
  stage.updateLayersOrder = function () {
    stage.children.sort(function(a,b) {
        a.zIndex = a.zIndex || 0;
        b.zIndex = b.zIndex || 0;
        return b.zIndex - a.zIndex
    });
  };

  renderer.render(stage);

  // TODO: set up all the containers we need somewhere else
  foreground = new PIXI.Container();
  foreground.zIndex = 0;
  stage.addChild(foreground);
  stage.updateLayersOrder();

  projectiles = new PIXI.Container();
  foreground.addChild(projectiles);

  characters = new PIXI.Container();
  foreground.addChild(characters);

}

// set up the game
var setup = function(gameLoop, map) {
  var width = window.innerWidth;
  var height = window.innerHeight;

  // create isaac sprite from texture
  var isaac = new Character(loader.resources["./imgs/isaac.png"].texture,
              'isaac', window.innerWidth/2, window.innerHeight/2, 5, 'down', 200, 7.5);

  var krampus = new Character(loader.resources["./imgs/krampus.png"].texture,
                'krampus', window.innerWidth/2, 0, 0, 'down', 1000, 1, true);

  characters.addChild(isaac);
  characters.addChild(krampus);

  // rerender stage
  renderer.render(stage);
  initMap(width, height, map);
  initControls();
  stage.updateLayersOrder();

  gameLoop();
}

var initMap = function(width, height, map) {

  map[0] = new Map(80, 45);

  map[0].textures = {
    base: loader.resources['./imgs/ground61.png'].texture,
    ground: loader.resources['./imgs/ground61.png'].texture,
    wall: loader.resources['./imgs/ground62.png'].texture,
    water: loader.resources['./imgs/ground67.png'].texture,
  }

  var container = new PIXI.Container();
  container.zIndex = 10;
  stage.addChild(container);
  map[0].readMap('', '', map[0].textures, container, {width: width, height: height});

};

var initControls = function(){
  var isaac = characters.getChildAt(0);

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
