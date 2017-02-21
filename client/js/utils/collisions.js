
class Collisions{
  
  // a is circle, b is rectangle
  hitCircleRectangle(a, b){
    var aGlobal = a.toGlobal(new PIXI.Point(a.width/2, a.width/2))
    var bGlobal = b.toGlobal(new PIXI.Point(a.width/2, a.height/2));
    var deltaX = aGlobal.x - Math.max(bGlobal.x, Math.min(aGlobal.x, bGlobal.x + b.width));
    var deltaY = aGlobal.y - Math.max(bGlobal.y, Math.min(aGlobal.y, bGlobal.y + b.height));
    return (deltaX * deltaX + deltaY * deltaY) < (a.width/2 * a.width/2);
  }
 
  hit(a, b){
    if (a.circular && !b.circular){
      return this.hitCircleRectangle(a, b);
    }
    else if (!a.circular && b.circular){
      return this.hitCircleRectangle(b, a);
    }
  }
}

var instance = new Collisions();
Object.freeze(instance);

module.exports = instance;