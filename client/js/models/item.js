// create an item

var Item = function(options) {

  PIXI.Container.call(this);
  this.sprite = new PIXI.Sprite(options.texture) || null;
  
  this.x = 250;
  this.y = 250;

  this.addChild(this.sprite);
}

Item.prototype = Object.create(PIXI.Container.prototype);
Item.prototype.constructor = Item;

Item.prototype.activate = function(character){
  character.poweredUp = true;
  character.powerUpDuration = 3000;
  character.powerUpPickupTime = Date.now();
  character.beforePowerUp = {
    'shotSpeed': character.shotSpeed,
    'bulletSpeed': character.bulletSpeed
  }
  character.shotSpeed /= 4;
  character.bulletSpeed *= 2;
}

module.exports = Item;
