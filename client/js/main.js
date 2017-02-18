// aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    Graphics = PIXI.Graphics;

// globals
var state;
var renderer;
var stage;
var sprites = {};
var projectiles = [];
var speed = 5;

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

    isaac.direction = 'down';
    isaac.isShooting = false;
    isaac.shotSpeed = 200;
    isaac.lastShot = Date.now();

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

// so can do presses.max() to get max in array
Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

var calcDir = function(presses, latest, dir){
  var key = Math.abs(latest);
  if (latest < 0){
    presses[key] = 0;
  }
  else{
    presses[key] = presses.max() + 1;
  }
  if (presses.max() == 0){
    dir[0] = 0;
    dir[1] = 0;
  }
  else{
    // 1 = up, 2 = left, 3 = down, 4 = right
    if (presses[1] > presses[3]){
      dir[1] = 1;
    }
    else if (presses[1] < presses[3]){
      dir[1] = -1;
    }
    else{
      dir[1] = 0;
    }
    if (presses[2] > presses[4]){
      dir[0] = -1;
    }
    else if (presses[2] < presses[4]){
      dir[0] = 1;
    }
    else{
      dir[0] = 0;
    }
  }
}

var setVelocity = function(sprite, speed, dir){
  sprite.vx = dir[0] * speed;
  sprite.vy = -dir[1] * speed; // PIXI down is positive
  if (dir[0] * dir[1] != 0){
    sprite.vx /= Math.pow(2, 1/2);
    sprite.vy /= Math.pow(2, 1/2);
  }
}

var makeProjectile = function(x, y, vx, vy){
    var circle = new Graphics();
    circle.beginFill(0x9966FF);
    circle.drawCircle(0, 0, 7);
    circle.endFill();
    circle.x = x;
    circle.y = y;
    circle.vx = vx;
    circle.vy = vy;
    projectiles.push(circle);
    stage.addChild(circle);
}

var contain = function (sprite, container) {
  var collision = undefined;
  
  // left
  if (sprite.x < container.x) {
    collision = "left";
  }

  // top
  if (sprite.y < container.y) {
    collision = "top";
  }

  // right
  if (sprite.x + sprite.width > container.width) {
    collision = "right";
  }

  // bottom
  if (sprite.y + sprite.height > container.height) {
    collision = "bottom";
  }

  // return the `collision` value
  return collision;
}

var initControls = function(){
  var isaac = sprites['isaac'];
  speed = 5;
  var w = keyboard(87),
      a = keyboard(65),
      s = keyboard(83),
      d = keyboard(68),
      i = keyboard(73),
      j = keyboard(74),
      k = keyboard(75),
      l = keyboard(76);
  var presses = [0, 0, 0, 0, 0]; 
  var dir = [0, 0];

  w.press = function(){
    calcDir(presses, 1, dir);
    setVelocity(isaac, speed, dir);
  }
  w.release = function(){
    calcDir(presses, -1, dir);
    setVelocity(isaac, speed, dir);
  }
  a.press = function(){
    calcDir(presses, 2, dir);
    setVelocity(isaac, speed, dir);
  }
  a.release = function(){
    calcDir(presses, -2, dir);
    setVelocity(isaac, speed, dir);
  }
  s.press = function(){
    calcDir(presses, 3, dir);
    setVelocity(isaac, speed, dir);
  }
  s.release = function(){
    calcDir(presses, -3, dir);
    setVelocity(isaac, speed, dir);
  }
  d.press = function(){
    calcDir(presses, 4, dir);
    setVelocity(isaac, speed, dir);
  }
  d.release = function(){
    calcDir(presses, -4, dir);
    setVelocity(isaac, speed, dir);
  }
  i.press = function(){
    isaac.direction = 'up';
    isaac.isShooting = true;
  }
  j.press = function(){
    isaac.direction = 'down';
    isaac.isShooting = true;
  }
  k.press = function(){
    isaac.direction = 'right';
    isaac.isShooting = true;
  }
  l.press = function(){
    isaac.direction = 'left';
    isaac.isShooting = true;
  }      
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
  for(var key in sprites){
    if (!sprites.hasOwnProperty(key)){
      continue
    };
    var sprite = sprites[key];
    sprite.x += sprite.vx;
    sprite.y += sprite.vy;
    if (sprite.direction != null){
      if (sprite.isShooting && Date.now() - sprite.lastShot > sprite.shotSpeed){
        sprite.lastShot = Date.now();
        if (sprite.direction == 'up'){
          makeProjectile(sprite.x + sprite.width/2, sprite.y + sprite.height/2, sprite.vx, -speed);
        }
        else if (sprite.direction == 'left'){
          makeProjectile(sprite.x + sprite.width/2, sprite.y + sprite.height/2, speed, sprite.vy);
        }
        else if (sprite.direction == 'down'){
          makeProjectile(sprite.x + sprite.width/2, sprite.y + sprite.height/2, -speed, sprite.vy);
        }
        else{
          makeProjectile(sprite.x + sprite.width/2, sprite.y + sprite.height/2, sprite.vx, speed);
        }
      }
    }
  }
  for (var i=0; i<projectiles.length; i++){
    projectiles[i].x += projectiles[i].vx;
    projectiles[i].y += projectiles[i].vy;
    if(contain(projectiles[i], stage)){
      projectiles.splice(i, 1);
    }
  }
  console.log(projectiles.length);
}

var init = function(){
  initStage();
  initSprites();
}
init();