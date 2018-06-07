function updateV() {
  this.vx += this.ax;
  this.vy += this.ay;
}

function predict() {
  let next = {};
  next.x = this.x + this.vx;
  next.y = this.y + this.vy;
  next.width = this.width;
  next.height = this.height;
  next.vx = this.vx;
  next.vy = this.vy;
  return next;
}

function update(predicted) {
  this.x = predicted.x;
  this.y = predicted.y;
  this.vx = predicted.vx;
  this.vy = predicted.vy;
}


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
  constructor(sprite) {
    this.sprite = sprite;
    this.x = sprite.x;
    this.y = sprite.y;
    this.width = sprite.width;
    this.height = sprite.height;
    equipPhysics(this);
  }
}
exports.PhysicalObject = PhysicalObject
