# pixi-example

My first game project using [PIXI.js](http://www.pixijs.com/). Currently it's an old-styled and incredibly ugly platformer.

 <img align="right" src="docs/imgs/demo-scene.png">

## Why game?

I again become too ambitious these days to believe in myself as a qualified game developer. This time my confidence comes from the two-year experience as a software engineer since my graduation.

I've tried 3 times to develop a game of my own, correspondingly in 2007, 2010 and 2014. I've been using Flash, GameMaker and Unity. None of these trials succeeded.

The first failure with Flash was mainly because I couldn't code. In 2007 I was too young and it almost killed me to learn Flash and ActionScript. The second one, similarly, also results from my lack of coding skills. Although I found GameMaker is absolutely a better choice for the game development. Still I learned some basic concepts like sprite, collision detection and camera.

Honostly speaking, the third failure with Unity is not my fault, at least not all of my fault. Unity is over-complicated. This may works fine for some artist-background game developers. But it is really annoying to me. My mind is shaped as a programmer and I simply can't settle myself when working with such a complicated, ill-moduled system.

## Why PIXI.js?

Now that I can code and have already become a software engineer, I feel extremely comfortable with things like PIXI.js.

Actually, PIXI.js is not a game engine or game IDE. It is merely a wrapper of WebGL for HTML5 multimedia applications. I choose it because it is super clean and simple. It only renders the sprites and handles the resources. It won't limit my way to implement a game by adding tons of properties for stupid usages.

## Design documentations

[State and Stage](docs/state-and-stage.md)

## Prerequisites

[npm](https://www.npmjs.com/)

[Git LFS](https://git-lfs.github.com/)

## Installation

```
git lfs clone https://github.com/Czxck001/pixi-example
cd pixi-example
npm install
```

Run the game by

```
npm start
```

## Game Help

Use ← and → to move horizontally.

Use ↑ to jump.

Use ↓ to drop off from soft platforms, or sit at blocks.

## Features

- Simple physical engine described by acceleration, velocity and position.
- Bug-free collision detection (using [the Visitor](https://refactoring.guru/design-patterns/visitor) pattern).
- Soft platforms and drop-off.

## TODO list (updating)

- [x] Turn the face around.
- [x] Layout objects in scene by configuration.
- [ ] Background music.
- [x] Separate physics and sprite rendering.
- [ ] Shooting bullets.
- [ ] Advanced confuguration to handling tilemap.
- [ ] Complex player status (airborn detection, etc.)
