exports.makeBoundaries = makeBoundaries;


function makeBoundaries(width, height) {
  let boundaries = [];

  boundaries[0] = {x: 0, width: width, y: 0, height: 0};  // up
  boundaries[1] = {x: 0, width: 0, y: 0, height: height}; // left
  boundaries[2] = {x: 0, width: width, y: height, height: 0};  // down
  boundaries[3] = {x: width, width: 0, y: 0, height: height};  // right

  return boundaries;
}
