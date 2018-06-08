const { PhysicalObject, takeSprite } = require("./physics.js");
const { keyboard } = require("../utils/keyboard");


class Player extends PhysicalObject {
  static fromSprite(sprite) {
    let p = new Player();
    takeSprite(p, sprite);
    return p;
  }

  isOnTheGround() {
    return this.scene.platforms.some(p => p.acceptIsOnTheGround(this));
  }

  isOnTheSoftGround() {
    return this.scene.platforms.some(p => p.acceptIsOnTheSoftGround(this));
  }

  updatePhysicalState() {
    // Delayed prediction, waiting for the fix by collision check.
    const pt = this.predict();

    for (let platform of this.scene.platforms) {
      // Double dispatch here (the Visitor Pattern)
      platform.acceptCollision(this, pt);
    }

    this.update(pt);
  }
}
exports.Player = Player;

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
exports.setupKeys = setupKeys;
