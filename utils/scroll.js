exports.makeBoundaries = makeBoundaries;
exports.layout = layout;

const toml = require("toml");


function makeBoundaries(width, height) {
  // Create sprite-like representations for boundaries
  let boundaries = [];

  boundaries[0] = {x: 0, width: width, y: 0, height: 0};  // up
  boundaries[1] = {x: 0, width: 0, y: 0, height: height}; // left
  boundaries[2] = {x: 0, width: width, y: height, height: 0};  // down
  boundaries[3] = {x: width, width: 0, y: 0, height: height};  // right

  return boundaries;
}

function layout(toml_text, resources) {
  // Create sprites according to layout file
  const layout_dict = toml.parse(toml_text);

  const sprites = {}
  for (const [key, setting] of Object.entries(layout_dict)) {
    const key_sprites = [];
    for (const location of setting.locations) {
      const new_sprite = new PIXI.Sprite(resources[key].texture);
      new_sprite.x = location[0];
      new_sprite.y = location[1];
      key_sprites.push(new_sprite);
    }
    if (setting.tint) {
      key_sprites.forEach(sprite => {sprite.tint = parseInt(setting.tint)});
    }
    sprites[key + "s"] = key_sprites;
  }
  return sprites;
}
