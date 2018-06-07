"use strict";
const fs = require("fs");
const path = require("path");

const PIXI = require('pixi.js')

const { keyboard } = require("./utils/keyboard");
const {
  hitTheTop, onTopOf, hitTheBottom, hitTheLeft, hitTheRight
} = require("./utils/collide.js");
const { equipPhysics } = require("./utils/physics.js");
const { layout, makeBoundaries } = require("./utils/scroll.js");


// Using global constants to set the parameters of scene in agility.
const HORIZONTAL_SPEED = 1;
const GRAVITY_ACCELERATION = 0.1;
const JUMP_INITIAL_SPEED = 3;
const WIDTH = 160, HEIGHT = 104;

const BACKGROUND_COLOR = 0x1f3d7a;
const OBJECT_TINT = 0xa3a3c2;

// Using global variables to accelerate the deveoplment process.
// TODO: Modulize to avoid using global variables.

let app = new PIXI.Application({
  width: WIDTH, height: HEIGHT,
  antialias: false, transparent: false, resolution: 2,
  backgroundColor: BACKGROUND_COLOR
});
window.document.body.appendChild(app.view);

// Core objects in scene.
let people = undefined;
let soft_platforms = undefined;
let platforms = undefined;
let blocks = undefined;

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
  people = new PIXI.Sprite(resources.people.texture);

  // Make people a "physics" one.
  equipPhysics(people);
  people.x = 32;
  people.ay = GRAVITY_ACCELERATION;

  const layout_toml_text = fs.readFileSync(
    path.join(resources_dir, "layout.toml"), "utf-8"
  )

  const objects = layout(layout_toml_text, resources);
  soft_platforms = objects.soft_platforms;
  let hard_platforms = objects.hard_platforms;
  let bricks = objects.bricks;

  // Create boundaries
  let boundaries = makeBoundaries(WIDTH, HEIGHT);

  // Assign core global collections
  blocks = hard_platforms.concat(bricks).concat(boundaries);
  platforms = soft_platforms.concat(blocks);

  // Add the spritse to the stage
  let sprites = [people]
    .concat(soft_platforms)
    .concat(hard_platforms)
    .concat(bricks)

  for (let sprite of sprites) {
    app.stage.addChild(sprite);
  }

  // Bind the hero with the keyboard.
  setupKeys(people);

  // Enter game loop.
  gameLoop();
}

function gameLoop() {
  requestAnimationFrame(gameLoop);
  updateState();
  app.render();
}

function updateState() {
  people.updateV();

  const p = people;

  // Delayed prediction, waiting for the fix by collision check.
  const pt = people.predict();

  // Check collection in each direction.
  // If collision is found in one direction,
  // the prediction will be fixed at once.

  // TODO: Simplify the collection fix by polymorphism.
  if (people.toFall) {
    people.toFall = false;
  } else {
    for (let bottom of platforms) {
      if (hitTheTop(p, pt, bottom)) {
        pt.y = bottom.y - pt.height;
        pt.vy = 0;
      }
    }
  }

  for (let top of blocks) {
    if (hitTheBottom(p, pt, top)) {
      pt.y = top.y + top.height;
      pt.vy = 0;
    }
  }

  for (let right of blocks) {
    if (hitTheLeft(p, pt, right)) {
      pt.x = right.x - pt.width;
    }
  }

  for (let left of blocks) {
    if (hitTheRight(p, pt, left)) {
      pt.x = left.x + left.width;
    }
  }

  p.update(pt);
}

function onTheSoftGround() {
  return soft_platforms.some(platform => onTopOf(people, platform));
}

function onTheGround() {
  return platforms.some(platform => onTopOf(people, platform));
}

function setupKeys(p) {
  const left = keyboard(37),
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40);

  left.press = () => {
    p.vx = -HORIZONTAL_SPEED;
  }

  left.release = () => {
    if (!right.isDown) {
      p.vx = 0;
    }
  };

  right.press = () => {
    p.vx = HORIZONTAL_SPEED;
  }

  right.release = () => {
    if (!left.isDown) {
      p.vx = 0;
    }
  };
  up.press = () => {
    if (onTheGround()) {
      p.vy = -JUMP_INITIAL_SPEED;
    }
  }

  down.press = () => {
    if (onTheSoftGround()) {
      p.toFall = true;
    }
  }
}
