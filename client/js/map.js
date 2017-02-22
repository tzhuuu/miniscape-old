var Layers = require('./layers');

class Maps {

  constructor() {
    this.maps = {};
  }

  getMap(name) {
    return this.maps[name];
  }

  addMap(name, map) {
    this.maps[name] = map;
  }

  removeMap(name) {
    delete this.maps[name];
  }

  createMap(mapString, key, textures, container, unit) {
    /*
      mapString - a list of strings that represent the map
      key - maps characters to a texture name
      textures - maps texture name to an actual texture object
      container - the container the textures should be added to
      screenSize - dimensions of the screen
    */
    var map = new Map(unit);
    map.textures = textures;

    var tWidth = textures.base.width;
    var tHeight = textures.base.height;
    // var scaleX = screenSize.width / (mapString[0].length * tWidth);
    // var scaleY = screenSize.height / (mapString.length *tHeight);
    var scaleX = unit / tWidth;
    var scaleY = unit / tHeight;

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
              ground.flags = {
                'top': mapString[i - 1] ? mapString[i - 1].charAt(j) != 'X' : false,  // true if you need to check
                'bottom': mapString[i + 1] ? mapString[i + 1].charAt(j) != 'X' : false,
                'left': mapString[i].charAt(j-1) ? mapString[i].charAt(j - 1) != 'X' : false,
                'right': mapString[i].charAt(j+1) ? mapString[i].charAt(j + 1) != 'X' : false
              };
            }
            container.addChild(ground);
            break;
          }
        }
      }
    }
    console.log(map.wallSprites);
    map.size = {
      width: ground.width * mapString[0].length,
      height: ground.height * mapString.length
    }
    map.container = container;
    container.displayGroup = Layers.getDisplayGroup('background');
    return map;
  }
}

// map object definition
var Map = function(unit) {
  this.unit = unit;
  this.container = null;
  this.textures = {};
  this.npcs = [];
  this.wallSprites = [];
  this.size = {
    width: 0,
    height: 0
  }
}

var instance = new Maps();
Object.freeze(instance);

module.exports = instance;
