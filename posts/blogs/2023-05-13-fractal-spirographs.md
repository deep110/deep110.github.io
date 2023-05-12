---
layout: blog.liquid
title:  "Fractal Spirographs"
categories: ["blog"]
description: "Experimenting with 2D fractal spirographs which are a type of computer-generated art that combines the mathematical principles of fractals and the geometric designs of spirographs."
data:
  keywords: "html5, canvas, marching, fractal, spirograph"
  css: [katex.min.css]
  scripts: [lib/lil-gui.min.js, extras/fractal-spirographs.js]
---

I recently came across [this](https://softologyblog.wordpress.com/2017/02/27/fractal-spirographs/) blog which talks about creating 2d fractals from spirographs, so i decided to give it a shot and try to go a little more indepth on how we can generate various patterns by controlling few variables.

<div id="canvas-container" style="position: relative;">
  <canvas id="canvas-shape" height=700 width=600></canvas>
  <canvas id="canvas-circle" height=700 width=600 style="background: black;"></canvas>
  <div id="gui-main"></div>
</div>
<br>

You can try to change variables such as `RadiusFallOff`, `RotationSpeed`, etc. to get more shapes. Color is added by mapping angle of rotation to HSL space. You can change saturation to give it a grayscale or more colorful look.

Now, lets look at the setup and how we can code it up.

### The Setup

According to [wikipedia](https://wikipedia.org/wiki/Spirograph), Spirograph is a geometric drawing device that produces mathematical roulette curves. But you may know them widely as stencils in shape of gears which we have used in childhood to draw amazing shapes.

<div style="text-align:center">
  <img src="/assets/images/2023-05/spirograph-example-set.webp" alt="Spirograph Example Set" width=350></img>
  <div style="margin-top: 8px;">Spirograph Example Set</div>
</div>
<br>

A digital spirograph is created by rotating multiple circles relative to each other and tracing the path of the center of the last circle. It is essentially a simulation of the classic spirograph, which involved rotating a stencil and tracing a point on it to create intricate and repetitive patterns.

<div style="text-align:center">
  <img src="/assets/images/2023-05/circles-for-spirograph.webp" alt="" width=400></img>
  <div>Interconnected Circles</div>
</div>
<br>

We can specify the size, position, and rotation speed of each circle to create a wide variety of patterns. There are four major parameters that affects generated pattern:

1. <b><u>Number Of Circles</u></b>: As we increase number of circles keeping other factors constant we get more intricate pattern.

<div style="text-align:center">
  <img src="/assets/images/2023-05/variation-num-circles.webp" alt="Variation Number Of Circles" width=700></img>
</div>
<br>

2. <b><u>Rotation Speed</u></b>: Rotation speed is another major parameter that dictates the generated fractal pattern. More the speed of rotation more detail can be rendered during the same revolution. Not only the speed, direction of rotation also changes the pattern. You can refer the comparison below:

<div style="text-align:center">
  <img src="/assets/images/2023-05/variation-rotation-speed.webp" alt="Variation Rotation Speed" width=500></img>
</div>
<br>

Rotation Speed of circles are distributed exponentially. So for an i-th circle speed is calculated as:

{% equation %}
rotate\text{\textunderscore}speed(i) = k ^ i - 1
{% endequation %}
where, k = supplied rotation speed

3. <u><b>Radius Falloff</u></b>: Radius fall off controls the radius of subsequent circles. For example: If radius fall off is 2 each subsequent circle's radius would be halved. So more the value, smaller would be the details; as you can see the in the figure below:

<div style="text-align:center">
  <img src="/assets/images/2023-05/variation-radius-fall-off.webp" alt="Variation Radius FallOff" width=700></img>
</div>
<br>

4. <u><b>Speed Falloff</u></b>:


## Implementation

1. First we will define a circle class with some properties.

```js
class Circle {
    constructor(center, radius, rotateSpeed) {
      this.x = center.x;
      this.y = center.y;
      this.radius = radius;
      this.rotateSpeed = rotateSpeed;
      this.angle = MathUtil.toRadian(90);
    }

    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, MathUtil.PI2);
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();
    }
}
```

2. The hinge of rotation of any circle in the system is the center of previous circle. So we update the center of circle based on the center of previous circle and angle it need to rotate.

```js
class Circle {
  ...

  rotate(parent) {
      this.angle += this.rotateSpeed;

      this.x = parent.x + (parent.radius + this.radius) * Math.cos(this.angle);
      this.y = parent.y + (parent.radius + this.radius) * Math.sin(this.angle);
  }
}
```

3. Now let us put it together to create a Spirograph system.

```js
const START_RADIUS = 140

class System {
    constructor(numCircles, rotateSpeed, radiusFallOff, speedFalloff) {
        this.circles = [];
        this.numCircles = numCircles;

        // calculate the falloff based on rotation speed
        let fallOff = Math.pow(rotateSpeed, speedFalloff);

        // add root circle, which does not rotate
        let root = new Circle(new Vector2(0, 0), START_RADIUS, 0);
        this.circles.push(root);

        for (let i = 1; i < this.numCircles; i++) {
            let prevCircle = this.circles[i - 1];

            let nextRadius = prevCircle.radius / radiusFallOff;
            let nextY = prevCircle.y + prevCircle.radius + nextRadius;
            let nextRotationSpeed = Math.pow(rotateSpeed, i - 1) / fallOff;

            let next = new Circle(new Vector2(0, nextY), nextRadius, nextRotationSpeed);
            this.circles.push(next);
        }
    }

    renderCircle(ctx) {
        ctx.clearRect(0, 0, canvasCircle.width, canvasCircle.height);

        for (let i = 0; i < this.numCircles; i++) {
            this.circles[i].draw(ctx);
        }
    }
}
```

4. Updating the circles

5. Rendering the pattern

### References

1. https://softologyblog.wordpress.com/2017/02/27/fractal-spirographs/
2. http://benice-equation.blogspot.com.au/2012/01/fractal-spirograph.html

<style>
  canvas {
    display: block;
    margin: auto;
  }

  #canvas-shape {
    position: absolute;
    top: 0;
    left: calc(50% - 300px);
  }

  #gui-main {
    position: absolute;
    top: 0;
    right: 0;
  }

  @media only screen and (max-width: 740px) {
    canvas {
        width: calc(100vw - 2em);
    }

    #canvas-shape { left: 0; }

  }
</style>
