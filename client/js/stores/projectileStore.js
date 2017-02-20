class ProjectileStore{
  
  constructor(){
    this.projectiles = {};
  }

  addProjectile(name, projectile){
    this.projectiles[name] = projectile;
  }
  getProjectile(name) {
    return this.projectiles[name];
  }
}

var instance = new ProjectileStore();
Object.freeze(instance);
module.exports = instance;