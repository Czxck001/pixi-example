const { takeSprite } = require("./physics.js");
const {
  hitTheTop, onTopOf, hitTheBottom, hitTheLeft, hitTheRight,
  CollisionFix
} = require("./collide.js");

class Platform {
  acceptIsOnTheGround(p) {
    return onTopOf(p, this);
  }
}

class SoftPlatform extends Platform {
  // TODO: find if this can be lift up to Platform
  static fromSprite(sprite) {
    let sp = new SoftPlatform();
    takeSprite(sp, sprite);
    return sp;
  }

  acceptCollision(p, pt) {
    if (hitTheTop(p, pt, this)) {
      if (pt.toFall) {
        pt.toFall = false;
      } else {
        pt.y = this.y - pt.height;
        pt.vy = 0;
      }
    }
  }
  acceptIsOnTheSoftGround(p) {
    return this.acceptIsOnTheGround(p);
  }
}
exports.SoftPlatform = SoftPlatform;

class Block extends Platform {
  static fromSprite(sprite) {
    let b = new Block();
    takeSprite(b, sprite);
    return b;
  }

  acceptCollision(p, pt) {
    if (hitTheTop(p, pt, this)) {
      p.toFall = false;
      pt.y = this.y - pt.height;
      pt.vy = 0;
    }
    if (hitTheBottom(p, pt, this)) {
      pt.y = this.y + this.height;
      pt.vy = 0;
    }
    if (hitTheLeft(p, pt, this)) {
      pt.x = this.x - pt.width;
    }
    if (hitTheRight(p, pt, this)) {
      pt.x = this.x + this.width;
    }
  }

  acceptIsOnTheSoftGround(p) {
    return false;
  }

}
exports.Block = Block;
