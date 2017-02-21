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

  var rect = new PIXI.Graphics();
  rect.beginFill(0xFFFF00);
  rect.drawRect(sprite.x, sprite.y, sprite.width, sprite.height);
  rect.endFill();
  this.addChild(rect);
  this.swapChildren(rect, sprite);
}

Projectile.prototype = Object.create(PIXI.Container.prototype);
Projectile.prototype.constructor = Projectile;

Projectile.prototype.move = function() {
  this.x += this.vx;
  this.y += this.vy;
  this.zOrder = -(this.y + this.height/2 - 5);
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
