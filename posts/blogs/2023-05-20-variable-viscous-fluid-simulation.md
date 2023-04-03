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



### PCG Solver

The code you provided is the implementation of a Preconditioned Conjugate Gradient (PCG) solver, which is an iterative method to solve a system of linear equations, Ax = b. Here, A is a sparse matrix, and b is a vector.

The PCG method is often used when A is a large sparse matrix, and traditional direct solvers (such as Gaussian elimination) are computationally expensive or not practical. The PCG method is efficient for such matrices and can solve the system of equations in a reasonable amount of time.

The PCGSolver struct contains a function called solve that accepts three parameters: a sparse matrix matrix, a right-hand side vector rhs, and an output vector result. The function finds a solution result such that matrix * result = rhs.

The method first checks if the residual (i.e., the difference between the actual result and the computed result) is zero. If it is, then the function returns true, indicating that no iterations were needed to solve the system. Otherwise, it initializes the temporary vectors and matrices required for the PCG algorithm.

The function then computes a preconditioner matrix, which is an approximation to the inverse of the original matrix A. This matrix is used to accelerate the convergence of the iterative method by reducing the condition number of the matrix. The preconditioner is constructed using the incomplete Cholesky factorization.

The PCG algorithm is then applied to solve the system of equations iteratively. In each iteration, the method computes the direction of the search, updates the solution vector, and computes the residual. The process continues until the residual is below the specified tolerance level or until the maximum number of iterations is reached.

If the method converges (i.e., the residual is below the specified tolerance), then the function returns true, indicating that a solution was found. Otherwise, it returns false, indicating that the method did not converge, and the solution may not be accurate.

#### WHY

The PCG solver can be used for the numerical simulation of fluid flow by solving the Navier-Stokes equations. In particular, the solver can be used to calculate the viscosity of fluids in the simulation.

The Navier-Stokes equations describe the motion of fluids, and consist of a set of partial differential equations that relate the velocity, pressure, and density of the fluid. These equations are difficult to solve analytically, and therefore numerical methods such as the PCG solver are used to obtain approximate solutions.

To calculate the viscosity of fluids using the PCG solver, one would first discretize the Navier-Stokes equations using a numerical method such as the finite volume method. This would result in a system of linear equations that can be solved using the PCG solver.

The viscosity of the fluid is related to the shear stress in the fluid, which can be calculated from the velocity gradients using the Navier-Stokes equations. By solving the linear system using the PCG solver, one can obtain the velocity field, and from this calculate the shear stress and hence the viscosity of the fluid.

In summary, the PCG solver can be used as a tool to numerically simulate fluid flow and calculate the viscosity of fluids.

```js
/**
 * Solves a linear system A * x = b using the conjugate gradient method.
 *
 * @param {Function} matVec A function that multiplies a given vector by the matrix A.
 *                          Takes a vector of length n as input and returns a vector of length n.
 * @param {Array} b The right-hand side vector of the linear system. An array of length n.
 * @param {Array} x0 The initial guess for the solution vector. An array of length n.
 * @param {Number} tol The tolerance for the residual norm. The algorithm stops when ||b - A*x|| < tol.
 * @param {Number} maxIter The maximum number of iterations allowed.
 * @returns {Array} The solution vector x. An array of length n.
 */
function conjugateGradient(matVec, b, x0, tol, maxIter) {
    const n = b.length;
    let x = x0.slice(); // Make a copy of the initial guess
    let r = vecSub(b, matVec(x)); // Compute the initial residual
    let p = r.slice(); // Use the residual as the initial search direction
    let rsold = vecDot(r, r); // Compute the squared norm of the residual
    let iter = 0; // Initialize the iteration counter

    while (Math.sqrt(rsold) > tol && iter < maxIter) {
        iter++;
        const Ap = matVec(p); // Compute the matrix-vector product Ap
        const alpha = rsold / vecDot(p, Ap); // Compute the step size alpha
        x = vecAdd(x, vecScale(p, alpha)); // Update the solution vector x
        r = vecSub(r, vecScale(Ap, alpha)); // Update the residual vector r
        const rsnew = vecDot(r, r); // Compute the squared norm of the new residual
        const beta = rsnew / rsold; // Compute the coefficient beta
        p = vecAdd(r, vecScale(p, beta)); // Update the search direction p
        rsold = rsnew; // Update the squared norm of the residual
    }

    return x;
}
```

The ICF preconditioner algorithm is as follows:

Initialize the incomplete Cholesky factorization factor with the original matrix A.
For each column k of factor:
a. Compute the diagonal entry factor(k, k) by taking the square root of the k-th diagonal entry of A.
b. For each row i in the k-th column of factor, compute the entries factor(i, k) as follows:
  i. Compute the dot product of the i-th row of A with the k-th column of factor up to the (i-1)-th row.
  ii. Subtract this dot product from the i-th entry of A.
  iii. Divide the result by factor(k, k).
c. Set all entries in the k-th row of factor to zero except the diagonal entry factor(k, k).
Apply the ICF preconditioner to the original linear system Ax = b as follows:
  a. Solve the lower triangular system Ly = b for y, where L is the lower triangular part of factor.
  b. Solve the upper triangular system L^Tz = y for z, where L^T is the transpose of the lower triangular part of factor.
  c. Use z as the initial guess for the CG method.

The CG method with the ICF preconditioner can converge faster than the CG method alone, especially for ill-conditioned matrices. However, the effectiveness of the ICF preconditioner depends on the sparsity structure of the matrix and the choice of the zero entries in the incomplete Cholesky factorization.

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


### Explanation from book

1. Advect particles
- For each particle, get the current velocity
- Use Rungee-Kutta 2nd order integration to get new position

I keep talking about how the quantity, or molecules, or parti- cles, move with the velocity field ⃗u. This is called advection (or sometimes convection or transport; they all mean the same thing). An advection equation is just one that uses the material derivative, at its simplest setting it to zero:

```
eq from pg 9 at the top
```
Read section - `1.3.2 Advecting Vector Quantities`





### Simulation from gpt

The main algorithm consists of three parts:

1. Advection of particles: Particles are advected using the PCG solver described earlier, which computes the velocity field of the fluid at each time step.

2. Calculation of free surfaces: The free surfaces of the fluid are computed using a level set method. The level set function is initialized with the signed distance function of the solid boundary, and is evolved using a reinitialization equation to maintain its signed distance property. The free surface is then defined as the zero level set of the evolved function.

3. Calculation of viscous forces: The viscous forces acting on the fluid are calculated using a pressure projection method. The velocity field computed by the PCG solver is projected onto a space of divergence-free functions, and the resulting field is used to compute the pressure and viscous forces.


Sure, here is a high-level description of the algorithm used in the paper "Accurate Viscous Free Surfaces for Buckling, Coiling, and Rotating Liquids" by Christopher Batty and Robert Bridson:

Initialize the simulation grid, including the level set representation of the liquid surface, the velocity field, and the pressure field.

Compute the pressure field using the Poisson equation with a suitable boundary condition.

Compute the advection term of the velocity field using a semi-Lagrangian method. This involves tracing each velocity grid point backwards along the characteristic curves of the velocity field to find the previous velocity value at that point.

Compute the diffusion term of the velocity field using the PCG solver described earlier. This involves solving a linear system of equations to find the updated velocity field that accounts for the effects of viscosity.

Update the level set function to account for the advection and diffusion of the liquid surface. This involves computing the characteristic curves of the velocity field and moving the liquid surface along those curves.

Use the updated level set function to compute the normal and tangent vectors at each point on the liquid surface. These vectors are needed for the calculation of the surface tension force.

Compute the surface tension force using the Young-Laplace equation, which relates the curvature of the liquid surface to the pressure difference across it. This force is applied at each point on the liquid surface.

Compute the gravitational force and any other external forces acting on the liquid, such as magnetic or electric forces.

Use the computed forces to update the velocity field, and then update the positions of the liquid grid points based on the new velocity field.

Repeat steps 2-9 for each time step of the simulation, until the desired simulation time has been reached.

Overall, this algorithm combines several numerical techniques such as level set methods, semi-Lagrangian advection, PCG solver for diffusion, and surface tension computation to accurately simulate the behavior of a liquid surface.