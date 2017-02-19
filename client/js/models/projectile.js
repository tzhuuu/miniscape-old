var Projectile = function(graphic, from, x, y, vx, vy){

  PIXI.Container.call(this);

  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;

  this.addChild(graphic);
  this.from = from;
  this.hit = [];

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

Projectile.make = function(x, y, vx, vy, from) {
  var circle = new Graphics();
  circle.beginFill(0x9966FF);
  circle.drawCircle(7, 7, 7);
  circle.endFill();
  circle.x = 0;
  circle.y = 0;
  var projectile = new Projectile(circle, from, x, y, vx, vy);
  projectiles.addChild(projectile);
}

module.exports = Projectile;
