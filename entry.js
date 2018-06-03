const { keyboard } = require("./utils/keyboard");
const {
  hitTheTop, onTopOf, hitTheBottom, hitTheLeft, hitTheRight
} = require("./utils/collide.js");
const { equipPhysics } = require("./utils/physics.js");
const { makeBoundaries } = require("./utils/scroll.js");

const HORIZONTAL_SPEED = 1;
const GRAVITY_ACCELERATION = 0.1;
const JUMP_INITIAL_SPEED = 3;

//Create a container object called the `stage`
let stage = new PIXI.Container();

let WIDTH = 160, HEIGHT = 104;

const BACKGROUND_COLOR = 0x1f3d7a;
const OBJECT_TINT = 0xa3a3c2;

//Create the renderer
let renderer = PIXI.autoDetectRenderer(
  WIDTH, HEIGHT,
  {antialias: false, transparent: false, resolution: 2,
   backgroundColor: BACKGROUND_COLOR}
);

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

people_png = "images/small_strange_people.png";
soft_platform_png = "images/soft_platform.png";
hard_platform_png = "images/hard_platform.png";
brick_png = "images/brick.png";

//Use Pixi's built-in `loader` object to load an image
PIXI.loader
  .add(people_png)  // 8 * 16
  .add(soft_platform_png)  // 32 * 4
  .add(hard_platform_png)  // 32 * 8
  .add(brick_png)  // 32 * 32
  .load(setup);

//This `setup` function will run when the image has loaded
function setup() {
  //Create the sprites from the texture
  people = new PIXI.Sprite(
    PIXI.loader.resources[people_png].texture
  );

  people.x = 32;

  equipPhysics(people);
  people.ay = GRAVITY_ACCELERATION;

  soft_platforms = Array(3).fill().map(
    () => new PIXI.Sprite(PIXI.loader.resources[soft_platform_png].texture)
  );
  let hard_platforms = Array(3).fill().map(
    () => new PIXI.Sprite(PIXI.loader.resources[hard_platform_png].texture)
  );
  let bricks = Array(2).fill().map(
    () => new PIXI.Sprite(PIXI.loader.resources[brick_png].texture)
  );

  let setTint = (sprite) => {sprite.tint = OBJECT_TINT};

  soft_platforms.forEach(setTint);
  hard_platforms.forEach(setTint);
  bricks.forEach(setTint);

  soft_platforms[0].x = 32;
  soft_platforms[0].y = 40;
  soft_platforms[1].x = 32;
  soft_platforms[1].y = 72;
  soft_platforms[2].x = 96;
  soft_platforms[2].y = 40;

  hard_platforms[0].x = 32;
  hard_platforms[0].y = 96;
  hard_platforms[1].x = 96;
  hard_platforms[1].y = 96;
  hard_platforms[2].x = 96;
  hard_platforms[2].y = 72;

  bricks[0].x = 0;
  bricks[0].y = 96 - (32 - 8);
  bricks[1].x = 128;
  bricks[1].y = 96 - (32 - 8);

  let boundaries = makeBoundaries(WIDTH, HEIGHT);

  blocks = hard_platforms.concat(bricks).concat(boundaries);
  platforms = soft_platforms.concat(blocks);

  //Add the sprite to the stage
  let sprites = [people]
    .concat(soft_platforms)
    .concat(hard_platforms)
    .concat(bricks)

  for (let sprite of sprites) {
    stage.addChild(sprite);
  }

  setupKeys(people);
  gameLoop();
}

function gameLoop() {
  requestAnimationFrame(gameLoop);
  updateState();
  renderer.render(stage);
}

function updateState() {
  people.updateV();

  const p = people;
  const pt = people.predict();

  let bottom;
  if (people.toFall) {
    people.toFall = false;
  } else {
    for (let platform of platforms) {
      if (hitTheTop(p, pt, platform)) {
        bottom = platform;
        break;
      }
    }
    if (bottom) {
      pt.y = bottom.y - pt.height;
      pt.vy = 0;
    }
  }

  let top;
  for (let block of blocks) {
    if (hitTheBottom(p, pt, block)) {
      top = block;
      break;
    }
  }
  if (top) {
    pt.y = top.y + top.height;
    pt.vy = 0;
  }

  let right;
  for (let block of blocks) {
    if (hitTheLeft(p, pt, block)) {
      right = block;
      break;
    }
  }
  if (right) {
    pt.x = right.x - pt.width;
  }

  let left;
  for (let block of blocks) {
    if (hitTheRight(p, pt, block)) {
      left = block;
      break;
    }
  }
  if (left) {
    pt.x = left.x + left.width;
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
  let left = keyboard(37),
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
