var Settings = require('./settings');

class Camera {

  constructor(container, position, map, track) {
    this.container = container;
    this.position = position;
    this.map = map;
    this.track = track; // tracked object
  }

  recalculate() {
    if (this.map.size.width > Settings.camera.width) {
      this.updateX = this.updateXBigger;
    } else {
      this.updateX = this.updateXSmaller;
      this.container.x = -this.map.size.width/2 + Settings.camera.width/2;
    }

    if (this.map.size.height > Settings.camera.height) {
      this.updateY = this.updateYBigger;
    } else {
      this.updateY = this.updateYSmaller;
      this.container.y = -this.map.size.height/2 + Settings.camera.height/2;
    }
  }

  update() {
    this.updateX();
    this.updateY();
  }

  updateXBigger() {
    // move the camera so that track is in the middle
    if (this.track.x - Settings.camera.width/2 < 0) {
      this.container.x = 0;
    } else if (this.track.x + Settings.camera.width/2 > this.map.size.width) {
      this.container.x = Settings.camera.width - this.map.size.width;
    } else {
      // this.container.x = this.track.x + Settings.camera.width/2;
      this.container.x = Settings.camera.width/2 - this.track.x ;
    }
  }

  updateYBigger() {
    // move the camera so that track is in the middle
    if (this.track.y - Settings.camera.height/2 < 0) {
      this.container.y = 0;
    } else if (this.track.y + Settings.camera.height/2 > this.map.size.height) {
      this.container.y = Settings.camera.height - this.map.size.height;
    } else {
      // this.container.y = this.track.y + Settings.camera.height/2;
      this.container.y = Settings.camera.height/2 - this.track.y;
    }
  }

  updateXSmaller() {
    return;
  }

  updateYSmaller() {
    return;
  }

}

module.exports = Camera;
