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

Config.displayGroups = [
  {
    name: 'foreground',
    zOrder: 0
  },
  {
    name: 'background',
    zOrder: 1
  }
]

Config.layers = [
  {
    name: 'camera',
    parent: 'stage'
  },
  {
    name: 'hud',
    parent: 'stage'
  },
  {
    name: 'foreground',
    parent: 'camera'
  },
  {
    name: 'background',
    parent: 'camera'
  },
  {
    name: 'characters',
    parent: 'foreground'
  },
  {
    name: 'projectiles',
    parent: 'foreground'
  },
  {
    name: 'items',
    parent: 'foreground'
  },
  {
    name: 'items',
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
