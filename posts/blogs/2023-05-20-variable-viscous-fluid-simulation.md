---
layout: blog.liquid
title:  "Variable Viscous Fluid Simulation"
categories: ["blog"]
is_draft: true
data:
  css: [katex.min.css]
  scripts: [lib/pixi.min.js, extras/simulate-viscous-fluid.js]
---

hello world

<div id="canvas-container">
  <canvas id="canvas" height=500 width=500></canvas>
</div>

<button onclick="pause()">ClickMe</button>

<div id="visualize"></div>

<style>
  canvas {
    display: block;
    margin: auto;
  }

  table td {
    padding: 0px;
    font-size: 10px;
  }

  @media only screen and (max-width: 740px) {
    canvas {
        width: calc(100vw - 2em);
    }
  }
</style>


### Previous methods

PIC
FLIP

Implemented:
FLIP + viscosity


### Intro

Euler equations & viscosity - pg 13
Boundary conditions


### Simulation

1. Advect particles
- For each particle, get the current velocity
- Use Rungee-Kutta 2nd order integration to get new position

