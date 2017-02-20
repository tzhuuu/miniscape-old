class Maps {

  constructor() {
    this.maps = {};
  }

  getMap(name) {
    return this.maps[name];
  }

  setMap(name, map) {
    this.maps[name] = map;
  }

  removeMap(name) {
    delete this.maps[name];
  }

  createMap(mapString, key, textures, container, screenSize) {
    /*
      mapString - a list of strings that represent the map
      key - maps characters to a texture name
      textures - maps texture name to an actual texture object
      container - the container the textures should be added to
      screenSize - dimensions of the screen
    */
    var map = new Map(screenSize);

    var tWidth = textures.base.width;
    var tHeight = textures.base.height;
    var scaleX = screenSize.width / (mapString[0].length * tWidth);
    var scaleY = screenSize.height / (mapString.length *tHeight);

    for (var i = 0; i < mapString.length; i++) {
      var line = mapString[i];
      for (var j = 0; j < line.length; j++) {
        var c = line.charAt(j);

        for (var k in key) {
          if (!key.hasOwnProperty(k)) continue;

          if (c == k) {
            var texture = textures[key[k]];
            var ground = new PIXI.Sprite(texture)
            ground.width = ground.width * scaleX;
            ground.height = ground.height * scaleY;
            ground.x = ground.width * j;
            ground.y = ground.height * i;
            if (c == 'X') {
              map.wallSprites.push(ground);
            }
            container.addChild(ground);
            break;
          }
        }
      }
    }
    return map;
  }
}

// map object definition
var Map = function(screenSize) {
  this.size = {
    width: screenSize.width || 0,
    height: screenSize.height || 0
  }
  this.textures = {};
  this.npcs = [];
  this.wallSprites = [];
}

var instance = new Maps();
Object.freeze(instance);

module.exports = instance;
