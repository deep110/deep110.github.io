---
layout: blog.liquid
title:  "Terrain Generation and Editing using Marching Cubes"
categories: ["blog"]
is_draft: true
data:
  css: [katex.min.css]
  scripts: [lib/three.min.js, lib/orbit-controls.min.js, lib/simplex-noise.min.js, extras/terrain-editor-marching-cubes.js]
---

<div id="canvas-container">
  <canvas id="canvas" height=500 width=740></canvas>
  <div id="toggle-fs"/>
</div>

<style>
  #canvas-container {
    position: relative;
  }

  #toggle-fs {
    position: absolute;
    background: blue;
    width: 35px;
    height: 35px;
    top: -12px;
    right: -12px;
  }

  canvas {
    display: block;
    margin: auto;
    cursor: pointer;
  }

  .fullscreen {
    position: fixed; /* Sit on top of the page content */
    width: 100%; /* Full width (cover the whole page) */
    height: 100%; /* Full height (cover the whole page) */
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
  }

  #toggle-fs.tfs {
    position: fixed;
    top: 8px;
    right: 8px;
    background: green;
    z-index: 100;
  }

  @media only screen and (max-width: 740px) {
    canvas {
        width: calc(100vw - 2em);
    }

    #canvas-container {
        width: calc(100vw - 2em);
    }
  }
</style>

<br>

This is just a sample text which i wanted to type to get started on something great.

I also wanted to just trim this so that references is not seen and page doesnt overflow
I have an OCD regaarding this so please dont judge me.


<h3 id="references">References</h3>

1. http://paulbourke.net/geometry/polygonise/
2. https://github.com/mrdoob/three.js/blob/master/examples/webgl_marchingcubes.html
3. https://www.youtube.com/watch?v=M3iI2l0ltbE
