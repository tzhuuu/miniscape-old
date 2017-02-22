var Layers = require('../layers');

var Projectile = function(sprite, x, y, vx, vy, from, options){

  PIXI.Container.call(this);

  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;

  this.sprite = sprite;
  this.addChild(sprite);
  this.from = from;
  this.hit = [];

  // parse options
  this.growthRate = options.growthRate || 0;
}

Projectile.prototype = Object.create(PIXI.Container.prototype);
Projectile.prototype.constructor = Projectile;

Projectile.prototype.move = function(timeDelta) {
  var multiplyer = timeDelta / 1000;
  this.x += this.vx * multiplyer;
  this.y += this.vy * multiplyer;
  this.zOrder = -(this.y);
}

Projectile.prototype.grow = function() {
  this.sprite.width *= this.growthRate;
  this.sprite.height *= this.growthRate;
}

Projectile.make = function(x, y, vx, vy, from, options) {
  var bulletSprite = new PIXI.Sprite(options.bulletTexture);
  bulletSprite.circular = true;
  var projectile = new Projectile(bulletSprite, x, y, vx, vy, from, options);
  Layers.getLayer('projectiles').addChild(projectile);
  projectile.displayGroup = Layers.getDisplayGroup('foreground');
}

module.exports = Projectile;
