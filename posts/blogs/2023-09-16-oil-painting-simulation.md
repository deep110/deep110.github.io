---
layout: blog.liquid
title:  "Oil Painting Simulation"
categories: ["blog"]
is_draft: true
data:
  keywords: "html5, canvas, oil, painting, digital"
  scripts: [lib/lil-gui.min.js, lib/twgl.min.js, extras/oil-painting-simulation.js]
---

Hello world

<div id="canvas-container" style="position: relative;">
  <canvas id="main-canvas" height=500 width=740></canvas>
  <svg id="toggle-fs"><circle cx="16" cy="16" r="14" style="fill: rgb(255, 255, 255); stroke: rgb(204, 204, 204); stroke-width: 4;"><title>Toggle fullscreen</title></circle><path transform="translate(16,16)rotate(-45)scale(5)translate(-1.85,0)" d="M0,0L0,.5 2,.5 2,1.5 4,0 2,-1.5 2,-.5 0,-.5Z" style="pointer-events: none; fill: rgb(170, 170, 170);"></path></svg>
  <div id="paint-settings"></div>
</div>


<style>
  canvas {
    display: block;
    margin: auto;
    cursor: pointer;
    background: #f4f4f4;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
  }

  #toggle-fs {
    position: absolute;
    width: 32px;
    height: 32px;
    top: -16px;
    right: -14px;
    cursor: pointer;
    z-index: 2;
  }

  #paint-settings {
    position: absolute;
    top: 0;
    right: 70px;
    right: 0;
  }

  canvas.fullscreen {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
  }

  #toggle-fs.fullscreen {
    position: fixed;
    top: 8px;
    right: 8px;
    z-index: 10;
  }

  #paint-settings.fullscreen {
    position: fixed;
    z-index: 10;
    right: 50px;
  }

  @media only screen and (max-width: 740px) {
    canvas {
        width: calc(100vw - 2em);
    }

    #paint-settings {
      right: 0;
    }
  }
</style>
