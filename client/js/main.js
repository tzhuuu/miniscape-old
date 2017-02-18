// aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    Graphics = PIXI.Graphics,
    Container = PIXI.Container;

var Map = require('../../game/maps/map.js');

// globals
var state;
var renderer;
var stage;
var characters = {};
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

var Character = function(sprite, name, x, y, speed,
                         faceDir, shotSpeed, bulletSpeed){

  this.sprite = sprite;
  this.name = name;
  
  this.spriteContainer = new Container();
  this.spriteContainer.x = x;
  this.spriteContainer.y = y;
  this.spriteContainer.addChild(this.sprite);

  // set shooting info
  this.isShooting = false;
  this.faceDir = faceDir;
  this.shotSpeed = shotSpeed;
  this.bulletSpeed = bulletSpeed;
  this.lastShot = Date.now();

  // set velocity
  this.speed = speed;
  this.vx = 0;
  this.vy = 0;

  // create the health bar
  var healthBar = new PIXI.DisplayObjectContainer();
  this.healthBar = healthBar;
  healthBar.position.set(sprite.x, sprite.y)

  // create the black background rectangle
  var innerBar = new PIXI.Graphics();
  innerBar.beginFill(0x000000);
  innerBar.drawRect(sprite.x + sprite.width/4, sprite.y + sprite.height/6, sprite.width/2, 6);
  innerBar.endFill();
  healthBar.addChild(innerBar);

  // create the front red rectangle
  var outerBar = new PIXI.Graphics();
  this.outerBar = outerBar;
  outerBar.beginFill(0xFF3300);
  outerBar.drawRect(sprite.x + sprite.width/4, sprite.y + sprite.height/6, sprite.width/2, 6);
  outerBar.endFill();
  healthBar.addChild(outerBar);

  healthBar.outer = outerBar;
  
  this.spriteContainer.addChild(healthBar);
  playerContainer.addChild(this.spriteContainer);
}

var Projectile = function(graphic, from){
  this.graphic = graphic;
  this.from = from;
}

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
       "../imgs/krampus.png",
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
    var isaac = new Character(new Sprite(
      loader.resources["../imgs/isaac.png"].texture
    ), 'isaac', window.innerWidth/2, window.innerHeight/2, 5, 'down', 200, 7.5);

    var krampus = new Character(new Sprite(
      loader.resources["../imgs/krampus.png"].texture
    ), 'krampus', window.innerWidth/2, 0, 0, 'down', 300, 4);

    characters['isaac'] = isaac;
    characters['krampus'] = krampus;

    // var scaleFactor = (height /5) / isaac.height;
    // isaac.scale.x = scaleFactor;
    // isaac.scale.y = scaleFactor;
    // isaac.width = width / 15;
    // isaac.height = height/ 15;

    // add isaac to stage
    //playerContainer.addChild(isaac);

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

Character.prototype.setVelocity = function(dir){
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

Character.prototype.setFaceDir = function(dir){
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

Character.prototype.shoot = function(){
  if (Date.now() - this.lastShot > this.shotSpeed){
    this.lastShot = Date.now();
    if (this.faceDir == 'up'){
      makeProjectile(this.spriteContainer.x + this.spriteContainer.width/2, this.spriteContainer.y + this.spriteContainer.height/2, this.vx, -this.bulletSpeed, this.name);
    }
    else if (this.faceDir == 'left'){
      makeProjectile(this.spriteContainer.x + this.spriteContainer.width/2, this.spriteContainer.y + this.spriteContainer.height/2, -this.bulletSpeed, this.vy, this.name);
    }
    else if (this.faceDir == 'down'){
      makeProjectile(this.spriteContainer.x + this.spriteContainer.width/2, this.spriteContainer.y + this.spriteContainer.height/2, this.vx, this.bulletSpeed, this.name);
    }
    else{
      makeProjectile(this.spriteContainer.x + this.spriteContainer.width/2, this.spriteContainer.y + this.spriteContainer.height/2, this.bulletSpeed, this.vy, this.name);
    }
  }
}

Character.prototype.move = function(){
  this.spriteContainer.x += this.vx;
  this.spriteContainer.y += this.vy;
}

Character.prototype.takeDamage = function(){
  this.healthBar.outer.width /= 2;
}

var makeProjectile = function(x, y, vx, vy, from){
    var circle = new Graphics();
    circle.beginFill(0x9966FF);
    circle.drawCircle(0, 0, 7);
    circle.endFill();
    circle.x = x;
    circle.y = y;
    circle.vx = vx;
    circle.vy = vy;
    var projectile = new Projectile(circle, from);
    projectiles.push(projectile);
    circle.zIndex = -10;
    playerContainer.addChild(circle);
}

Projectile.prototype.move = function(){
    this.graphic.x += this.graphic.vx;
    this.graphic.y += this.graphic.vy;
}

var initControls = function(){
  var isaac = characters['isaac'];

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
  for(var key in characters){
    if (!characters.hasOwnProperty(key)){
      continue
    };
    var character = characters[key];
    character.move();
    if (character.isShooting){
      character.shoot();
    }
  }
  // move projectiles
  var out = [];
  for (var i=0; i<projectiles.length; i++){
    projectiles[i].move();
    // check collision
    var boundsCollision = bump.contain(projectiles[i].graphic, {x: -25, y: -25, width: window.innerWidth + 50, height: window.innerHeight + 50});
    if (boundsCollision){
      out.push(i);
    }
    for (var key in characters){
      if (!characters.hasOwnProperty(key)){
        continue;
      }
      if (projectiles[i].from == character.name){
        continue;
      }
      var character = characters[key];
      var charCollision = bump.hitTestCircleRectangle(projectiles[i].graphic, character.spriteContainer);
      if (charCollision){
        character.takeDamage();
      }
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
}

var init = function(){
  initStage();
  initSprites(window.innerWidth, window.innerHeight);
}
init();
