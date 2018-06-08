const { PhysicalObject, takeSprite } = require("./physics.js");
const { keyboard } = require("../utils/keyboard");


class Player extends PhysicalObject {
  constructor() {
    super();
    this._status = {
      x: 'right',
      y: 'stand'
    };
  }

  static fromSprite(sprite) {
    const p = new Player();
    takeSprite(p, sprite);
    return p;
  }

  updateSpriteStatus() {
    this.sprite.status = this._status.x.concat('_', this._status.y);
    this.updateWHFromSprite();
  }

  get x_status() {
    return this._status.x;
  }

  set x_status(s) {
    this._status.x = s;
    this.updateSpriteStatus();
  }

  get y_status() {
    return this._status.y;
  }

  set y_status(s) {
    this._status.y = s;
    this.updateSpriteStatus();
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

    for (const platform of this.scene.platforms) {
      // Double dispatch here (the Visitor Pattern)
      platform.acceptCollision(this, pt);
    }

    this.update(pt);
  }
}
exports.Player = Player;

function setupKeys(player, keymap, speeds) {
  const left = keyboard(keymap.left),
        up = keyboard(keymap.up),
        right = keyboard(keymap.right),
        down = keyboard(keymap.down);

  left.press = () => {
    player.vx = -speeds.horizontal;
    player.x_status = 'left';
  }

  left.release = () => {
    if (!right.isDown) {
      player.vx = 0;
    }
  };

  right.press = () => {
    player.vx = speeds.horizontal;
    player.x_status = 'right';
  }

  right.release = () => {
    if (!left.isDown) {
      player.vx = 0;
    }
  };
  up.press = () => {
    if (player.isOnTheGround()) {
      player.vy = -speeds.jump;
    }
  }

  down.press = () => {
    if (player.isOnTheSoftGround()) {
      player.toFall = true;
    }
    else if (player.isOnTheGround()) {
      player.y_status = 'sit';
      player.y += 8;
    }
  }
  down.release = () => {
    if (player.y_status == 'sit') {
      player.y_status = 'stand';
      player.y -= 8;
    }
  }
}
exports.setupKeys = setupKeys;
