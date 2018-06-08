const PIXI = require('pixi.js')


class StatefulSprite extends PIXI.Container {
  constructor(sprites, initialStatus) {
    super();
    this.sprites = sprites;
    for (const [status, sprite] of Object.entries(sprites)) {
      sprite.visible = false;
      this.addChild(sprite);
    }

    this.status = initialStatus;
  }

  get sprite() {
    return this.sprites[this._status];
  }

  get status() {
    return this._status;
  }

  set status(s) {
    if (this._status) {
      this.sprite.visible = false;
    }
    this._status = s;
    this.sprite.visible = true;
  }
}
exports.StatefulSprite = StatefulSprite;
