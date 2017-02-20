var Config = {};

Config.assets = {
  images: [
    "./imgs/isaac.png",
    "./imgs/krampus.png",
    "./imgs/ground61.png",
    "./imgs/ground62.png",
    "./imgs/ground67.png",
  ],
  sounds: [

  ]
}

Config.layers = [
  {
    name: 'camera',
    zIndex: 0,
    parent: 'stage'
  },
  {
    name: 'foreground',
    zIndex: 0,
    parent: 'camera'
  },
  {
    name: 'background',
    zIndex: 10,
    parent: 'camera'
  },
  {
    name: 'characters',
    zIndex: 0,
    parent: 'foreground'
  },
  {
    name: 'projectiles',
    zIndex: -1,
    parent: 'foreground'
  },
  {
    name: 'items',
    zIndex: 1,
    parent: 'foreground'
  }
]

Config.models = [
  {
    name: 'character',
    path: './models/character'
  },
  {
    name: 'healthbar',
    path: './models/healthbar'
  },
  {
    name: 'projectile',
    path: './models/projectile'
  }
]

module.exports = Config;
