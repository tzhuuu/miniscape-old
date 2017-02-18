var Map = function(width, height) {
  this.size = {
    width: width || 0,
    height: height || 0
  }
  this.textures = {};
  this.layout = [];
  this.npcs = [];
};


Map.prototype.addToLayout = function(textureName, x, y) {
  this.layout.push(
    {
      name: textureName,
      x: x,
      y: y
    }
  );
};

Map.prototype.readMap = function(mapString, key, textures, container, screenSize) {
  mapString = [
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "X      C                               X",
    "X         C                            X",
    "X         C                            X",
    "X           C                          X",
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
  ];

  key = {
    ' ': 'base',
    'X': 'wall',
    'C': 'water',
  };

  for (var i = 0; i < mapString.length; i++) {
    var line = mapString[i];
    for (var j = 0; j < line.length; j++) {
      var c = line.charAt(j);

      for (var k in key) {
        if (!key.hasOwnProperty(k)) continue;

        if (c == k) {
          var texture = textures[key[k]];
          var ground = new PIXI.Sprite(texture)
          ground.x = ground.width * j;
          ground.y = ground.height * i;
          container.addChild(ground);

          break;
        }
      }
    }
  }

}

module.exports = Map;
