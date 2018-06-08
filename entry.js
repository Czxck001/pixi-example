"use strict";
const fs = require("fs");
const path = require("path");

const PIXI = require('pixi.js')

const { StatefulSprite } = require('./utils/stateful.js');
const { Player, setupKeys } = require("./core/player.js");
const { SoftPlatform, Block, makeBoundaries } = require("./core/platform.js");
const { Scene } = require("./core/scene.js");
const { layout } = require("./utils/scroll.js");


// Using global constants to set the parameters of scene in agility.
const HORIZONTAL_SPEED = 1;
const GRAVITY_ACCELERATION = 0.1;
const JUMP_INITIAL_SPEED = 3;
const WIDTH = 160, HEIGHT = 104;

const BACKGROUND_COLOR = 0x1f3d7a;
const OBJECT_TINT = 0xa3a3c2;
const KEYMAP = { left: 37, up: 38, right: 39, down: 40 };

// Using global variables to accelerate the deveoplment process.
const app = new PIXI.Application({
  width: WIDTH, height: HEIGHT,
  antialias: false, transparent: false, resolution: 2,
  backgroundColor: BACKGROUND_COLOR
});
window.document.body.appendChild(app.view);

// Resources
const resources_dir = "resources"
const people_png = path.join(resources_dir, "small_strange_people.png"),
      soft_platform_png = path.join(resources_dir, "soft_platform.png"),
      hard_platform_png = path.join(resources_dir, "hard_platform.png"),
      brick_png = path.join(resources_dir, "brick.png");

// Use Pixi's built-in `loader` object to load an image
PIXI.loader
  .add('people', people_png)  // 8 * 16
  .add('soft_platform', soft_platform_png)  // 32 * 4
  .add('hard_platform', hard_platform_png)  // 32 * 8
  .add('brick', brick_png)  // 32 * 32
  .load(setup);

// This `setup` function will run when the image has loaded
function setup(loader, resources) {
  const people = Player.fromSprite(
    new StatefulSprite({
      right: new PIXI.Sprite(new PIXI.Texture(
        resources.people.texture,
        {x: 0, y: 0, width: 8, height: 16}
      )),
      left: new PIXI.Sprite(new PIXI.Texture(
        resources.people.texture,
        {x: 8, y: 0, width: 8, height: 16}
      ))
    }, 'right')
  );

  people.x = 32;
  people.ay = GRAVITY_ACCELERATION;

  const layout_toml_text = fs.readFileSync(
    path.join(resources_dir, "layout.toml"), "utf-8"
  )

  const environment = layout(layout_toml_text, resources);

  // Boundaries are blocks
  const boundaries = makeBoundaries(WIDTH, HEIGHT);

  // Gather block objects
  const blocks = environment.hard_platforms
    .concat(environment.bricks)
    .map(sprite => Block.fromSprite(sprite))
    .concat(boundaries);

  const soft_platforms = environment.soft_platforms.map(
    sprite => SoftPlatform.fromSprite(sprite)
  );

  const scene = new Scene({
    physicals: [people],
    platforms: blocks.concat(soft_platforms)
  });

  // Add sprites to scene
  for (const sprite of scene.sprites) {
    app.stage.addChild(sprite);
  }

  // Bind the player with the keyboard.
  setupKeys(people, KEYMAP, {
    horizontal: HORIZONTAL_SPEED,
    jump: JUMP_INITIAL_SPEED
  });

  // Enter game loop using app.ticker
  app.ticker.add(() => {
    scene.updateState();
  })
}
