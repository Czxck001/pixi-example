const {
  hitTheTop, onTopOf, hitTheBottom, hitTheLeft, hitTheRight
} = require("../utils/collide.js");

const { PhysicalObject } = require("../utils/physics.js");


class Player extends PhysicalObject {
  updateState() {
    this.updateV();
    this.updatePhysicalState();
    this.updateSprite();
  }

  updateSprite() {
    this.sprite.x = this.x;
    this.sprite.y = this.y;
  }

  get platforms() {
    return this.soft_platforms.concat(this.blocks);
  }

  onTheSoftGround() {
    return this.soft_platforms.some(platform => onTopOf(this, platform));
  }

  onTheGround() {
    return this.platforms.some(platform => onTopOf(this, platform));
  }

  updatePhysicalState() {
    const p = this;

    // Delayed prediction, waiting for the fix by collision check.
    const pt = this.predict();

    // Check collection in each direction.
    // If collision is found in one direction,
    // the prediction will be fixed at once.

    // TODO: Simplify the collection fix by polymorphism.
    if (this.toFall) {
      this.toFall = false;
    } else {
      for (let bottom of this.platforms) {
        if (hitTheTop(p, pt, bottom)) {
          pt.y = bottom.y - pt.height;
          pt.vy = 0;
        }
      }
    }

    for (let top of this.blocks) {
      if (hitTheBottom(p, pt, top)) {
        pt.y = top.y + top.height;
        pt.vy = 0;
      }
    }

    for (let right of this.blocks) {
      if (hitTheLeft(p, pt, right)) {
        pt.x = right.x - pt.width;
      }
    }

    for (let left of this.blocks) {
      if (hitTheRight(p, pt, left)) {
        pt.x = left.x + left.width;
      }
    }

    p.update(pt);
  }
}
exports.Player = Player;
