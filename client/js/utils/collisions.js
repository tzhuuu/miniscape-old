
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

  hitTestRectangle(a, b) {
    var aTopLeft = a.toGlobal(new PIXI.Point(0, 0));
    var aBottomRight = a.toGlobal(new PIXI.Point(a.width, a.height));
    var bTopLeft = b.toGlobal(new PIXI.Point(0, 0));
    var bBottomRight = b.toGlobal(new PIXI.Point(b.width, b.height));

    // check a.top is in between b.top and b.bottom
    if (b.flags.bottom){
      if (aTopLeft.y > bTopLeft.y && aTopLeft.y < bBottomRight.y) {
        // 
      }
    }

    // check a.bottom is in between b.top and b.bottom
    if (aBottomRight.y > bTopLeft.y && aBottomRight.y < bBottomRight.y) {
      // 
    }

    // check a.left is in between b.left and b.right
    if (aTopLeft.x > bTopLeft.x && aTopLeft.x < bBottomRight.x) {

    }

    // check a.right is in between b.left and b.right
    if (aBottomRight.x > bTopLeft.x && aBottomRight.x < bBottomRight.x) {
      
    }
  }
}

var instance = new Collisions();
Object.freeze(instance);

module.exports = instance;