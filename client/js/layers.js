class Layers {

  constructor() {
    this.layers = {};
    this.displayGroups = {};
  }

  setRenderer(renderer) {
    this.layers['renderer'] = renderer;
  }

  setStage(stage) {
    this.layers['stage'] = stage;
  }

  addLayer(name, zOrder, parent) {
    var parentLayer = this.layers[parent];
    var layer = new PIXI.Container();
    this.layers[name] = layer;
    parentLayer.addChild(layer);
  }

  addDisplayGroup(name, zOrder) {
    var displayGroup = new PIXI.DisplayGroup(-zOrder, true);
    this.displayGroups[name] = displayGroup
  }

  getLayer(name) {
    return this.layers[name];
  }

  getDisplayGroup(name) {
    return this.displayGroups[name];
  }
}

var instance = new Layers();
Object.freeze(instance);

module.exports = instance;
