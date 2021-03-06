function takeSprite(a, sprite) {
  a.sprite = sprite;
  a.x = sprite.x;
  a.y = sprite.y;
  a.width = sprite.width;
  a.height = sprite.height;
}
exports.takeSprite = takeSprite;

function equipPhysics(a) {
  a.ax = 0;
  a.ay = 0;

  a.vx = 0;
  a.vy = 0;

  a.updateV = updateV;
  a.predict = predict;
  a.update = update;
}
exports.equipPhysics = equipPhysics;

class PhysicalObject {
  static fromSprite(sprite) {
    const p = new PhysicalObject();
    takeSprite(p, sprite);
    return p;
  }

  updateState() {
    this.updateV();
    this.updatePhysicalState();
    this.updateSpriteXY();
  }

  constructor() {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;

    this.vx = 0;
    this.vy = 0;

    this.ax = 0;
    this.ay = 0;
  }

  updateV() {
    this.vx += this.ax;
    this.vy += this.ay;
  }

  updateSpriteXY() {
    this.sprite.x = this.x;
    this.sprite.y = this.y;
  }

  updateWHFromSprite() {
    this.width = this.sprite.width;
    this.height = this.sprite.height;
  }

  predict() {
    const next = {...this};
    next.x = this.x + this.vx;
    next.y = this.y + this.vy;
    return next;
  }

  fixBy(fix) {
    for (const key in fix) {
      this[key] += fix[key];
    }
  }

  update(pt) {
    Object.assign(this, pt);
  }
}
exports.PhysicalObject = PhysicalObject
