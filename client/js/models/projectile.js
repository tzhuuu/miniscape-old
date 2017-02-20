var Layers = require('../layers');

var Projectile = function(graphic, x, y, vx, vy, from, options){

  PIXI.Container.call(this);

  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;

  this.graphic = graphic;
  this.addChild(graphic);
  this.from = from;
  this.hit = [];

  // parse options
  this.growthRate = options.growthRate || 0;

  var rect = new PIXI.Graphics();
  rect.beginFill(0xFFFF00);
  rect.drawRect(graphic.x, graphic.y, graphic.width, graphic.height);
  rect.endFill();
  this.addChild(rect);
  this.swapChildren(rect, graphic);
}

Projectile.prototype = Object.create(PIXI.Container.prototype);
Projectile.prototype.constructor = Projectile;

Projectile.prototype.move = function() {
  this.x += this.vx;
  this.y += this.vy;
}

Projectile.prototype.grow = function() {
  //this.scale.x *= this.growthRate;
  this.width *= this.growthRate;
  //this.scale.y *= this.growthRate;
  this.height *= this.growthRate;
}

Projectile.make = function(x, y, vx, vy, from, options) {
  var bulletSprite = new PIXI.Sprite(options.bulletTexture);
  bulletSprite.circular = true;
  var projectile = new Projectile(bulletSprite, x, y, vx, vy, from, options);
  Layers.getLayer('projectiles').addChild(projectile);
}

module.exports = Projectile;
