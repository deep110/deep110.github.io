---
layout: blog.liquid
title:  "Simulating Warp Speed in HTML5"
description: "This whole blog is an ellaborate attempt to understand how perspective camera projection from 3d space to 2d screen works. Nice looking warp effect is a bonus."
categories: ["blog"]
data:
  scripts: [extras/simulate-warp-speed.js]
  keywords: "html5, canvas, warp, starwars"
---

While rewatching the star wars series, I really liked the warp speed effect, and thought maybe I should try recreating it for fun. So lo and behold I got it working in mostly an hour or so without using any library, just plain old html5 canvas.

You can click on the start button to start the simulation. Use the slider to change the speed.

<div id="canvas-container">
    <canvas id="myCanvas"></canvas>
    <div id="overlay">
        <img src="/assets/images/2021-02/icon-play.png" id="icon-play" alt="icon play"></img>
    </div>
</div>

<div class="slider-container">
    <label for="myRange">Warp Speed</label>
    <input type="range" min="10" max="100" value="60" class="slider" id="myRange">
</div>

<style>
    #canvas-container {
        margin: 30px auto;
        width: 600px;
        height: 500px;
        position: relative;
    }

    #overlay {
        background-color: #3a3a3a;
        width: 100%;
        height: 100%;
        z-index: 10;
        position: absolute;
        top: 0;
    }

    #overlay:hover {
        background-color: rgb(193 193 193 / 40%);
    }

    #icon-play {
        width: 96px;
        height: 96px;
        transition: all .2s ease-in-out;
        position: absolute;
        top: calc(50% - 48px);
        left: calc(50% - 48px);
    }

    #icon-play:hover {
        transform: scale(1.2);
    }

    canvas {
        background: #000;
        display: block;
        height: 100%; 
        width: 100%;
    }

    .slider-container {
        display: flex;
        margin: 0 9%;
    }

    @media only screen and (max-width: 740px) {
        #canvas-container {
            width: calc(100vw - 2em);
            height: calc(calc(100vw - 2em) * 0.8334);
        }
    }
</style>

<br>

Now, let us see how we can create it.

1. First define some constants. We will consider a `2000 * 2000 * 2000` cube in 3d space. You can choose any number, it doesn't matter.

```js
const MAX_DISTANCE = 1000
const NUM_STARS = 300
const STAR_SPEED = 50
```

2. Create a class `Star` to store its position at any given point of time.

I am considering that a star will travel from `(x, y, 1000)` to `(x, y, 0)`. So it does not move in x and y direction, just the z direction. Also I have initialized z coordinate as a random number to create some randomness in animation.

```js
function random(min, max) {
    return Math.random() * (max - min) + min
}

class Star {
    constructor() {
        this.x = random(-MAX_DISTANCE, MAX_DISTANCE);
        this.y = random(-MAX_DISTANCE, MAX_DISTANCE);
        this.z = random(100, MAX_DISTANCE);
    }
}
```

3. Now create the `update` method. It just decreases the star's z position by the given speed. Also you can reuse the star objects once they go out of bounds, just reinitialize its position.

```js
class Star {
    ...

    update() {
        this.z = this.z-STAR_SPEED

        // reinitialize the position
        if (this.z < 1) {
            this.x = random(-MAX_DISTANCE, MAX_DISTANCE);
            this.y = random(-MAX_DISTANCE, MAX_DISTANCE);
            this.z = random(100, MAX_DISTANCE);
        }
    }
}
```
4. Before going on to create `draw` function for the star, let us initialize the canvas.

Add a canvas in html
```html
<canvas id="myCanvas" width="500" height="500"></canvas>
```

In your `script.js`,
```js
let canvas;
let context;
let stars = [];

window.onload = init;

function init() {
    canvas = document.getElementById("myCanvas");
    context = canvas.getContext("2d");

    for (let i=0; i < NUM_STARS; i++) {
        stars[i] = new Star();
    }

    draw();
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i=0; i < stars.length; i++) {
        stars[i].update();
        stars[i].draw(context); // next we will create this function
    }

    // call the draw function again
    window.requestAnimationFrame(draw);
}
```

5. Now let us create the `draw` function.

```js
function map(value, low1, high1, low2, high2) {
    return low2 + (value - low1) * (high2 - low2) / (high1 - low1)
}

class Star {
    ...

    draw(ctx) {
        ctx.beginPath();

        let sx = map(this.x/this.z, -1, 1, 0, canvas.width);
        let sy = map(this.y/this.z, -1, 1, 0, canvas.height);
        let radius = map(this.z, 0, 1000, random(2, 5), 1);

        ctx.fillStyle = "#FFF";
        ctx.arc(sx, sy, radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}
```

What I have done here is basically projected our 3d coordinates to the canvas along `z=0` plane. Actually this is the basis of [perspective projection](https://en.wikipedia.org/wiki/3D_projection#Weak_perspective_projection) and it gives us good approximation of the result we want to obtain.

I have also applied some randomness to star's initial radius to give it a twinkling effect and mapped star's z position to radius, to give the feeling of it appearing big when closer.

6. Now to make the streak behind the star is actually easy. Just save the previous z position of the star and draw the line between previous projected position and the current projected position.

```js
draw(ctx) {
    ...

    // draw streak
    ctx.beginPath();
    let spx = map(this.x/this.previous_z, -1, 1, 0, canvas.width);
    let spy = map(this.y/this.previous_z, -1, 1, 0, canvas.height);

    ctx.moveTo(spx, spy);
    ctx.lineTo(sx, sy);
    ctx.strokeStyle = "#0000FF";
    ctx.stroke();

    // set the current z as previous z for next frame
    this.previous_z = this.z;   
}
```

Just remember to reset `previous_z` along with `this.z` when star goes out of bounds.

Ok that's all. This is how you can make a cool warp speed effect.
