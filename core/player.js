const { PhysicalObject, takeSprite } = require("./physics.js");


class Player extends PhysicalObject {
  static fromSprite(sprite) {
    let p = new Player();
    takeSprite(p, sprite);
    return p;
  }

  updateState() {
    this.updateV();
    this.updatePhysicalState();
    this.updateSprite();
  }

  isOnTheGround() {
    return this.scene.platforms.some(p => p.acceptIsOnTheGround(this));
  }

  isOnTheSoftGround() {
    return this.scene.platforms.some(p => p.acceptIsOnTheSoftGround(this));
  }

  updatePhysicalState() {
    // Delayed prediction, waiting for the fix by collision check.
    const pt = this.predict();

    for (let platform of this.scene.platforms) {
      // Double dispatch here (the Visitor Pattern)
      platform.acceptCollision(this, pt);
    }

    this.update(pt);
  }
}
exports.Player = Player;
