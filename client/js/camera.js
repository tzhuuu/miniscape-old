var Settings = require('./settings');

class Camera {

  constructor(container, position, map, track) {
    this.container = container;
    this.position = position;
    this.map = map;
    this.track = track; // tracked object
  }

  update() {
    if (this.track.x - Settings.camera.width/2 < 0) {
      this.container.x = 0;
    } else if (this.track.x + Settings.camera.width/2 > this.map.size.width) {
      this.container.x = Settings.camera.width - this.map.size.width;
    } else {
      // this.container.x = this.track.x + Settings.camera.width/2;
      this.container.x = Settings.camera.width/2 - this.track.x ;
    }

    if (this.track.y - Settings.camera.height/2 < 0) {
      this.container.y = 0;
    } else if (this.track.y + Settings.camera.height/2 > this.map.size.height) {
      this.container.y = Settings.camera.height - this.map.size.height;
    } else {
      // this.container.y = this.track.y + Settings.camera.height/2;
      this.container.y = Settings.camera.height/2 - this.track.y;
    }
  }

}

module.exports = Camera;
