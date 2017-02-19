var init = require('./init');

var Character = require('./models/character');
var Projectile = require('./models/projectile');

var bump = new Bump(PIXI);

var map;

var gameLoop = function(){
  // loop this function at 60 frames per second
  requestAnimationFrame(gameLoop);

  // update current game state
  state();

  // render the stage to see the animation
  renderer.render(stage);
}

var play = function(){
  updateCharacters();
  updateProjectiles();
}
state = play;

var updateCharacters = function() {
  // move sprites
  for(var i = 0; i < characters.children.length; i++) {
    var character = characters.children[i];
    character.move();
    if (character.isShooting){
      character.shoot();
    }
  }
}

var updateProjectiles = function() {
  // move projectiles
  for (var i=0; i<projectiles.children.length; i++){
    var projectile = projectiles.children[i];
    projectile.move();

    // check collision
    var boundsCollision = bump.contain(projectile,
                          {x: -25, y: -25, width: window.innerWidth + 50, height: window.innerHeight + 50});
    if (boundsCollision){
      projectiles.removeChild(projectile);
    }
    for (var j = 0; j < characters.children.length; j++) {
      var character = characters.children[j];
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

init(gameLoop);
