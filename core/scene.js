class Scene {
  constructor(options) {
    let physicals = options.physicals || [];
    let platforms = options.platforms || [];

    this.physicals = [];
    this.platforms = [];
    for (let physical of physicals) {
      this.addPhysical(physical);
    }
    for (let platform of platforms) {
      this.addPlatform(platform);
    }
  }

  get sprites() {
    return this.physicals.concat(this.platforms)
      .filter(obj => obj.sprite)
      .map(obj => obj.sprite);
  }

  addPhysical(p) {
    this.physicals.push(p);
    p.scene = this;
  }

  addPlatform(p) {
    this.platforms.push(p);
    p.scene = this;
  }

  updateState() {
    for (let physical of this.physicals) {
      physical.updateState();
    }
  }
}
exports.Scene = Scene;
