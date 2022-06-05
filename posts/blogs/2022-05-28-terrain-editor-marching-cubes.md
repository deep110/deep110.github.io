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

<br>

According to wikipedia, [Marching Cubes](https://wikipedia.org/wiki/Marching_cubes) is an algorithm for creating a polygonal mesh out of discrete 3d scalar field.

First we will see how the algorithm works, then we will create a terrain and finally edit it.

### The Algorithm

Even though I am describing the algorithm here, I would highly recommend if you can go ahead and checkout [Marching Cubes Tutorial](#references) by Sebastian Lague.

One interactive of a cube which can show isosurfaces on clicking a vertex -> video 1:30s

<canvas id="canvas-iso-surface" height=400 width=400></canvas>

One interactive of a cube with set of points with some values and iso surface is drawn. Slider to change the threshold.

### Creating A Procedural Terrain

### Editing the Generated Terrain

### Final Notes

### References { #references }

1. [Implementation by Paul Broke](http://paulbourke.net/geometry/polygonise/)
2. [Marching Cubes Explanation by Sebastian Lague](https://www.youtube.com/watch?v=M3iI2l0ltbE)
3. [Three.js marching cubes demo](https://github.com/mrdoob/three.js/blob/master/examples/webgl_marchingcubes.html)

<style>
  canvas {
    display: block;
    margin: auto;
    cursor: pointer;
  }

  #canvas-iso-surface {
    background: #3a3a3a;
  }

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

  .fullscreen {
    position: fixed;
    width: 100%;
    height: 100%;
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
