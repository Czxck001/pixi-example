exports.equipPhysics = equipPhysics;


function updateV() {
  this.vx += this.ax;
  this.vy += this.ay;
}


function clone() {
  // return Object.assign({}, this};
  let cloned = {};

  cloned.x = this.x;
  cloned.width = this.width;
  cloned.y = this.y;
  cloned.height = this.height;

  cloned.vx = this.vx;
  cloned.vy = this.vy;

  return cloned;
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


function updateP() {
  this.x += this.vx;
  this.y += this.vy;
}


function equipPhysics(a) {
  a.ax = 0;
  a.ay = 0;

  a.vx = 0;
  a.vy = 0;

  a.updateV = updateV;
  a.clone = clone;
  a.predict = predict;
  a.updateP = updateP;
}
