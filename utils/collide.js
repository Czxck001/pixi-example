exports.hitTheTop = takeBoxified(hitTheTop);
exports.onTopOf = takeBoxified(onTopOf);
exports.hitTheBottom = takeBoxified(hitTheBottom);
exports.hitTheLeft = takeBoxified(hitTheLeft);
exports.hitTheRight = takeBoxified(hitTheRight);

function boxify(sprite) {
  let box = {};

  box.l = sprite.x;
  box.r = sprite.x + sprite.width;
  box.u = sprite.y;
  box.d = sprite.y + sprite.height;

  return box;
}

function takeBoxified(func) {
  return (...params) => {
    let boxifieds = params.map(boxify);
    return func(...boxifieds);
  }
}

function overlapX(a, b) {
  return a.l < b.r && a.r > b.l;
}

function overlapY(a, b) {
  return a.u < b.d && a.d > b.u;
}

function hitTheTop(a, at, b) {
  return (a.d <= b.u && at.d > b.u
          || a.d < b.u && at.d == b.u)
         && (overlapX(a, b) || overlapX(at, b));
}

function onTopOf(a, b) {
  return a.d == b.u
         && overlapX(a, b);
}

function hitTheBottom(a, at, b) {
  return (a.u >= b.d && at.u < b.d
          || a.u > b.d && at.u == b.d)
         && (overlapX(a, b) || overlapX(at, b));
}

function hitTheLeft(a, at, b) {
  return (a.r <= b.l && at.r > b.l
          || a.r < b.l && at.r == b.l)
         && (overlapY(a, b) || overlapY(at, b));
}

function hitTheRight(a, at, b) {
  return (a.l >= b.r && at.l < b.r
          || a.l > b.r && at.l == b.r)
         && (overlapY(a, b) || overlapY(at, b));
}
