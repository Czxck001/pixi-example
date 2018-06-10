# State and Stage

I've did some thinking on the state shifts. I found the key is to figure out how many states should the player have, and at which stage of game these states should change.

 ## States

States are properties of the player which may influence the player's appearance and behavior.

In current platformer game, there is only one player in a room. Let's start with the simplest case. If the player can only walk around, jump and fall, then there should be 2 dimensions of states.

| Status                   | Value1        | Value2  |
| ------------------------ | ------------- | ------- |
| Horizontal Orientational | Left          | Right   |
| Vertical                 | On the ground | Airborn |

If the user are allowed to sit on solid grounds, then there would be another dimension.

| Statis                   | Value1        | Value2  |
| ------------------------ | ------------- | ------- |
| Horizontal Orientational | Left          | Right   |
| Vertical                 | On the ground | Airborn |
| Stationary               | Stand         | Sit     |

The state of the player is determined by the combination of values in all dimensions. For example, the player is running left and just drop off a platform, then the current state should be `(Left, Airborn, Stand)`.

As mentioned above, a major role of the status is to determine the player's appearance. Upon turing left, the player's appearance should be horizontal mirrered from the right-faced.

Currently, this appearance change is implemented by changing the sprite that represents the player. First, we load all the possible appearances of the player and made different sprites from these textures. Although we have all these sprites, only the sprite corresponding to the player's current state will be visible. Upon the state changes, the old sprite will be hidden and the new sprite will be set to appear.

## Stages

When should these states change? To have a clear mind we should first think about the **event loop** of JavaScript.

Although JavaScript is good at handling asychronized events, there is only one (logical) thread at any time. That is to say, at one moment there should be only one line of your code is being executed. 

In other programming languages this mechanism is called "coroutine" or "event loop". The asychronization is implemented not by thread concurrent, but by manually yield the control of main thread. In Javascript, this is typically done by passing in a callback function to a function which only register the callback to the event loop who tells you "your order will be processed soon".

For example, the major callback (also called "global update") in PIXI.js framework is a function passed to `app.tick`, where `app` is a `PIXI.Application`. This callback will be executed each time before a frame is rendered. This is exactly the "main entry" of your logical code.

```javascript
let app = new PIXI.Application(800, 600, {backgroundColor : 0x000000});
document.body.appendChild(app.view);

// create a new Sprite from 10x10 white block
let white = PIXI.Sprite(PIXI.Texture.WHITE)

app.stage.addChild(white);

// Listen for animate update
app.ticker.add(function(delta) {
    // just for fun, let's rotate the white a little
    // delta is 1 if running at 100% performance
    // creates frame-independent transformation
    white.rotation += 0.1 * delta;
});
```

Another stage is triggered when the user "send a interrupt" to event loop by striking a key or moving the mouse. As mentioned before, this interrupt handler won't compete with the global update. It will be executed once the global update is idle and no other high-prioritized task exists.

Here is an illustration of the timeline.

![](imgs/stages.png)

This illustration is not exactly true because the order of each stages may differ, in goal of frame-independence transformation. But it clearly showed that the user code of PIXI.js is mostly concerning the main callback (global update) and input interruption handler. 

Let's call the main callback as **the stage of M**, and the input handing **the stage of H**. We will see that between every two frames, the player's state will change twice in these two stages.

### Stage H

- Directly change physical property (e.g. velocity) on key press.
- Change "temporary" states, which will be used in the stage of M.

### Stage M

- Update properties from "temporary" states in stage H.
- Physical prediction (update velocity from acceleration, predict location from velocity)
- Collision fix.
- Evaluate some states (on ground or airborn).