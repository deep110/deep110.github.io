---
layout: blog.liquid
title:  "Terrain Generation and Editing using Marching Cubes"
categories: ["blog"]
is_draft: true
data:
  css: [katex.min.css]
  scripts: [lib/three.min.js, lib/orbit-controls.js ,extras/terrain-editor-marching-cubes.js]
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

Hello world
