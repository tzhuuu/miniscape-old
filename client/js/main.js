// aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    Graphics = PIXI.Graphics;

var Map = require('../../game/maps/map.js');

// globals
var state;
var renderer;
var stage;
var sprites = {};
var projectiles = [];
var bump = new Bump(PIXI);
var playerContainer;
var map;

// aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    Graphics = PIXI.Graphics;

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

  stage.updateLayersOrder = function () {
    stage.children.sort(function(a,b) {
        a.zIndex = a.zIndex || 0;
        b.zIndex = b.zIndex || 0;
        return b.zIndex - a.zIndex
    });
};
  renderer.render(stage);
}

var initSprites = function(width, height){
  // load images
  PIXI.loader
    .add([
       "../imgs/isaac.png",
       "imgs/ground61.png",
       "imgs/ground62.png",
       "imgs/ground67.png",
     //  "../imgs/ .png",
     //  "../imgs/ .png"
     ])
    .load(setup);

  playerContainer = new PIXI.Container();
  playerContainer.zIndex = 9;
  stage.updateLayersOrder();
  stage.addChild(playerContainer);

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


    var scaleFactor = (height /5) / isaac.height;
    isaac.scale.x = scaleFactor;
    isaac.scale.y = scaleFactor;
    // isaac.width = width / 15;
    // isaac.height = height/ 15;

    // add isaac to stage
    playerContainer.addChild(isaac);

    // add to list of sprites
    sprites['isaac'] = isaac;

    // set game state
    state = play;

    // rerender stage
    renderer.render(stage);

    initMap(width, height);
    initControls();
    stage.updateLayersOrder();
    gameLoop();
  }
}

var initMap = function(width, height) {

  map = new Map(80, 45);

  map.textures = {
    base: loader.resources['imgs/ground61.png'].texture,
    ground: loader.resources['imgs/ground61.png'].texture,
    wall: loader.resources['imgs/ground62.png'].texture,
    water: loader.resources['imgs/ground67.png'].texture,
  }

  map.addToLayout('wall', 0, 0);
  map.addToLayout('wall', 0, 0);
  map.addToLayout('wall', 0, 0);
  map.addToLayout('wall', 0, 0);


  var container = new PIXI.Container();
  container.zIndex = 10;
  stage.addChild(container);
  map.readMap('', '', map.textures, container, {width: width, height: height});

};

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
    circle.zIndex = -10;
    playerContainer.addChild(circle);

}


Graphics.prototype.move = function(){
    this.x += this.vx;
    this.y += this.vy;
}

var initControls = function(){
  console.log(stage);
  var isaac = sprites['isaac'];

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
  movementKeys.map(function(k, i) {
    k.press = function() {
      calcMoveDir(movePresses, i + 1, moveDir);
      isaac.setVelocity(moveDir);
    }
    k.release = function() {
      calcMoveDir(movePresses, -i - 1, moveDir);
      isaac.setVelocity(moveDir);
    }
  });



  // w.press = function(){
  //   calcMoveDir(movePresses, 1, moveDir);
  //   isaac.setVelocity(moveDir);
  // }
  // w.release = function(){
  //   calcMoveDir(movePresses, -1, moveDir);
  //   isaac.setVelocity(moveDir);
  // }
  // a.press = function(){
  //   calcMoveDir(movePresses, 2, moveDir);
  //   isaac.setVelocity(moveDir);
  // }
  // a.release = function(){
  //   calcMoveDir(movePresses, -2, moveDir);
  //   isaac.setVelocity(moveDir);
  // }
  // s.press = function(){
  //   calcMoveDir(movePresses, 3, moveDir);
  //   isaac.setVelocity(moveDir);
  // }
  // s.release = function(){
  //   calcMoveDir(movePresses, -3, moveDir);
  //   isaac.setVelocity(moveDir);
  // }
  // d.press = function(){
  //   calcMoveDir(movePresses, 4, moveDir);
  //   isaac.setVelocity(moveDir);
  // }
  // d.release = function(){
  //   calcMoveDir(movePresses, -4, moveDir);
  //   isaac.setVelocity(moveDir);
  // }
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

  for (var i = 0; i < out.length; i++) {
    projectiles[out[i]] = null;
  }

  var j = 0;
  for (var i = 0; i < projectiles.length; i++) {
    if (projectiles[i]) {
      projectiles[j] = projectiles[i];
      j++;
    }
  }
  projectiles.splice(j, projectiles.length - j);
  // // remove projectiles that are past bounds
  // out.sort(function(a,b){ return b - a; });
  // if (out.length)
  // for (var i=out.length-1; i>=0; i--){
  //   //var projectile = projectiles[out[i]];
  //   // projectiles.splice(out[i], 1);
  //   //stage.removeChild(projectile);
  // }
}

var init = function(){
  initStage();
  initSprites(window.innerWidth, window.innerHeight);
}
init();
