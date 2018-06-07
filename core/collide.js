exports.hitTheTop = takeBoxified(hitTheTop);
exports.onTopOf = takeBoxified(onTopOf);
exports.hitTheBottom = takeBoxified(hitTheBottom);
exports.hitTheLeft = takeBoxified(hitTheLeft);
exports.hitTheRight = takeBoxified(hitTheRight);

function boxify(sprite) {
  // Boxify the sprite so that we can handily detect box collision
  let box = {};

  box.l = sprite.x;
  box.r = sprite.x + sprite.width;
  box.u = sprite.y;
  box.d = sprite.y + sprite.height;

  return box;
}

function takeBoxified(func) {
  // Wrap a function taking sprite-like (x-width, y-height) object
  // into a function taking boxes (l, r, u, d).
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
  // Detection of a hit by a moving object (a) to a static object (b)
  // in one direction (top for this function).
  // a is the current status of the moving object; at is the predicted (next)
  // status of the moving object.
  return (
    // a currently above or on b, while at the next moment a is below b
    a.d <= b.u && at.d > b.u
    // Or, a currently above b, while at the next moment a is on b
    || a.d < b.u && at.d == b.u
    // And, a or at overlaps b in another dimension (horizontally).
  ) && (overlapX(a, b) || overlapX(at, b));
}

function onTopOf(a, b) {
  return a.d == b.u && overlapX(a, b);
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
