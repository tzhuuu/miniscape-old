// create the HUD

var Hud = function() {
  this.sprite = new PIXI.Sprite();
  //this.container = new PIXI.DisplayObjectContainer();
  PIXI.Container.call(this);

  this.x = 0;
  this.y = window.innerHeight - 100;

  this.backgroundColor = 0x061639;

  // adding the white rectangle
  this.background = new PIXI.Graphics();
  this.background.beginFill(0xFFFFFF);
  this.background.drawRect(0, 0, 300, 100);
  this.background.endFill();

  this.charInfo = new PIXI.Sprite.fromImage('../imgs/isaac.png');
  this.charInfo.x = 0;
  this.charInfo.y = 0;
  this.charInfo.width = 100;
  this.charInfo.height = 100;
  this.charInfo.interactive = true;
  this.charInfo.buttonMode = true;
  this.charInfo.on('pointerdown', function(){
    console.log('clicked charInfo');
  })

  this.talents = new PIXI.Sprite.fromImage('../imgs/isaac.png');
  this.talents.x = 100;
  this.talents.y = 0;
  this.talents.width = 100;
  this.talents.height = 100;
  this.talents.interactive = true;
  this.talents.buttonMode = true;
  this.talents.on('pointerdown', function(){
    console.log('clicked talents');
  })

  this.inventory = new PIXI.Sprite.fromImage('../imgs/isaac.png');
  this.inventory.x = 200;
  this.inventory.y = 0;
  this.inventory.width = 100;
  this.inventory.height = 100;
  this.inventory.interactive = true;
  this.inventory.buttonMode = true;
  this.inventory.on('pointerdown', function(){
    console.log('clicked inventory');
  })
  
  this.addChild(this.background);
  this.addChild(this.charInfo);
  this.addChild(this.talents);
  this.addChild(this.inventory);
}

Hud.prototype = Object.create(PIXI.Container.prototype);
Hud.prototype.constructor = Hud;

module.exports = Hud;
