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

<div id="canvas-container" style="position: relative;">
  <canvas id="canvas-circle" height=600 width=600 style="background: black;"></canvas>
  <canvas id="canvas-shape" height=600 width=600></canvas>
</div>

Hello world

- what is spirograph
- code
- 

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

  @media only screen and (max-width: 740px) {
    canvas {
        width: calc(100vw - 2em);
    }

    #canvas-shape { left: 0; }
  }
</style>