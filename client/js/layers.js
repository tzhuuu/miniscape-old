class Layers {

  constructor() {
    this.layers = {};
  }

  setRenderer(renderer) {
    this.layers['renderer'] = renderer;
  }

  setStage(stage) {
    this.layers['stage'] = stage;
    this.attachUpdateLayersOrder(stage);
  }

  addLayer(name, zIndex, parent) {
    var parentLayer = this.layers[parent];
    var layer = new PIXI.Container();
    this.layers[name] = layer;
    layer.zIndex = zIndex || 0;
    parentLayer.addChild(layer);
    parentLayer.updateLayersOrder();
    this.attachUpdateLayersOrder(layer);
  }

  attachUpdateLayersOrder(layer) {
    layer.updateLayersOrder = function () {
      layer.children.sort(function(a,b) {
          a.zIndex = a.zIndex || 0;
          b.zIndex = b.zIndex || 0;
          return b.zIndex - a.zIndex
      });
    };
  }

  getLayer(name) {
    return this.layers[name];
  }
}

var instance = new Layers();
Object.freeze(instance);

module.exports = instance;
