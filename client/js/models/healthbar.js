// create the health bar

var HealthBar = function(spriteContainer, sprite) {
  this.sprite = sprite;
  this.topContainer = spriteContainer;
  this.container = new PIXI.DisplayObjectContainer();

  this.container.x = 0;
  this.container.y = 0;

  this.container.backgroundColor = 0x061639;


  // adding the black rectangle
  this.innerBar = new PIXI.Graphics();
  this.innerBar.beginFill(0x000000);
  this.innerBar.drawRect(sprite.width/4, 0, sprite.width/2, 6);
  this.innerBar.endFill();

  this.container.addChild(this.innerBar);

  this.outerBar = new PIXI.Graphics();
  this.outerBar.beginFill(0xFF3300);
  this.outerBar.drawRect(sprite.width/4, 0, sprite.width/2, 6);
  this.outerBar.endFill();

  this.container.addChild(this.outerBar);
  
}

module.exports = HealthBar;
