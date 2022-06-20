---
layout: blog.liquid
title:  "Terrain Generation and Editing using Marching Cubes"
categories: ["blog"]
data:
  keywords: "html5, canvas, marching, cubes, terrain, procedural, generation, tutorial, threejs"
  css: [katex.min.css]
  scripts: [lib/three.min.js, lib/orbit-controls.min.js, lib/simplex-noise.min.js, lib/lil-gui.min.js ,extras/terrain-editor-marching-cubes.js]
---

<div id="canvas-container" style="position: relative;">
  <canvas id="main-canvas" height=500 width=740></canvas>
  <svg id="toggle-fs"><circle cx="16" cy="16" r="14" style="fill: rgb(255, 255, 255); stroke: rgb(204, 204, 204); stroke-width: 4;"><title>Toggle fullscreen</title></circle><path transform="translate(16,16)rotate(-45)scale(5)translate(-1.85,0)" d="M0,0L0,.5 2,.5 2,1.5 4,0 2,-1.5 2,-.5 0,-.5Z" style="pointer-events: none; fill: rgb(170, 170, 170);"></path>
</svg>
  <div id="gui-canvas-main" class="gui-canvas"></div>
  <div id="index-canvas-main">Click on Terrain to Edit it</div>
</div>

<br>

According to wikipedia, [Marching Cubes](https://wikipedia.org/wiki/Marching_cubes) is an algorithm for creating a polygonal mesh out of a discrete 3d scalar field.

So let's see how the algorithm[^rf_pb] works, then we will create a terrain and finally edit it. All the rendering is done using Three.js[^rf_3js] library.

### The Algorithm

#### Step 1: Fill a 3d space with random values at discrete intervals

In a 3d space where we want to draw our mesh, we will sample the points i.e assign some random value to each point at discrete intervals.

{% equation %}f(x, y, z) = random(-10, 10) {% endequation %}

where, range of values can arbitrary.

<div style="text-align:center">
  <img src="/assets/images/2022-06/sample-points-3d-space.png" alt="Sample Points in 3d Space" width=450 aspect-ratio=1.25></img>
  <div>Sample Points at discrete intervals in 3d Space</div>
</div>
<br>

#### Step 2: Choose a surface level

Now we have to define a surface level i.e any value between min and max of the whole field. A point with value above surface level is considered inside the mesh and below the surface level is considered outside the mesh.

<div style="text-align:center">
  <img src="/assets/images/2022-06/points-surface-level.png" alt="Points above or below surface level" width=450 aspect-ratio=1.25></img>
  <div>Points above or below surface level</div>
</div>
<br>

In the above diagram I have generated values between [-10, 10] and considered surface level as 0. Points above surface level are colored white and points below surface level are colored black.

> Note: Above and below surface level is subjective and does not affect the algorithm in any way. We just want to draw the boundary of the mesh. Mesh will be just inverted.

#### Step 3: Draw Mesh Triangles

Now for each point we consider next nearest seven points,
{% equation %}[x + ⟨0,1⟩,\,y + ⟨0,1⟩,\,z + ⟨0,1⟩]{% endequation %}

thus forming a cube. Based on which points are included in mesh i.e below surface level we draw a mesh. For example: Lets take a look at the below image.

<div style="text-align:center">
  <img src="/assets/images/2022-06/mesh-isosurface-facet.png" alt="Iso-surface facet" width=400 aspect-ratio=1.334></img>
  <div>Iso-surface facet</div>
</div>
<br>

The vertex number 3 is above surface level so we will draw a mesh facet that will cut edge 2-3-11. Now if we manually code all the 2<sup>8</sup> combinations it would be little difficult. Thus we use [edge tables](https://github.com/deep110/terrain-editor-js/blob/master/marching-cubes.js#L260) and [triangulation tables](https://github.com/deep110/terrain-editor-js/blob/master/marching-cubes.js#L1) to make this process easier.

1. Calculate the `cubeIndex` which will give a 12bit number in edge table where each bit corresponds to an edge. 
```js
function getCubeIndex() {
  let cubeIndex = 0;
  if (grid.val[0] > isoLevel) cubeIndex |= 1;
  if (grid.val[1] > isoLevel) cubeIndex |= 2;
  if (grid.val[2] > isoLevel) cubeIndex |= 4;
  if (grid.val[3] > isoLevel) cubeIndex |= 8;
  if (grid.val[4] > isoLevel) cubeIndex |= 16;
  if (grid.val[5] > isoLevel) cubeIndex |= 32;
  if (grid.val[6] > isoLevel) cubeIndex |= 64;
  if (grid.val[7] > isoLevel) cubeIndex |= 128;

  return cubeIndex;
}

let edgeIndex = edgeTable[cubeIndex];
```

In the above example when just vertex 3 is above surface level, we get cubeIndex is 8. Correspondingly the edgeTable[8] gives:
```js
{3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1}
```

2. Now we know which edges to connect, but we also need to get a point on each edge and connect them to make a triangular mesh. Either we can take the mid point of the edge or take a weighted distance between the two vertices of the edge.

{% equation %}
P = P1 + (IsoValue - V1) (P2 - P1) / (V2 - V1)
{% endequation %}

where,

V1 = Value of vertex 1<br>
V2 = Value of Vertex 2<br>
P1 = position of Vertex 1<br>
P2 = position of Vertex 2

You can play with the interactive demo below and check out how the mesh is drawn in each combination. You can click a corner of cube to make the point active or inactive.

<div style="position: relative;">
  <canvas id="canvas-iso-surface" height=300 width=600></canvas>
  <div id="gui-canvas-iso-surface" class="gui-canvas"></div>
  <div id="index-canvas-iso-surface">
    <div style="color: white;">Vertex Index</div>
    <div style="color: green;">Edge Index</div>
  </div>
</div>
<br>

Btw if you really check there are just 15 unique combinations[^rf_wiki] possible.

#### Step 4: Iterate over whole field and draw

Now we just need to iterate over the whole field and apply the step 3. You can play with the interactive demo below. Try changing the surface level and field type.

<div style="position: relative;">
  <canvas id="canvas-algo" height=360 width=600></canvas>
  <div id="gui-canvas-algo" class="gui-canvas"></div>
</div>
<br>

For spherical field, I have just assigned the field values using the sphere distance function.

```js
getFieldValue(x, y, z, type) {
  if (type === "Random") {
    return MathUtil.randomInt(-this.range, this.range);
  } else {
    // type === "Sphere"
    return this.radius * this.radius - (x * x + y * y + z * z);
  }
}
```

### Creating A Procedural Terrain

As you have realized, you can generate any shape as long as you have the field function figured out. So for terrain we will use a noise function - [Simplex Noise](https://wikipedia.org/wiki/Simplex_noise). It is just like [Perlin Noise](https://wikipedia.org/wiki/Perlin_noise#) but with fewer directional artifacts and lower computation overhead. You can read wikipedia in more detail on how to generate it.

It is often used in procedural generation because the randomness vary very smoothly but still gives a natural looking feel.

```js
// constants which affect the shape of generated terrain
const numOctaves = 4;
const lacunarity = 2;
const persistence = 0.5;
const noiseWeight = 7;
const weightMultiplier = 3.6;

getFieldValue(x, y, z) {
    let noise = 0;

    let frequency = 0.02;
    let amplitude = 1;
    let weight = 1;
    for (var j = 0; j < numOctaves; j++) {
        let n = this.simplex.noise3D(
            x * frequency, y * frequency, z * frequency,
        );
        let v = 1 - Math.abs(n);
        v = v * v * weight;
        weight = Math.max(Math.min(v * weightMultiplier, 1), 0);
        noise += v * amplitude;
        amplitude *= persistence;
        frequency *= lacunarity;
    }

    let finalVal = -y + noise * noiseWeight;

    return -finalVal;
}
```

Lets see how these values affect the generated terrain.

1. **NumOctaves**: Each octave run adds layer of details to the surface. So more the number of octaves more detailed terrain you have.

<div style="text-align:center">
  <img src="/assets/images/2022-06/comparison-octaves.png" alt="Num Octaves Comparison" width=600></img>
  <div>Number of Octaves Comparison</div>
  <br>
</div>

2. **Lacunarity**: It determines how much detail is added or removed at each octave. Lacunarity of more than 1 means each octave will increase its level of detail, 1 means it will stay same & less than 1 means it will decrease. We don't want last two, so a number greater than 1 works quite well.

<div style="text-align:center">
  <img src="/assets/images/2022-06/comparison-lacunarity.png" alt="Lacunarity Comparison" width=650></img>
  <div>Lacunarity Comparison</div>
</div>
<br>

3. **Persistence**: It determines how much each octave contributes to the overall shape. A Persistence of 1 means each octave contribute equally, more than 1 means successive octave contribute more and less than 1 means successive octaves contribute less. We usually want to keep it less than 1 else output will be just noise.

<div style="text-align:center">
  <img src="/assets/images/2022-06/comparison-persistence.png" alt="Persistence Comparison" width=600></img>
  <div>Persistence Comparison</div>
</div>
<br>

Other factors just helps in increasing or decreasing the noise amplitude. You can play around in the above terrain interactive with these values.

### Editing the Generated Terrain

Once you have a terrain setup, to edit we just have to manipulate the field values. Consider we have a brush size of radius r, we just need to manipulate the spherical field around the position on terrain which we want to edit. It is same as creating a spherical mesh, we can just put distance from center as field value.

```js
/**
 * @brushSize float: Radius of brush
 * @point Vector3: Position on terrain
 * @multiplier int: +1 for raising the terrain and -1 for depress
 */
makeShape(brushSize, point, multiplier) {
  for (let x = -brushSize; x <= brushSize; x++) {
      for (let y = -brushSize; y <= brushSize; y++) {
          for (let z = -brushSize; z <= brushSize; z++) {
              let distance = this.sphereDistance(point.clone(), new THREE.Vector3(point.x + x, point.y + y, point.z + z), brushSize);
              if (distance < 0) {
                  let xi = Math.round(point.x + x);
                  let yi = Math.round(point.y + y);
                  let zi = Math.round(point.z + z);

                  this.field.set(xi, yi, zi, this.field.get(xi, yi, zi) + distance * multiplier);
              }
          }
      }
  }
}

sphereDistance = (spherePos, point, radius) => {
  return spherePos.distanceTo(point) - radius;
}
```

### Final Notes

You can find the full source code on my [github](https://github.com/deep110/terrain-editor-js). If you enjoyed the article, please leave a comment below.

### References { #references }

[^rf_pb]: [Implementation by Paul Broke](http://paulbourke.net/geometry/polygonise/)

[^rf_3js]: [Three.js marching cubes demo](https://github.com/mrdoob/three.js/blob/master/examples/webgl_marchingcubes.html)

[^rf_wiki]: [Wikipedia - Marching Cubes](https://wikipedia.org/wiki/Marching_cubes)

[^rf_sl]: [Marching Cubes by Sebastian Lague](https://www.youtube.com/watch?v=M3iI2l0ltbE)

<style>
  canvas {
    display: block;
    margin: auto;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
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
    right: -16px;
    cursor: pointer;
    z-index: 2;
  }

  .gui-canvas {
    position: absolute;
    top: 0;
    right: 70px;
  }

  #index-canvas-iso-surface {
    position: absolute;
    right: 70px;
    bottom: 0;
    padding: 10px;
    font-size: 13px;
  }

  .lil-gui { 
    --width: 200px;
    --name-width: 65%;
  }

  #gui-canvas-main {
    right: 0;
  }

  #index-canvas-main {
    position: absolute;
    top: 5px;
    left: 10px;
    color: white;
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

  #gui-canvas-main.fullscreen {
    position: fixed;
    z-index: 10;
    right: 50px;
  }

  #index-canvas-main.fullscreen {
    position: fixed;
    z-index: 10;
  }

  @media only screen and (max-width: 740px) {
    canvas {
        width: calc(100vw - 2em);
    }

    .gui-canvas,
    #index-canvas-iso-surface {
      right: 0;
    }
  }
</style>
