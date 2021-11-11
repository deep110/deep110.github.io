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

  toString() {
    this.data.toString();
  }
}

class Utils {
}

class FluidSim {
  constructor(gridRes) {
    this.ni = gridRes; // number rows
    this.nj = gridRes; // number columns
    this.dx = 1.0 / gridRes;

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
    this.nodalSolidPhi = new Array2f(this.ni + 1, this.nj + 1);

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
  bg.beginFill(0xDE3249, 0.1);
  bg.drawRect(0, 0, displayLen, displayLen);
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
  // ...
  // console.log(app.ticker.FPS)
  renderFluid(fluidSim, GRID_DISPLAY_LENGTH);
}


let app = new PIXI.Application({ width: 500, height: 500, backgroundColor: 0x3a3a3a });
document.getElementById("canvas-container").appendChild(app.view);
app.ticker.add(update);
app.ticker.maxFPS = 30;

const GRID_RES = 30;
const GRID_DISPLAY_LENGTH = 400;

// setup fluid physics stuff
let fluidSim = new FluidSim(GRID_RES);

// setup rendering stuff
let gridContainer = setupGridContainer(fluidSim, GRID_DISPLAY_LENGTH);
let fluidContainer = setupFluidContainer(fluidSim, GRID_DISPLAY_LENGTH);
let background = setUpDragBackground(fluidSim, GRID_DISPLAY_LENGTH);

app.stage.addChild(gridContainer);
app.stage.addChild(fluidContainer);
app.stage.addChild(background);
