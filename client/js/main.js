// globals
var state;
var renderer;
var stage;
var sprites = {};
var projectiles = [];
var bump = new Bump(PIXI);
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
}

function create() {
}

function update() {
}

// aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    Graphics = PIXI.Graphics,
    scalesMode = PIXI.scalesMode;

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

    // set shooting info
    isaac.isShooting = false;
    isaac.faceDir = 'down';
    isaac.shotSpeed = 100;
    isaac.bulletSpeed = 7.5;
    isaac.lastShot = Date.now();

    // set velocity
    isaac.speed = 5;
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

var calcMoveDir = function(presses, latest, dir){
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

Sprite.prototype.setVelocity = function(dir){
  this.vx = dir[0] * this.speed;
  this.vy = -dir[1] * this.speed; // PIXI down is positive
  if (dir[0] * dir[1] != 0){
    this.vx /= Math.pow(2, 1/2);
    this.vy /= Math.pow(2, 1/2);
  }
}

var calcFaceDir = function(presses, latest){
  var dir;
  var key = Math.abs(latest);
  if (latest < 0){
    presses[key] = 0;
    dir = presses.indexOf(presses.max());
  }
  else{
    presses[key] = presses.max() + 1;
    dir = key;
  }
  return dir;
}

Sprite.prototype.setFaceDir = function(dir){
  if (dir == 1){
    this.faceDir = 'up';
  }
  else if (dir == 2){
    this.faceDir = 'left';
  }
  else if (dir == 3){
    this.faceDir = 'down';
  }
  else if (dir == 4){
    this.faceDir = 'right';
  }
}

Sprite.prototype.shoot = function(){
  if (Date.now() - this.lastShot > this.shotSpeed){
    this.lastShot = Date.now();
    if (this.faceDir == 'up'){
      makeProjectile(this.x + this.width/2, this.y + this.height/2, this.vx, -this.bulletSpeed);
    }
    else if (this.faceDir == 'left'){
      makeProjectile(this.x + this.width/2, this.y + this.height/2, -this.bulletSpeed, this.vy);
    }
    else if (this.faceDir == 'down'){
      makeProjectile(this.x + this.width/2, this.y + this.height/2, this.vx, this.bulletSpeed);
    }
    else{
      makeProjectile(this.x + this.width/2, this.y + this.height/2, this.bulletSpeed, this.vy);
    }
  }
}

Sprite.prototype.move = function(){
    this.x += this.vx;
    this.y += this.vy;
}

// var Bullet = function (game, key) {

//     Phaser.Sprite.call(this, game, 0, 0, key);

//     this.texture.baseTexture.scaleMode = scaleModes.NEAREST;

//     this.anchor.set(0.5);

//     this.checkWorldBounds = true;
//     this.outOfBoundsKill = true;
//     this.exists = false;

//     this.tracking = false;
//     this.scaleSpeed = 0;
// };

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

Graphics.prototype.move = function(){
    this.x += this.vx;
    this.y += this.vy;
}

var initControls = function(){
  console.log(stage);
  var isaac = sprites['isaac'];
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

  w.press = function(){
    calcMoveDir(movePresses, 1, moveDir);
    isaac.setVelocity(moveDir);
  }
  w.release = function(){
    calcMoveDir(movePresses, -1, moveDir);
    isaac.setVelocity(moveDir);
  }
  a.press = function(){
    calcMoveDir(movePresses, 2, moveDir);
    isaac.setVelocity(moveDir);
  }
  a.release = function(){
    calcMoveDir(movePresses, -2, moveDir);
    isaac.setVelocity(moveDir);
  }
  s.press = function(){
    calcMoveDir(movePresses, 3, moveDir);
    isaac.setVelocity(moveDir);
  }
  s.release = function(){
    calcMoveDir(movePresses, -3, moveDir);
    isaac.setVelocity(moveDir);
  }
  d.press = function(){
    calcMoveDir(movePresses, 4, moveDir);
    isaac.setVelocity(moveDir);
  }
  d.release = function(){
    calcMoveDir(movePresses, -4, moveDir);
    isaac.setVelocity(moveDir);
  }
  i.press = function(){
    isaac.isShooting = true;
    isaac.setFaceDir(calcFaceDir(facePresses, 1));
  }
  i.release = function(){
    if (j.isUp && k.isUp && l.isUp){
      isaac.isShooting = false;
    }
    isaac.setFaceDir(calcFaceDir(facePresses, -1));
  }
  j.press = function(){
    isaac.isShooting = true;
    isaac.setFaceDir(calcFaceDir(facePresses, 2));
  }
  j.release = function(){   
    if (i.isUp && k.isUp && l.isUp){
      isaac.isShooting = false;
    }
    isaac.setFaceDir(calcFaceDir(facePresses, -2));
  }
  k.press = function(){
    isaac.isShooting = true;
    isaac.setFaceDir(calcFaceDir(facePresses, 3));
  }
  k.release = function(){
    if (i.isUp && j.isUp && l.isUp){
      isaac.isShooting = false;
    }
    isaac.setFaceDir(calcFaceDir(facePresses, -3));
  }
  l.press = function(){
    isaac.isShooting = true;
    isaac.setFaceDir(calcFaceDir(facePresses, 4));
  }      
  l.release = function(){
    if (i.isUp && j.isUp && k.isUp){
      isaac.isShooting = false;
    }
    isaac.setFaceDir(calcFaceDir(facePresses, -4));
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
  // move sprites
  for(var key in sprites){
    if (!sprites.hasOwnProperty(key)){
      continue
    };
    var sprite = sprites[key];
    sprite.move();
    if (sprite.isShooting){
      sprite.shoot();
    }
  }
  // move projectiles
  //console.log(projectiles.length);
  var out = [];
  for (var i=0; i<projectiles.length; i++){
    projectiles[i].move();
    // check collision
    var collision = bump.contain(projectiles[i], {x: -25, y: -25, width: window.innerWidth + 50, height: window.innerHeight + 50});
    if (collision){
      out.push(i);
    }
  }
  // remove projectiles that are past bounds
  out.sort(function(a,b){ return b - a; });
  if (out.length)
  for (var i=out.length-1; i>=0; i--){
    //var projectile = projectiles[out[i]];
    projectiles.splice(out[i], 1);
    //stage.removeChild(projectile);
  }
}

var init = function(){
  initStage();
  initSprites();
}
init();