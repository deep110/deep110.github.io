---
layout: blog.liquid
title:  "Fractal Spirographs"
categories: ["blog"]
is_draft: true
data:
  keywords: "html5, canvas, marching, fractal, spirograph"
  css: [katex.min.css]
  scripts: [lib/lil-gui.min.js, extras/fractal-spirographs.js]
---

According to [wikipedia](https://wikipedia.org/wiki/Spirograph), Spirograph is a geometric drawing device that produces mathematical roulette curves. But you may know them widely as stencils in shape of gears which we have used in childhood to draw amazing shapes.

<div style="text-align:center">
  <img src="/assets/images/2022-11/spirograph-example-set.jpg" alt="Spirograph Example Set" width=350></img>
  <div style="margin-top: 8px;">Spirograph Example Set</div>
</div>
<br>

I recently came across creating [this](https://softologyblog.wordpress.com/2017/02/27/fractal-spirographs/) blog which talks about creating 2d fractals from spirographs, so i decided to give it a shot and try to go a little more indepth on how we can generate various shapes by just manipulating some variables.

<div id="canvas-container" style="position: relative;">
  <canvas id="canvas-shape" height=600 width=600></canvas>
  <canvas id="canvas-circle" height=600 width=600 style="background: black;"></canvas>
  <div id="gui-main"></div>
</div>
<br>

You can try to change variables such as `RadiusFallOff`, `RotationSpeed`, etc. to get more shapes. Color is added by mapping angle of rotation to HSL space. You can change saturation to give it a grayscale or more colorful look.

Now, lets see what is the setup and how we can code it up.

### The Setup

We have multiple circles revolving 



1. First 
Define a circle class

2. 

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