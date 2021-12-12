---
layout: blog.liquid
title:  "Variable Viscous Fluid Simulation"
categories: ["blog"]
data:
  css: [katex.min.css]
  scripts: [lib/pixi.min.js, extras/simulate-viscous-fluid.js]
---

hello world

<div id="canvas-container">
  <canvas id="canvas" height=500 width=500></canvas>
</div>

<style>
  canvas {
    display: block;
    margin: auto;
  }

  @media only screen and (max-width: 600px) {
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

