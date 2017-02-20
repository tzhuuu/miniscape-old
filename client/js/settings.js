class Settings {

  constructor() {
    this.camera = {
      width: window.innerWidth,
      height: window.innerHeight
    }

  }
}

var instance = new Settings();

module.exports = instance;
