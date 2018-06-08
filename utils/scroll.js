exports.makeBoundaries = makeBoundaries;
exports.layout = layout;

const toml = require("toml");

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
