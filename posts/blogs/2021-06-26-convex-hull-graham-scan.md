---
layout: blog.liquid
title:  "Generating Convex Hull using Graham Scan"
categories: ["blog"]
data:
  scripts: [extras/simulate-graham-scan.js]
---

hello

<canvas id="canvas" height=500 width=500></canvas>
<style>
  canvas {
    background: #3a3a3a;
    display: block;
    margin: auto;
  }

  @media only screen and (max-width: 600px) {
    #canvas {
        width: calc(100vw - 2em);
    }
  }
</style>
