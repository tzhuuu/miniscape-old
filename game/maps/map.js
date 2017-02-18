var Map = function(width, height) {
  this.size = {
    width: width || 0,
    height: height || 0
  }
  this.textures = {};
  this.layout = [];
  this.npcs = [];
  this.wallSprites = [];
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
    "            XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "                                       X",
    "                                       X",
    "                                       X",
    "                                       X",
    "                                       X",
    "                                       X",
    "                                       X",
    "                                       X",
    "                                       X",
    "                                       X",
    "                                       X",
    "                                       X",
    "                                       X",
    "                                       X",
    "                                       X",
    "                                       X",
    "                                       X",
    "                                       X",
    "                                       X",
    "                                       X",
    "X                                      X",
    "X           C                          X"
  ];

  key = {
    ' ': 'base',
    'X': 'wall',
    'C': 'water',
  };

  var tWidth = textures.base.width;
  var tHeight = textures.base.height;
  var scaleX = screenSize.width / (mapString[0].length * tWidth);
  var scaleY = screenSize.height / (mapString.length *tHeight);
  this.wallSprites = [];

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
            this.wallSprites.push(ground);
          }
          container.addChild(ground);

          break;
        }
      }
    }
  }

}

module.exports = Map;
