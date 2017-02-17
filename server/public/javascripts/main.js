// aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

// globals for rendering
var renderer;
var stage;
var sprites = {};

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
       "../img/isaac.png"
     //  "../img/ .png",
     //  "../img/ .png"
     ])
    .load(setup);

  // will run when image has loaded
  function setup() {
    // create isaac sprite from texture
    var isaac = new Sprite(
      loader.resources["../img/isaac.png"].texture
    );

    // move top left of isaac to (96, 96)
    isaac.position.set(96, 96);

    // set rotation anchor to center of isaac
    isaac.anchor.set(0.5, 0.3);
    isaac.rotation = 0;

    // add isaac to stage
    stage.addChild(isaac);

    // add to list of sprites
    sprites['isaac'] = isaac;

    // rerender stage
    renderer.render(stage);
  }
}

var gameLoop = function(){
  // loop this function at 60 frames per second
  requestAnimationFrame(gameLoop);

  // move the cat 1 pixel to the right each frame
  sprites['isaac'].rotation += 0.05;

  // render the stage to see the animation
  renderer.render(stage);
}

var init = function(){
  initStage();
  initSprites();
  gameLoop();
}
init();