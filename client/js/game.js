var Layers = require('./layers');
var Map = require('./map');

var Character = require('./models/character');
var Projectile = require('./models/projectile');

var game = {};

game.play = function(){
  updateCharacters();
  updateProjectiles();
}

var updateCharacters = function() {
  // move sprites
  for(var i = 0; i < Layers.getLayer('characters').children.length; i++) {
    var character = Layers.getLayer('characters').children[i];
    character.move(Map.getMap('town'));
    if (character.isShooting){
      character.shoot();
    }
  }
}

var updateProjectiles = function() {
  // move projectiles
  for (var i=0; i<Layers.getLayer('projectiles').children.length; i++){
    var projectile = Layers.getLayer('projectiles').children[i];
    projectile.move();
    
    if (projectile.growthRate > 0){
      projectile.grow();
    }

    // check collision
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

      var charCollision = bump.hit(projectile.children[0], character.sprite, false, false, true);
      if (charCollision){
        projectile.hit.push(character.name);
        character.takeDamage();
      }
    }
  }
}


module.exports = game;
