var Layers = require('./layers');
var Map = require('./map');
var Camera = require('./camera');
var Collisions = require('./utils/collisions');

var Character = require('./models/character');
var Projectile = require('./models/projectile');

var game = {};
var camera;

game.play = function(timeDelta){
  updateCharacters();
  updateProjectiles();
  camera.update();
  updateFps(timeDelta);
}

var fpsText;
var cooldown = 100;
var td = 0;
var style = new PIXI.TextStyle({
  stroke: '#ffffff',
  fill: ['#ffffff'],
});
var updateFps = function(timeDelta) {
  td += timeDelta;
  if (td < cooldown) return;
  fpsText.text = Math.trunc(1000/timeDelta);
  td = 0;
}

game.setup = function() {
  camera = new Camera(Layers.getLayer('camera'), null, Map.getMap('town'), Layers.getLayer('characters').children[0]);
  camera.recalculate();

  // Add fps to top right
  fpsText = new PIXI.Text('Basic text in pixi', style);
  fpsText.x = 0;
  fpsText.y = 0;

  Layers.getLayer('stage').addChild(fpsText);
}

var updateCharacters = function() {
  // move sprites
  for(var i = 0; i < Layers.getLayer('characters').children.length; i++) {
    var character = Layers.getLayer('characters').children[i];
    character.move(Map.getMap('town'));
    if (character.isShooting){
      if (character.shootsAt){
        character.shootAt(character.shootsAt);
      }
      else{
        character.shoot();
      }
    }

    // check powerup duration
    if (character.poweredUp){
      if (Date.now() - character.powerUpDuration > character.powerUpPickupTime){
        console.log('deactivate');
        character.poweredUp = false;
        for (var p in character.beforePowerUp){
          if (!character.beforePowerUp.hasOwnProperty(p)) continue;
          character[p] = character.beforePowerUp[p];
        }
      }
    }
  }
}

var updateProjectiles = function() {
  // move projectiles
  for (var i=0; i<Layers.getLayer('projectiles').children.length; i++){
    var projectile = Layers.getLayer('projectiles').children[i];
    projectile.move(Map.getMap('town'));

    if (projectile.growthRate > 0){
      projectile.grow();
    }

    // temporary cleanup for out of bounds projectiles while we fix collision lag
    var boundsCollision = bump.contain(projectile,
                          {x: -25, y: -25, width: window.innerWidth + 50, height: window.innerHeight + 50});
    if (boundsCollision){
      Layers.getLayer('projectiles').removeChild(projectile);
    }
    for (var j = 0; j < Layers.getLayer('characters').children.length; j++) {
      var character = Layers.getLayer('characters').children[j];
      if (projectile.from === character.name ||
          projectile.hit.indexOf(character.name) != -1){
        continue;
      }

      var charCollision = bump.hit(projectile.sprite, character.sprite, false, false, true);
      if (charCollision){
        projectile.hit.push(character.name);
        character.takeDamage();
      }
    }
  }
}


module.exports = game;
