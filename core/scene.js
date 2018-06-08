class Scene {
  constructor(options) {
    const physicals = options.physicals || [];
    const platforms = options.platforms || [];

    this.physicals = [];
    this.platforms = [];
    for (const physical of physicals) {
      this.addPhysical(physical);
    }
    for (const platform of platforms) {
      this.addPlatform(platform);
    }
  }

  get sprites() {
    return this.platforms.concat(this.physicals)
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
    for (const physical of this.physicals) {
      physical.updateState();
    }
  }
}
exports.Scene = Scene;
