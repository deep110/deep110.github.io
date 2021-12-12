class Array2f {
  constructor(ni, nj) {
    this.ni = ni;
    this.nj = nj;
    this.data = new Float32Array(ni * nj);
  }

  fill(val) {
    this.data.fill(val);
  }

  get(i, j) {
    return this.data[i + this.ni * j];
  }

  set(i, j, val) {
    this.data[i + this.ni * j] = val;
  }

  add(val) {
    for (let k = 0; k < this.data.length; k++) {
      this.data[k] += val;
    }
  }

  toString() {
    this.data.toString();
  }

  interpolateValue(point) {
    var [i, fx] = Utils.get_barycentric(point.x, 0, this.ni);
    var [j, fy] = Utils.get_barycentric(point.y, 0, this.nj);

    return Utils.bilerp(
      this.get(i, j), this.get(i + 1, j),
      this.get(i, j + 1), this.get(i + 1, j + 1), fx, fy
    );
  }

  interpolateGradient(point) {
    var [i, fx] = Utils.get_barycentric(point.x, 0, this.ni);
    var [j, fy] = Utils.get_barycentric(point.y, 0, this.nj);

    let v00 = this.get(i, j);
    let v01 = this.get(i, j + 1);
    let v10 = this.get(i + 1, j);
    let v11 = this.get(i + 1, j + 1);

    let ddy0 = (v01 - v00);
    let ddy1 = (v11 - v10);

    let ddx0 = (v10 - v00);
    let ddx1 = (v11 - v01);

    return new Vector2(
      Utils.lerp(ddx0, ddx1, fy),
      Utils.lerp(ddy0, ddy1, fx)
    )
  }
}

class Utils {
  static lerp(value0, value1, f) {
    return (1 - f) * value0 + f * value1;
  }

  static bilerp(v00, v10, v01, v11, fx, fy) {
    return Utils.lerp(Utils.lerp(v00, v10, fx), Utils.lerp(v01, v11, fx), fy);
  }

  static get_barycentric(val, i_low, i_high) {
    var s = Math.floor(val);
    var i = s;
    var f = 0;
    if (i < i_low) {
      i = i_low;
      f = 0;
    } else if (i > i_high - 2) {
      i = i_high - 2;
      f = 1;
    } else
      f = (val - s);

    return [i, f];
  }
}

class FluidSim {
  constructor(gridRes) {
    this.ni = gridRes; // number rows
    this.nj = gridRes; // number columns
    this.dx = 1.0 / gridRes;
    this.inv_dx = gridRes;

    // fluid velocity
    this.u = new Array2f(this.ni + 1, this.nj);
    this.v = new Array2f(this.ni, this.nj + 1);
    this.tempU = new Array2f(this.ni + 1, this.nj);
    this.tempV = new Array2f(this.ni, this.nj + 1);

    // pressure
    this.uWeights = new Array2f(this.ni + 1, this.nj);
    this.vWeights = new Array2f(this.ni, this.nj + 1);
    this.uValid = new Array2f(this.ni + 1, this.nj);
    this.vValid = new Array2f(this.ni, this.nj + 1);
    this.liquidPhi = new Array2f(this.ni, this.nj); // density

    // geometry
    this.signedBoundary = new Array2f(this.ni + 1, this.nj + 1);

    // viscosity
    this.uVol = new Array2f(this.ni + 1, this.nj);
    this.vVol = new Array2f(this.ni, this.nj + 1);
    this.cVol = new Array2f(this.ni, this.nj);
    this.nVol = new Array2f(this.ni + 1, this.nj + 1);
    this.viscosity = new Array2f(this.ni, this.nj);
    this.viscosity.fill(1.0);

    // extrapolation
    this.valid = new Array2f(this.ni + 1, this.nj + 1);
    this.oldValid = new Array2f(this.ni + 1, this.nj + 1);

    // particles
    this.particleRadius = this.dx / Math.sqrt(2.0);
    this.particles = [];
  }

  addParticle(x, y) {
    this.particles.push(new Vector2(x, y));
  }

  setBoundary(signedBoundaryFn) {
    for (let j = 0; j < this.nj + 1; j++) {
      for (let i = 0; i < this.ni + 1; i++) {
        this.signedBoundary.set(i, j, signedBoundaryFn(i * this.dx, j * this.dx));
      }
    }
  }

  advance(dt) {
    let t = 0;

    while (t < dt) {
      let substep = this.#cfl();

      if (t + substep > dt) {
        substep = dt - t;
      }
      // Passively advect particles
      this.#advectParticles(substep);

      // Estimate the liquid signed distance for density
      this.#computePhi();

      // Advance the velocity
      this.#advect(substep);
      this.#addGravity(substep);

      t += substep;
    }
  }

  #cfl() {
    let maxvel = 0;
    for (let i = 0; i < this.u.data.length; ++i) {
      maxvel = Math.max(maxvel, Math.abs(this.u.data[i]));
    }
    for (let i = 0; i < this.v.data.length; ++i)
      maxvel = Math.max(maxvel, Math.abs(this.v.data[i]));
    return this.dx / maxvel;
  }

  // calculate new particles position based on current velocity
  //
  // Use 2nd order Runge Kutta for integration
  // x = v dt
  // Maybe use 4th order RK in future
  #advectParticles(dt) {
    for (let p = 0; p < this.particles.length; p++) {
      let currentPosition = this.particles[p];
      let startVelocity = this.#getVelocity(currentPosition);

      let midpoint = currentPosition.add(startVelocity.iscale(0.5 * dt));
      let midVelocity = this.#getVelocity(midpoint);
      const newPosition = currentPosition.add(midVelocity.iscale(dt));

      // set new position
      this.particles[p] = newPosition;

      // Particles can still occasionally leave the domain due to truncation errors,
      // interpolation error, or large timesteps, so we project them back in for good measure.
      const scaledPos = newPosition.scale(this.inv_dx);
      const phiValue = this.signedBoundary.interpolateValue(scaledPos);
      if (phiValue < 0) {
        let normal = this.signedBoundary.interpolateGradient(scaledPos);
        normal.inormalize();
        this.particles[p] = newPosition.subtract(normal.iscale(phiValue));
      }
    }
  }

  #computePhi() {
    this.liquidPhi.fill(3 * this.dx);

    for (let p = 0; p < this.particles.length; p++) {
      let point = this.particles[p];

      // determine containing cell
      var [i, fx] = Utils.get_barycentric(point.x / this.dx - 0.5, 0, this.ni);
      var [j, fy] = Utils.get_barycentric(point.y / this.dx - 0.5, 0, this.nj);

      //compute distance to surrounding few points, keep if it's the minimum
      for (let j_off = j - 2; j_off <= j + 2; j_off++) {
        for (let i_off = i - 2; i_off <= i + 2; i_off++) {
          if (i_off < 0 || i_off >= this.ni || j_off < 0 || j_off >= this.nj)
            continue;

          let pos = new Vector2((i_off + 0.5) * this.dx, (j_off + 0.5) * this.dx);
          let phiTemp = pos.distance(point) - 1.02 * this.particleRadius;
          this.liquidPhi.set(i_off, j_off, Math.min(this.liquidPhi.get(i_off, j_off), phiTemp));
        }
      }
    }

    // "extrapolate" phi into solids if nearby
    for (let j = 0; j < this.nj; j++) {
      for (let i = 0; i < this.ni; i++) {
        if (this.liquidPhi.get(i, j) < 0.5 * this.dx) {
          let solidPhiVal = 0.25 * (
            this.signedBoundary.get(i, j) +
            this.signedBoundary.get(i + 1, j) +
            this.signedBoundary.get(i, j + 1) +
            this.signedBoundary.get(i + 1, j + 1)
          );
          if (solidPhiVal < 0) this.liquidPhi.set(i, j, -0.5 * this.dx);
        }
      }
    }
  }

  // Basic first order semi-Lagrangian advection of velocities
  #advect(dt) {
    // semi-Lagrangian advection on u-component of velocity
    for (let j = 0; j < this.nj; ++j) {
      for (let i = 0; i < this.ni + 1; ++i) {
        let pos = new Vector2(i * this.dx, (j + 0.5) * this.dx);
        pos = this.#traceRK2(pos, -dt);
        this.tempU.set(i, j, this.#getVelocity(pos).x);
      }
    }

    // semi-Lagrangian advection on v-component of velocity
    for (let j = 0; j < this.nj + 1; ++j) {
      for (let i = 0; i < this.ni; ++i) {
        let pos = new Vector2((i + 0.5) * this.dx, j * this.dx);
        pos = this.#traceRK2(pos, -dt);
        this.tempV.set(i, j, this.#getVelocity(pos).y);
      }
    }

    // move update velocities into u/v vectors
    this.u = this.tempU;
    this.v = this.tempV;
  }

  #addGravity(_dt) {
    this.v.add(-0.1);
  }

  #getVelocity(position) {
    let u_val = this.u.interpolateValue(position.scale(this.inv_dx).subtract(new Vector2(0, 0.5)));
    let v_val = this.v.interpolateValue(position.scale(this.inv_dx).subtract(new Vector2(0.5, 0)));

    return new Vector2(u_val, v_val);
  }

  #traceRK2(position, dt) {
    let velocity = this.#getVelocity(position);
    let newPos = position.add(velocity.iscale(0.5 * dt));
    velocity = this.#getVelocity(newPos);
    return position.add(velocity.iscale(dt));
  }
}

function setupGridContainer(sim, displayLen) {
  const grid = new PIXI.Graphics();

  const displayDX = displayLen / sim.ni;
  const width = sim.ni * displayDX;
  const height = sim.nj * displayDX;

  grid.lineStyle(1, 0xFFFFFF, 0.5);

  for (let i = 0; i <= sim.nj; i++) {
    grid.moveTo(i * displayDX, 0);
    grid.lineTo(i * displayDX, height);
  }
  for (let j = 0; j <= sim.ni; j++) {
    grid.moveTo(0, j * displayDX);
    grid.lineTo(width, j * displayDX);
  }

  grid.x = app.screen.width / 2;
  grid.y = app.screen.height / 2;

  grid.pivot.x = grid.width / 2;
  grid.pivot.y = grid.height / 2;


  return grid;
}

function setupFluidContainer(sim, displayLen) {
  const container = new PIXI.Container();
  container.interactiveChildren = false;

  // set container position
  container.width = displayLen;
  container.height = displayLen;
  container.x = (app.view.width - displayLen) / 2;
  container.y = (app.view.height - displayLen) / 2;

  sim.fluidGraphics = new PIXI.Graphics();
  container.addChild(sim.fluidGraphics);

  const blurFilter1 = new PIXI.filters.BlurFilter();
  container.filters = [blurFilter1];
  blurFilter1.blur = 2;

  return container;
}

function setUpDragBackground(sim, displayLen) {
  const bg = new PIXI.Graphics();
  bg.beginFill(0x3a3a3a, 0.1);
  bg.drawRect(0, 0, displayLen, displayLen);
  bg.endFill();

  bg.lineStyle(1, 0xFFBD01, 1);
  bg.drawCircle(bg.width / 2, bg.height / 2, 0.4 * displayLen);
  bg.endFill();

  bg.x = app.view.width / 2;
  bg.y = app.view.height / 2;

  bg.pivot.x = bg.width / 2;
  bg.pivot.y = bg.height / 2;

  bg.interactive = true;

  // add drag events to fluid container
  bg
    .on('pointerdown', onDragStart)
    .on('pointerup', onDragEnd)
    .on('pointerupoutside', onDragEnd)
    .on('pointermove', onDragMove);

  return bg;
}

function onDragStart(event) {
  this.data = event.data;
  this.dragging = true;
}

function onDragEnd() {
  this.dragging = false;
  this.data = null;
}

function onDragMove() {
  if (this.dragging) {
    const newPosition = this.data.getLocalPosition(this.parent);
    let x = (newPosition.x - (app.view.width - GRID_DISPLAY_LENGTH) / 2) / GRID_DISPLAY_LENGTH;
    let y = (newPosition.y - (app.view.height - GRID_DISPLAY_LENGTH) / 2) / GRID_DISPLAY_LENGTH;

    if (x > 0 && x <= 1.0 && y > 0 && y <= 1.0) {
      fluidSim.addParticle(x, 1 - y);
    }
  }
}

function renderFluid(sim, displayLen) {
  const particles = sim.particles;
  sim.fluidGraphics.clear();

  for (let i = 0; i < particles.length; i++) {
    let x = particles[i].x * displayLen;
    let y = (1 - particles[i].y) * displayLen;

    sim.fluidGraphics.beginFill(0xDE3249, 1);
    sim.fluidGraphics.drawCircle(x, y, 5);
    sim.fluidGraphics.endFill();
  }
}

function update(dt) {
  // render fluid every 100ms
  renderTimeElapsed += app.ticker.elapsedMS;
  if (renderTimeElapsed > 100) {
    renderFluid(fluidSim, GRID_DISPLAY_LENGTH);
    renderTimeElapsed -= 100;
  }

  // advance simulation on every update i.e 1/FPS seconds.
  if (playSimulation) {
    fluidSim.advance(0.01);
  }
}

function insideCircle(x, y, cx, cy, radius) {
  return (Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy)) - radius);
}

let app = new PIXI.Application({
  view: document.getElementById("canvas"),
  width: 500,
  height: 500,
  backgroundColor: 0x3a3a3a,
});
app.ticker.add(update);
app.ticker.maxFPS = 30;
var renderTimeElapsed = 0;

const GRID_RES = 30;
const GRID_DISPLAY_LENGTH = 400;

// setup fluid physics stuff
let fluidSim = new FluidSim(GRID_RES);
fluidSim.setBoundary((x, y) => {
  return -1 * insideCircle(x, y, 0.5, 0.5, 0.4);
});

// setup rendering stuff
let gridContainer = setupGridContainer(fluidSim, GRID_DISPLAY_LENGTH);
let fluidContainer = setupFluidContainer(fluidSim, GRID_DISPLAY_LENGTH);
let background = setUpDragBackground(fluidSim, GRID_DISPLAY_LENGTH);

app.stage.addChild(gridContainer);
app.stage.addChild(fluidContainer);
app.stage.addChild(background);


// Add some particles for testing
fluidSim.addParticle(0.662281, 0.59606);
// fluidSim.addParticle(0.582053, 0.648958);
// fluidSim.addParticle(0.60656, 0.586516);


var playSimulation = true
function pause(e) {
  playSimulation = !playSimulation;
}
