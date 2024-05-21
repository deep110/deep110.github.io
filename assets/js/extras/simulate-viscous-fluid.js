class Array2f {
  constructor(ni, nj) {
    this.ni = ni;
    this.nj = nj;
    this.data = new Float32Array(ni * nj);
  }

  fill(val) {
    this.data.fill(val);
  }

  copy(arr) {
    let d = arr.data;
    for (let k = 0; k < this.data.length; k++) {
      this.data[k] = d[k];
    }
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
    var [i, fx] = Utils.getBarycentric(point.x, 0, this.ni);
    var [j, fy] = Utils.getBarycentric(point.y, 0, this.nj);

    return Utils.bilerp(
      this.get(i, j), this.get(i + 1, j),
      this.get(i, j + 1), this.get(i + 1, j + 1), fx, fy
    );
  }

  interpolateGradient(point) {
    var [i, fx] = Utils.getBarycentric(point.x, 0, this.ni);
    var [j, fy] = Utils.getBarycentric(point.y, 0, this.nj);

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

class SparseMatrix {
  constructor(dim) {
    this.n = dim;
    this.index = Array.from({ length: dim }, () => []);
    this.value = Array.from({ length: dim }, () => []);
  }

  zero() {
    for (var i = 0; i < this.n; i++) {
      this.index[i].length = 0;
      this.value[i].length = 0;
    }
  }

  set(i, j, newValue) {
    for (let k = 0; k < this.index[i].length; ++k) {
      if (this.index[i][k] == j) {
        this.value[i][k] = newValue;
        return;
      } else if (this.index[i][k] > j) {
        this.index[i].splice(k, 0, j);
        this.value[i].splice(k, 0, newValue);
        return;
      }
    }
    this.index[i].push(j);
    this.value[i].push(newValue);
  }

  add(i, j, incrementValue) {
    for (let k = 0; k < this.index[i].length; ++k) {
      if (this.index[i][k] == j) {
        this.value[i][k] += incrementValue;
        return;
      } else if (this.index[i][k] > j) {
        this.index[i].splice(k, 0, j);
        this.value[i].splice(k, 0, incrementValue);
        return;
      }
    }
    this.index[i].push(j);
    this.value[i].push(incrementValue);
  }
}

class FixedSparseMatrix {
  constructor() {
    this.n = 0;
    this.value = []; // nonzero values row by row
    this.colIndex = []; // corresponding column indices
    this.rowStart = [];
  }

  resize(dim) {
    if (this.n != dim) {
      this.n = dim;
      this.rowStart = Array(dim + 1);
    }
  }

  constructFromMatrix(matrix) {
    this.resize(matrix.n);
    this.rowStart[0] = 0;
    for (let i = 0; i < this.n; ++i) {
        this.rowStart[i + 1] = this.rowStart[i] + matrix.index[i].length;
    }
    this.value = new Float32Array(this.rowStart[this.n]);
    this.colIndex = new Array(this.rowStart[this.n]);
    let j = 0;
    for (let i = 0; i < this.n; ++i) {
        for (let k = 0; k < matrix.index[i].length; ++k) {
            this.value[j] = matrix.value[i][k];
            this.colIndex[j] = matrix.index[i][k];
            ++j;
        }
    }
  }

  // perform result = matrix * x
  multiplyVector(x, result) {
    result.fill(0);
    for (let i = 0; i < this.n; ++i) {
      for (let j = this.rowStart[i]; j < this.rowStart[i + 1]; ++j) {
        result[i] += this.value[j] * x[this.colIndex[j]];
      }
    }
  }
}

class SparseColumnLowerFactor {
  constructor() {
    this.n = 0;
    this.aDiag = [] // just used in factorization: minimum "safe" diagonal entry allowed
    this.invDiag = [] // reciprocals of diagonal elements
    this.colStart = [] // where each column begins in rowindex (plus an extra entry at the end, of #nonzeros)
    this.value = []; // values below the diagonal, listed column by column
    this.rowIndex = []; // a list of all row indices, for each column in turn
  }

  resize(dim) {
    if (this.n != dim) {
      this.n = n;
      this.aDiag = new Float32Array(n);
      this.invDiag = new Float32Array(n);
      this.colStart = new Array(n + 1);
    } else {
      this.invDiag.fill(0);
      this.aDiag.fill(0);
    }
    this.value = [];
    this.rowIndex = [];
  }
}

// Encapsulates the Conjugate Gradient algorithm with incomplete Cholesky
// factorization preConditioner.
class PCGSolver {
  constructor() {
    this.setSolverParameters(1e-5, 100, 0.97, 0.25);
    this.fixedMatrix = new FixedSparseMatrix();
    this.ltMatrix = new SparseColumnLowerFactor();
  }

  setSolverParameters(toleranceFactor = 1e-5, maxIterations = 100, modifiedIncompleteCholeskyParameter = 0.97, minDiagonalRatio = 0.25) {
    this.toleranceFactor = toleranceFactor;
    if (this.toleranceFactor < 1e-30) {
      this.toleranceFactor = 1e-30;
    }
    this.maxIterations = maxIterations;
    this.modifiedIncompleteCholeskyParameter = modifiedIncompleteCholeskyParameter;
    this.minDiagonalRatio = minDiagonalRatio;
  }

  solve(matrix, rhs, result) {
    let residualOut = 0;
    const matrixLength = matrix.n;

    this.Z = new Float32Array(matrixLength);
    this.R = new Float32Array(rhs);
    result.fill(0);

    residualOut = Utils.listAbsMax(this.R);
    if (residualOut === 0) {
      return true;
    }
    const tol = this.toleranceFactor * residualOut;

    this.formPreConditioner(matrix);
    this.applyPreConditioner(this.R, this.Z);
    let rho = Utils.listDot(this.Z, this.R);
    if (rho === 0) {
      return false;
    }

    this.S = this.Z.slice();
    this.fixedMatrix.constructFromMatrix(matrix);
    for (let iteration = 0; iteration < this.maxIterations; ++iteration) {
      this.fixedMatrix.multiplyVector(this.S, this.Z);
      const alpha = rho / Utils.listDot(this.S, this.Z);
      Utils.listAddScaled(alpha, this.S, result);
      Utils.listAddScaled(-alpha, this.Z, this.R);
      residualOut = Utils.absMax(this.R);
      if (residualOut <= tol) {
        return true;
      }
      this.applyPreConditioner(this.R, this.Z);
      const rhoNew = Utils.listDot(this.Z, this.R);
      const beta = rhoNew / rho;

      Utils.listAddScaled2(beta, this.S, this.Z); // s = beta * s + z
      rho = rhoNew;
    }
    return false;
  }

  formPreConditioner(matrix) {
    this.#factorModifiedIncompleteCholesky0(matrix, this.ltMatrix);
  }

  applyPreConditioner(x, result) {
    solveLower(this.ltMatrix, x, result);
    solveLowerTransposeInPlace(this.ltMatrix, result);
  }

  // It decomposes definite matrix into a lower-triangular matrix times its transpose, i.e.,
  // A = L * L^T
  //    where, A is the original matrix
  //           L is the lower triangular matrix
  #factorModifiedIncompleteCholesky0(matrix, factor, modification_parameter = 0.97, min_diagonal_ratio = 0.25) {
    factor.resize(matrix.n);
  
    for (let i = 0; i < matrix.n; ++i) {
      factor.colstart[i] = factor.rowindex.length;
      for (let j = 0; j < matrix.index[i].length; ++j) {
        if (matrix.index[i][j] > i) {
          factor.rowindex.push(matrix.index[i][j]);
          factor.value.push(matrix.value[i][j]);
        } else if (matrix.index[i][j] === i) {
          factor.invdiag[i] = factor.adiag[i] = matrix.value[i][j];
        }
      }
    }
  
    factor.colstart[matrix.n] = factor.rowindex.length;
  
    for (let k = 0; k < matrix.n; ++k) {
      if (factor.adiag[k] === 0) continue;
  
      if (factor.invdiag[k] < min_diagonal_ratio * factor.adiag[k]) {
        factor.invdiag[k] = 1 / Math.sqrt(factor.adiag[k]);
      } else {
        factor.invdiag[k] = 1 / Math.sqrt(factor.invdiag[k]);
      }
  
      for (let p = factor.colstart[k]; p < factor.colstart[k + 1]; ++p) {
        factor.value[p] *= factor.invdiag[k];
      }
  
      for (let p = factor.colstart[k]; p < factor.colstart[k + 1]; ++p) {
        const j = factor.rowindex[p];
        const multiplier = factor.value[p];
        let missing = 0;
        let a = factor.colstart[k];
        let b = 0;
  
        while (a < factor.colstart[k + 1] && factor.rowindex[a] < j) {
          while (b < matrix.index[j].length) {
            if (matrix.index[j][b] < factor.rowindex[a]) {
              ++b;
            } else if (matrix.index[j][b] === factor.rowindex[a]) {
              break;
            } else {
              missing += factor.value[a];
              break;
            }
          }
          ++a;
        }
  
        if (a < factor.colstart[k + 1] && factor.rowindex[a] === j) {
          factor.invdiag[j] -= multiplier * factor.value[a];
        }
  
        ++a;
      }
    }
  }
}

class Utils {
  static lerp(value0, value1, f) {
    return (1 - f) * value0 + f * value1;
  }

  static bilerp(v00, v10, v01, v11, fx, fy) {
    return Utils.lerp(Utils.lerp(v00, v10, fx), Utils.lerp(v01, v11, fx), fy);
  }

  static getBarycentric(val, i_low, i_high) {
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

  static insideCircle(x, y, cx, cy, radius) {
    return (Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy)) - radius);
  }

  static listAbsMax(array) {
    return Math.max.apply(null, array.map(Math.abs));
  }

  static listDot(xArr, yArr) {
    let sum = 0;
    for (let i = 0; i < xArr.length; ++i) {
      sum += xArr[i] * yArr[i];
    }
    return sum;
  }

  // y = alpha * x + y
  static listAddScaled(alpha, xArr, yArr) {
    for (let i = 0; i < xArr.length; i++) {
      yArr[i] += alpha * xArr[i];
    }
  }

  // x = alpha * x + y
  static listAddScaled2(alpha, xArr, yArr) {
    for (let i = 0; i < xArr.length; i++) {
      xArr[i] = alpha * xArr[i] + yArr[i];
    }
  }
}

class FluidSim {
  constructor(gridRes, viscosity = 1.0) {
    this.ni = gridRes; // number rows
    this.nj = gridRes; // number columns
    this.dx = 1.0 / gridRes;
    this.invDx = gridRes;

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
    this.viscosity = viscosity;

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
      let subStep = this.#cfl();

      if (t + subStep > dt) {
        subStep = dt - t;
      }
      // Passively advect particles
      this.#advectParticles(subStep);

      // Estimate the liquid signed distance for density
      this.#computePhi();

      // Advance the velocity
      this.#advect(subStep);
      this.#addGravity(subStep);

      this.#applyViscosity(subStep);

      // For extrapolated velocities, replace the normal component with that of the object.
      this.#constrainVelocity();

      let p = this.particles[0];
      let v = this.#getVelocity(p);
      // console.log(p.x, p.y, "velocity:", v.x, v.y);

      t += subStep;
    }
  }

  render(displayLen) {
    this.fluidGraphics.clear();

    for (let i = 0; i < this.particles.length; i++) {
      let x = this.particles[i].x * displayLen;
      let y = (1 - this.particles[i].y) * displayLen;

      this.fluidGraphics.beginFill(0xDE3249, 1);
      this.fluidGraphics.drawCircle(x, y, 8);
      this.fluidGraphics.endFill();
    }
  }

  #cfl() {
    let maxVel = 0;
    for (let i = 0; i < this.u.data.length; ++i) {
      maxVel = Math.max(maxVel, Math.abs(this.u.data[i]));
    }
    for (let i = 0; i < this.v.data.length; ++i) {
      maxVel = Math.max(maxVel, Math.abs(this.v.data[i]));
    }
    return this.dx / maxVel;
  }

  // calculate new particles position based on current velocity
  //
  // Use 2nd order Runge Kutta for integration
  // x = v dt
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
      const scaledPos = newPosition.scale(this.invDx);
      const phiValue = this.signedBoundary.interpolateValue(scaledPos);
      if (phiValue < 0) {
        let normal = this.signedBoundary.interpolateGradient(scaledPos);
        normal.normalize();
        this.particles[p] = newPosition.sub(normal.iscale(phiValue));
      }
    }
  }

  #computePhi() {
    this.liquidPhi.fill(3 * this.dx);

    for (let p = 0; p < this.particles.length; p++) {
      let point = this.particles[p];

      // determine containing cell
      var [i, _fx] = Utils.getBarycentric(point.x / this.dx - 0.5, 0, this.ni);
      var [j, _fy] = Utils.getBarycentric(point.y / this.dx - 0.5, 0, this.nj);

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
    this.u.copy(this.tempU);
    this.v.copy(this.tempV);
  }

  #addGravity(_dt) {
    this.v.add(-0.1);
  }

  #applyViscosity(dt) {
    // Estimate weights at velocity and stress positions
    this.#computeVolumeFractions(this.liquidPhi, this.cVol, new Vector2(-0.5, -0.5), 2);
    this.#computeVolumeFractions(this.liquidPhi, this.nVol, new Vector2(-1, -1), 2);
    this.#computeVolumeFractions(this.liquidPhi, this.uVol, new Vector2(-1, -0.5), 2);
    this.#computeVolumeFractions(this.liquidPhi, this.vVol, new Vector2(-0.5, -1), 2);

    const ni = this.liquidPhi.ni;
    const nj = this.liquidPhi.nj;


  }

  #constrainVelocity() {
    this.tempU.copy(this.u);
    this.tempV.copy(this.v);

    // constrain u
    for (let j = 0; j < this.u.nj; ++j) {
      for (let i = 0; i < this.u.ni; ++i) {
        if (this.uWeights.get(i, j) == 0) {
          // apply constraint
          let pos = new Vector2(i * this.dx, (j + 0.5) * this.dx);
          let vel = this.#getVelocity(pos);
          pos.iscale(this.invDx);
          let normal = this.signedBoundary.interpolateGradient(pos);
          normal.normalize();

          let perpComponent = vel.dot(normal);
          vel.x -= perpComponent * normal.x;
          this.tempU.set(i, j, vel.x);
        }
      }
    }

    // constrain v
    for (let j = 0; j < this.v.nj; ++j) {
      for (let i = 0; i < this.v.ni; ++i) {
        if (this.vWeights.get(i, j) == 0) {
          //apply constraint
          let pos = new Vector2((i + 0.5) * this.dx, j * this.dx);
          let vel = this.#getVelocity(pos);
          pos.iscale(this.invDx);
          let normal = this.signedBoundary.interpolateGradient(pos);
          normal.normalize();

          let perpComponent = vel.dot(normal);
          vel.y -= perpComponent * normal.y;
          this.tempV.set(i, j, vel.y);
        }
      }
    }

    // update
    this.u.copy(this.tempU);
    this.v.copy(this.tempV);
  }

  #getVelocity(position) {
    let uVal = this.u.interpolateValue(position.scale(this.invDx).sub(new Vector2(0, 0.5)));
    let vVal = this.v.interpolateValue(position.scale(this.invDx).sub(new Vector2(0.5, 0)));

    return new Vector2(uVal, vVal);
  }

  #traceRK2(position, dt) {
    let velocity = this.#getVelocity(position);
    let newPos = position.add(velocity.iscale(0.5 * dt));
    velocity = this.#getVelocity(newPos);
    return position.add(velocity.iscale(dt));
  }

  #computeVolumeFractions(levelSet, fractions, fraction_origin, subdivision) {
    // Assumes levelSet and fractions have the same dx
    let sub_dx = 1.0 / subdivision;
    let sample_max = subdivision * subdivision;
    for (let j = 0; j < fractions.nj; ++j) {
      for (let i = 0; i < fractions.ni; ++i) {
        let start_x = fraction_origin.x + i;
        let start_y = fraction_origin.y + j;
        let inCount = 0;

        for (let sub_j = 0; sub_j < subdivision; ++sub_j) {
          for (let sub_i = 0; sub_i < subdivision; ++sub_i) {
            let x_pos = start_x + (sub_i + 0.5) * sub_dx;
            let y_pos = start_y + (sub_j + 0.5) * sub_dx;
            let phi_val = levelSet.interpolateValue(new Vector2(x_pos, y_pos));
            if (phi_val < 0) ++inCount;
          }
        }
        fractions.set(i, j, inCount / sample_max);
      }
    }
  }
}

function setupGridContainer(sim, displayLen) {
  const grid = new PIXI.Graphics();

  const displayDX = displayLen / sim.ni;
  const width = sim.ni * displayDX;
  const height = sim.nj * displayDX;

  grid.beginFill(0x000000, 0.1);
  grid.drawRect(0, 0, width, height);
  grid.endFill();

  grid.lineStyle(1, 0xFFFFFF, 0.5);

  for (let i = 0; i <= sim.nj; i++) {
    grid.moveTo(i * displayDX, 0);
    grid.lineTo(i * displayDX, height);
  }
  for (let j = 0; j <= sim.ni; j++) {
    grid.moveTo(0, j * displayDX);
    grid.lineTo(width, j * displayDX);
  }

  // center the grid
  grid.x = (app.screen.width - width) / 2;
  grid.y = (app.screen.height - height) / 2;

  // setup drag controls on grid
  let dragging = false;
  let data = null;
  function onDragStart(event) {
    data = event.data;
    dragging = true;
  }

  function onDragEnd() {
    dragging = false;
    data = null;
  }

  function onDragMove() {
    if (dragging) {
      const newPosition = data.getLocalPosition(this.parent);
      let x = (newPosition.x - grid.x) / GRID_DISPLAY_LENGTH;
      let y = 1 - ((newPosition.y - grid.y) / GRID_DISPLAY_LENGTH);

      if (Utils.insideCircle(x, y, 0.5, 0.5, BEAKER_RADIUS) < 0) {
        fluidSim.addParticle(x, y);
      }
    }
  }

  grid.eventMode = "static";
  grid.on('mousedown', onDragStart);
  grid.on('pointerup', onDragEnd);
  grid.on('pointerupoutside', onDragEnd);
  grid.on('pointermove', onDragMove);

  return grid;
}

function setupFluidContainer(sim, displayLen, beakerRadius) {
  const container = new PIXI.Container();
  container.interactiveChildren = false;

  // set container position
  container.width = displayLen;
  container.height = displayLen;
  container.x = (app.screen.width - displayLen) / 2;
  container.y = (app.screen.height - displayLen) / 2;

  sim.fluidGraphics = new PIXI.Graphics();
  container.addChild(sim.fluidGraphics);

  // add its container
  const beaker = new PIXI.Graphics();
  beaker.lineStyle(1, 0xFFBD01, 1);
  beaker.drawCircle(displayLen / 2, displayLen / 2, beakerRadius * displayLen);
  beaker.endFill();
  container.addChild(beaker);

  const blurFilter1 = new PIXI.filters.BlurFilter();
  sim.fluidGraphics.filters = [blurFilter1];
  blurFilter1.blur = 2;

  return container;
}

function update() {
  // render fluid every 100ms
  renderTimeElapsed += app.ticker.elapsedMS;
  if (renderTimeElapsed > 100) {
    fluidSim.render(GRID_DISPLAY_LENGTH);
    renderTimeElapsed -= 100;
  }

  // advance simulation on every update i.e 1/FPS seconds.
  if (playSimulation) {
    var start = Date.now();
    fluidSim.advance(0.01);
    // for (let i = 0; i < 2; i++) {
    //   fluidSim.advance(0.01);
    // }
    // playSimulation = false;
    var end = Date.now();
    console.log(`Execution time: ${end - start} ms`);
  }
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

const GRID_RES = 26;
const GRID_DISPLAY_LENGTH = 450;
const BEAKER_RADIUS = 0.4;

// setup fluid physics stuff
let fluidSim = new FluidSim(GRID_RES, 1.0);
fluidSim.setBoundary((x, y) => {
  return -1 * Utils.insideCircle(x, y, 0.5, 0.5, BEAKER_RADIUS);
});

// setup rendering stuff
let gridContainer = setupGridContainer(fluidSim, GRID_DISPLAY_LENGTH);
let fluidContainer = setupFluidContainer(fluidSim, GRID_DISPLAY_LENGTH, BEAKER_RADIUS);

app.stage.addChild(gridContainer);
app.stage.addChild(fluidContainer);


// Add some particles for testing
fluidSim.addParticle(0.662281, 0.59606);
// fluidSim.addParticle(0.582053, 0.648958);
// fluidSim.addParticle(0.60656, 0.586516);


var playSimulation = false;
function pause(e) {
  playSimulation = !playSimulation;
}


function visualize2dArr(arr) {
  const visualize = document.getElementById("visualize");
  const table = document.createElement("table");
  const hd = document.createElement("div");

  for (let i = 0; i < arr.ni; i++) {
    let tr = document.createElement("tr");
    for (let j = 0; j < arr.nj; j++) {
      let td = document.createElement("td");
      td.textContent = arr.get(i, j).toFixed(3);
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  hd.textContent = "Heading";

  visualize.appendChild(hd);
  visualize.appendChild(table);
}
