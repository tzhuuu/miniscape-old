var HealthBar = require('./healthbar');
var Projectile = require('./projectile');
var Layers = require('../layers');
var Settings = require('../settings');

var Character = function(options) {

  options = options || {};

  PIXI.Container.call(this);
  this.coordinates = {x:  options.x, y: options.y};

  this.name = options.name || "";
  this.x = options.x * Settings.unit || 0;
  this.y = options.y * Settings.unit || 0;
  this.speed = options.speed || 100;
  this.faceDir = options.faceDir || 'down';
  this.shotSpeed = options.shotSpeed || 1000;
  this.bulletSpeed = options.bulletSpeed || 0;
  this.isShooting = options.isShooting || false;
  this.projectileOptions = options.projectileOptions || {};
  this.lastShot = Date.now();

  for (var p in options) {
    if (!options.hasOwnProperty(p)) continue;
    this.p = options[p];
  }

  this.sprite = new PIXI.Sprite(options.texture);

  this.sprite.y = 10;
  this.addChild(this.sprite);
  // this.height += 10;

  var rect = new PIXI.Graphics();
  rect.beginFill(0xFFFFFF);
  rect.drawRect(this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height);
  rect.endFill();
  this.addChild(rect);
  this.swapChildren(rect, this.sprite);

  // console.log(this.container.w)

  this.vx = 0;
  this.vy = 0;

  // attach a healthbar
  this.healthBar = new HealthBar(this, this.sprite);
  this.addChild(this.healthBar.container);
  this.displayGroup = Layers.getDisplayGroup('foreground');
}

Character.prototype = Object.create(PIXI.Container.prototype);
Character.prototype.constructor = Character;

Character.prototype.setVelocity = function(presses, latest){
  var dir = [0, 0];

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
      dir[1] = -1;
    }
    else if (presses[1] < presses[3]){
      dir[1] = 1;
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
  this.vx = dir[0] * this.speed;
  this.vy = dir[1] * this.speed; // PIXI down is positive
  if (dir[0] * dir[1] != 0){
    this.vx /= Math.pow(2, 1/2);
    this.vy /= Math.pow(2, 1/2);
  }
}

var faceDir = {
  1: 'up',
  2: 'left',
  3: 'down',
  4: 'right'
}
Character.prototype.setFaceDir = function(presses, latest){
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
  this.faceDir = faceDir[dir];


}

Character.prototype.takeDamage = function(){
  console.log('taking damage');
  this.healthBar.outerBar.width -= 5;
  this.healthBar.outerBar.x += 2.5;
  if (this.healthBar.outerBar.width < 0) {
    this.die();
  }
}

Character.prototype.move = function(map){
  this.x += this.vx;
  this.y += this.vy;

  for (var i = map.wallSprites.length - 1; i >= 0; i--) {
  	var s = map.wallSprites[i];
    if (bump.hit(this.sprite, s, false, false, true)) {
      this.x -= this.vx;
      this.y -= this.vy;
      this.zOrder = -(this.y + this.height/2);
  		return;
  	}
  }
  this.zOrder = -(this.y + this.height/2);
}

Character.prototype.shoot = function(){
  if (Date.now() - this.lastShot > this.shotSpeed){
    this.lastShot = Date.now();
    if (this.faceDir == 'up'){
      Projectile.make(this.x + this.width/2, this.y + this.height/2, this.vx, -this.bulletSpeed, this.name, this.projectileOptions);
    }
    else if (this.faceDir == 'left'){
      Projectile.make(this.x + this.width/2, this.y + this.height/2, -this.bulletSpeed, this.vy, this.name, this.projectileOptions);
    }
    else if (this.faceDir == 'down'){
      Projectile.make(this.x + this.width/2, this.y + this.height/2, this.vx, this.bulletSpeed, this.name, this.projectileOptions);
    }
    else{
      Projectile.make(this.x + this.width/2, this.y + this.height/2, this.bulletSpeed, this.vy, this.name, this.projectileOptions);
    }
  }
}

Character.prototype.die = function(){
  Layers.getLayer('characters').removeChild(this);
}

module.exports = Character;
