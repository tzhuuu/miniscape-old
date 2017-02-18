// aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

// globals
var state;
var renderer;
var stage;
var sprites = {};

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

var initStage = function(){
  // create the renderer
  // height, width, optional custom literal: {antialias: false, transparent: false, resolution: 1}
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

  // tell the `renderer` to `render` the `stage`
  renderer.render(stage);
}

var initSprites = function(){
  // load images
  PIXI.loader
    .add([
       "../imgs/isaac.png"
     //  "../imgs/ .png",
     //  "../imgs/ .png"
     ])
    .load(setup);

  // will run when image has loaded
  function setup() {
    // create isaac sprite from texture
    var isaac = new Sprite(
      loader.resources["../imgs/isaac.png"].texture
    );

    // set position
    isaac.position.set(0, 0);

    // set rotation
    isaac.anchor.set(0.5, 0.3);
    isaac.rotation = 0;

    // set velocity
    isaac.vx = 0;
    isaac.vy = 0;

    // add isaac to stage
    stage.addChild(isaac);

    // add to list of sprites
    sprites['isaac'] = isaac;

    // set game state
    state = play;

    // rerender stage
    renderer.render(stage);

    initControls();
    gameLoop();
  }
}

var initControls = function(){
  var isaac = sprites['isaac'];
  var w = keyboard(119);
  var a = keyboard(65);
  var s = keyboard(83);
  var d = keyboard(68);
  w.press = function() {
    isaac.vy = -5;
  };
  w.release = function() {
    isaac.vy = 0;
  };
  a.press = function() {
    isaac.vx = -5;
  };
  a.release = function() {
    isaac.vx = 0;
  };
  s.press = function() {
    isaac.vy = 5;
  };
  s.release = function() {
    isaac.vy = 0;
  };
  d.press = function() {
    isaac.vx = 5;
  };
  d.release = function() {
    isaac.vx = 0;
  };
}

var gameLoop = function(){
  // loop this function at 60 frames per second
  requestAnimationFrame(gameLoop);

  // update current game state
  state();

  // render the stage to see the animation
  renderer.render(stage);
}

var play = function(){
  var isaac = sprites['isaac'];
  // move the cat 1 pixel to the right each frame
  isaac.x += isaac.vx;
  isaac.y += isaac.vy;
  isaac.rotation += 0.05;
}

var init = function(){
  initStage();
  initSprites();
}
init();