const { takeSprite } = require("./physics.js");
const {
  hitTheTop, onTopOf, hitTheBottom, hitTheLeft, hitTheRight,
  CollisionFix
} = require("./collide.js");

class Platform {
  constructor(options) {
    options = options || {};

    this.x = options.x || 0;
    this.y = options.y || 0;
    this.width = options.width || 0;
    this.height = options.height || 0;
  }

  acceptIsOnTheGround(p) {
    return onTopOf(p, this);
  }
}

class SoftPlatform extends Platform {
  static fromSprite(sprite) {
    const sp = new SoftPlatform();
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
    const sp = new Block();
    takeSprite(sp, sprite);
    return sp;
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


function makeBoundaries(width, height) {
  const boundaries = [];

  boundaries.push(new Block({x: 0, width: width, y: 0, height: 0}));  // u
  boundaries.push(new Block({x: 0, width: 0, y: 0, height: height})); // l
  boundaries.push(new Block({x: 0, width: width, y: height, height: 0}));  // d
  boundaries.push(new Block({x: width, width: 0, y: 0, height: height}));  // r

  return boundaries;
}
exports.makeBoundaries = makeBoundaries;
