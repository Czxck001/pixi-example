"use strict";
const fs = require("fs");
const path = require("path");

const PIXI = require('pixi.js')

const { Player } = require("./core/player.js")
const { SoftPlatform, Block } = require("./core/platform.js")
const { Scene } = require("./core/scene.js")
const { keyboard } = require("./utils/keyboard");
const { layout, makeBoundaries } = require("./utils/scroll.js");


// Using global constants to set the parameters of scene in agility.
const HORIZONTAL_SPEED = 1;
const GRAVITY_ACCELERATION = 0.1;
const JUMP_INITIAL_SPEED = 3;
const WIDTH = 160, HEIGHT = 104;

const BACKGROUND_COLOR = 0x1f3d7a;
const OBJECT_TINT = 0xa3a3c2;
const KEYMAP = { left: 37, up: 38, right: 39, down: 40 };

// Using global variables to accelerate the deveoplment process.
let app = new PIXI.Application({
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
  // Create the sprites from the texture
  const people = Player.fromSprite(new PIXI.Sprite(resources.people.texture));

  people.x = 32;
  people.ay = GRAVITY_ACCELERATION;

  const layout_toml_text = fs.readFileSync(
    path.join(resources_dir, "layout.toml"), "utf-8"
  )

  const environment = layout(layout_toml_text, resources);

  // Create boundaries
  let boundaries = makeBoundaries(WIDTH, HEIGHT);

  // Assign core global collections
  let blocks = environment.hard_platforms
    .concat(environment.bricks)
    .concat(boundaries)
    .map(sprite => Block.fromSprite(sprite));

  let soft_platforms = environment.soft_platforms.map(
    sprite => SoftPlatform.fromSprite(sprite)
  );

  let scene = new Scene({
    physicals: [people],
    platforms: blocks.concat(soft_platforms)
  });

  let sprites = [people.sprite];
  for (const [key, subsprites] of Object.entries(environment)) {
    sprites = sprites.concat(subsprites);
  }

  for (let sprite of sprites) {
    app.stage.addChild(sprite);
  }

  // Bind the player with the keyboard.
  setupKeys(people, KEYMAP);

  people.toFall = true;
  // Enter game loop.
  gameLoop(scene);
}

function gameLoop(scene) {
  requestAnimationFrame(() => gameLoop(scene));
  scene.updateState();
  app.render();
}

function setupKeys(player, keymap) {
  const left = keyboard(keymap.left),
        up = keyboard(keymap.up),
        right = keyboard(keymap.right),
        down = keyboard(keymap.down);

  left.press = () => {
    player.vx = -HORIZONTAL_SPEED;
  }

  left.release = () => {
    if (!right.isDown) {
      player.vx = 0;
    }
  };

  right.press = () => {
    player.vx = HORIZONTAL_SPEED;
  }

  right.release = () => {
    if (!left.isDown) {
      player.vx = 0;
    }
  };
  up.press = () => {
    if (player.isOnTheGround()) {
      player.vy = -JUMP_INITIAL_SPEED;
    }
  }

  down.press = () => {
    if (player.isOnTheSoftGround()) {
      player.toFall = true;
    }
  }
}
