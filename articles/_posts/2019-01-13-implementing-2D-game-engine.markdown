---
layout: post
title: "Implementing your Own 2D game engine"
date: 2019-01-13 10:00:00 +0530
scripts: [katex.min.js]
css: [katex.min.css]
---
First of all, you would think that when there are so many game engines out there why
would you want to implement your own. Well it may be that you don't like any of them, or just thinking of starting a game and implementing your own engine might be a good idea, then please don't do it and this article might not be for you. But if you (like me), want to learn nitty-gritty of a physics engine, this could be a good exercise.

Here is the demo of the end result and you can find the code [here](https://github.com/deep110/LucidEngine) on my github.


<div style="text-align:center"><img src="/assets/images/2019-01/game_engine_demo.gif"/></div>
<br><br>
In this article I won't be providing any code snippets since you can find that in the github link I have provided above, but more of an explanation of how things are pieced together.

First, we will start with some basic assumptions:
1. All bodies are [rigid bodies](https://en.wikipedia.org/wiki/Rigid_body) means they cannot deform on impact.
2. Colliding shapes of rigidbodies are [convex](https://en.wikipedia.org/wiki/Convex_polygon), non-convex shapes should be bounded by a convex shape for collision detection purposes.
2. Physics simulation runs at a constant frame rate i.e usually 60 fps.
3. Whatever I will be describing has been implemented for 2D but most of the general idea is applicable for 3D as well. Also, the processes I have described is what I have implemented, different game engines tend to use different models or optimizations.

### Overview
For a physics engine to function properly it should perform three basic things:
1. It should be able to predict translational properties like position, velocity, acceleration and rotational properties like orientation, angular velocity, torque at any given point of time.
2. It should be able to detect which bodies are colliding.
3. It should be able to properly resolve the impulses generated due to those collisions.


### Calculating Properties
For calculating the properties we basically use Newton's Law of motion.
<p class="equation">v = \intop{1/m * F \; dt}</p>
and,
<p class="equation">x = \intop{v \; dt}</p>
where,  
F = force applied  
v = Velocity  
m = mass of body  
x = position  
dt = time elapsed since last execution (1\60 if 60 fps)

To solve these differential equations for games, we widely come across these three integrator:
1. [Explicit Euler method](https://en.wikipedia.org/wiki/Euler_method)

    <div style="text-align:center"><img src="/assets/images/2019-01/euler-method.png"/></div>
    It is the most basic method to solve this first order differential equation. It is just adding the curve values at small intervals.
    <p class="equation" style="text-align:center">x_{n+1} = x_n + v(t_n) * dt\\v_{n+1} = v_n + a(t_n) * dt</p>
2. [Implicit (Symplectic) Euler](https://en.wikipedia.org/wiki/Backward_Euler_method)

    The difference here is we solve the problem using right [Reimann sum rule](https://en.wikipedia.org/wiki/Riemann_sum) instead of left sum rule. For those who are not going to read wikipedia, reimann sum is used to calculate the area of the region by breaking it into small shapes. In euler methods region is a rectangle.

    For example to get position at time t, we will need velocity at time t+1, so instead of starting with zero velocity we compute velocity first and then position.
    <p class="equation" style="text-align:center">v_{n+1} = v_n + a(t_{n+1}) * dt\\x_{n+1} = x_n + v(t_{n+1}) * dt</p>

3. [Runge-Kutta (RK) 4th Order Method](https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods)
    
    I won't be going into much explanation about what it does, but it gives better accuracy than euler methods but is computationally expensive. Actually, Euler methods are just a special case of RK.

Implicit euler gives us more accurate results than explicit euler and is much closer to RK4. [Here](https://gafferongames.com/post/integration_basics/) is a more detailed comparison of all three methods and is explained why implicit euler is okay for game engines.

So using implicit euler we will get:
```python
 v += (1/m * F) * dt   # velocity
 x += v * dt           # position
```

If we take rotation into account,
```python
ω += (1/I * τ) * dt
θ += ω * dt
```
where,  
I = Moment of Inertia  
θ = orientation  
ω = angular velocity  
τ = Torque

### Calculate colliding pairs of rigidbodies
At each loop it is necessary for engine to know which pair of rigidbodies are colliding, so that the collision can be solved and bodies do not pass each other.

Naively if we iterate on all N bodies, we will need to check `N*(N-1)/2` possible combinations which are a lot. Suppose N = 100, we will need to check 4950 body pairs which can take way too much than the frame duration (i.e just 1/60s or 16ms). In most of the games there are more objects present than that at any given point of time.

So first we use a process called **BroadPhase calculation** to narrow down the number of collisions to check. Its purpose is to generate a list of pair of rigid bodies that may be colliding.
* It is implemented through [Space Partitioning](https://en.wikipedia.org/wiki/Space_partitioning) algorithms.
* The basic idea is that you divide the whole region into grids (in volumes for 3D) and assign every body to a position in the grid.

* Now, the body is added to each cell it is overlapping, so at last we iterate through grid and make pair of overlapping bodies. Objects are stored in data structures like [k-d tree](https://en.wikipedia.org/wiki/K-d_tree) or [BSP tree](https://en.wikipedia.org/wiki/BSP_tree) for efficiency. It generally reduces the iterate time from O(N<sup>2</sup>) to logarithmic times.
[Here](http://buildnewgames.com/broad-phase-collision-detection/) is a nice blog explaining the broadphase implementation in more detail, like choice of grid size, etc. My demo was just for a small scope, so I have not implemented this part.


Then we proceed to **NarrowPhase calculation** i.e which actually determines which bodies are colliding. Aim of Narrowphase is to calculate three things for every pair of colliding bodies:
1. *Collision Normal*: Direction of bodies they are colliding
2. *Penetration Depth*: How much bodies have overlapped each other
3. *Contact Points*: Points of contact where they are overlapping

It can be implemented using [Separating Axis Theorem](https://en.wikipedia.org/wiki/Hyperplane_separation_theorem). The basic principle is:  *If two bodies are not colliding, there will be a certain axis for which their projections will not overlap.*

For a general convex polygon there could be a lot of axes to check, but for simplification purposes, I have just taken the shape of the colliders to be *Circle* and *Axis-Aligned Bounding Box (AABB)* i.e just a rectangle. Now for collision checks, we will like to implement four combinations (not taking rotation into account):
* Circle-Circle:
  
  For this, test is easy - Distance between circles should be less than sum of their radii
  ```java
  // distance must be less for overlap
  isColliding = distance(circle1, circle2) <= circle1.radius + circle2.radius
  ```

* Circle-AABB
  
  We will first find the nearest point of contact on AABB between AABB and circle.
  ```java
  positionDiff = AABB.pos - circle.pos
  
  // on x-axis take the point which is near, the bounds or diff
  nearestPoint.x = clamp(-AABB.width/2, AABB.width/2, positionDiff.x)
  // same for y-axis
  nearestPoint.y = clamp(-AABB.height/2, AABB.height/2, positionDiff.y)

  // distance between nearest point on rectangle and circle's center should
  // be less than circle's radius
  isColliding = distance(circle1, nearestPoint) <= circle.radius
  ```
* AABB-Circle
  
  Same procedure as above

* AABB-AABB
  
  ```java
  positionDiff = AABB2.pos - AABB1.pos

  // find overlap values
  xOverlap = AABB1.width/2 + AABB2.width/2 - abs(positionDiff.x) // x-axis overlap
  yOverlap = AABB1.height/2 + AABB2.height/2 - abs(positionDiff.y) // y-axis overlap
  
  // for bodies to be colliding both axis must overlap
  isColliding = xOverlap > 0 && yOverlap > 0
  ```

For a convex polygon its implementation will be more complex, there is a good [video](https://gdcvault.com/play/1017646/Physics-for-Game-Programmers-The) in GDC Vault explaining the process. Also you can go through the [Box2D](https://github.com/erincatto/Box2D) code for the same. It is next in my list for implementation.

### Impulse Resolution
Impulse resolution means when bodies collide, we need to stop them from moving inside each other. The first thing that comes to mind is that we can apply a force to them, but force does not instantaneously change the velocity. For this we directly change the velocity of the bodies or say we applied an impulse (i.e you can think of it as a large force in almost zero time).

Each rigidbody apart from dynamic properties also has some physical properties which we group into **Material**.
- Mass (m): how much the body weigh
- Coefficient of restitution (e): how rough is the surface
- Coefficient of Static friction (μ<sub>s</sub>): friction coefficient for stationary objects
- Coefficient of dynamic friction (μ<sub>d</sub>): friction coefficient for moving objects

For a pair of bodies we calculate equivalent coefficients.
* Equivalent coefficient of restitution is `e = min(e1, e2)`.
* Equivalent coefficients of friction are:
  <pre><code class="equation">
  μ_s = \sqrt{μ_{s1} * μ_{s1} + μ_{s2} * μ_{s1}}\\
  μ_d = \sqrt{μ_{d1} * μ_{d1} + μ_{d2} * μ_{d1}}
  </code></pre>

During the time of contact we will consider two impulses acting on them:
1. Normal Force (Normal to the plane of contact)
2. Frictional Force (Tangential to the plane of contact)

Impulse (j) is calculated using [Momentum Conservation](https://en.wikipedia.org/wiki/Momentum#Conservation) and [Newton's law of restitution](https://en.wikipedia.org/wiki/Coefficient_of_restitution).

<div style="text-align:center"><img src="/assets/images/2019-01/object-collision.png"/></div>

#### Normal Impulse
Let us define some variables,
<pre><code>v<sub>A</sub>, u<sub>A</sub> = final and initial velocity of body A
v<sub>B</sub>, u<sub>B</sub> = final and initial velocity of body B
j<sub>A</sub> = change in momentum of A
j<sub>B</sub> = change in momentum of B
n = normal vector in direction of collision normal (n.n = 1)
</code></pre>

According to Newton's law of restitution,
```
e = relative final velocity / relative initial velocity
```
Since momentum is conserved change in momentum of Body A will be opposite to the change in momentum of body B i.e j<sub>A</sub> . n = -j<sub>B</sub> . n. Taking a dot product with `n` since we are interested only in normal direction.
<p class="equation">
e = \dfrac {-(v_{B} - v_{A})}{u_{B} - u_{A}}
\\~\\
j_{A}.n = m_{A} (v_{A} - u_{A})\\
j_{B}.n = -j_{A}.n = m_{B} (v_{B} - u_{B})\\
u_{AB} = u_{A} - u_{B}
</p>
So our aim is to calculate `j` in terms of initial velocity since we don't know the final velocities of bodies after collision. We will just rearrange the terms:
<p class="equation">
v_{A} = u_{A} + \dfrac {j_{A}n}{m_{A}}\\
v_{B} = u_{B} - \dfrac {j_{A}n}{m_{B}}
\\~\\
v_{B} - v_{A} = eu_{AB} = -u_{AB} - j_{A}n \big(\dfrac {1}{m_{A}} + \dfrac {1}{m_{B}}\big)
\\~\\
\boxed{j_{A} = -j_{B} = - \dfrac {(1+e) u_{AB}.n}{\big(\dfrac {1}{m_{A}} + \dfrac {1}{m_{B}}\big)}}
</p>

Whew, that's a lot of equations, but don't worry that's just rearranging the terms to get what we need, you can work it out yourself.

If you want to rotational motion into account, its easy, like linear momentum, angular momentum is also [conserved](https://en.wikipedia.org/wiki/Angular_momentum#Conservation_of_angular_momentum). Let us define more terms so that further equation can be clear.
```
L = angular momentum
p = linear momentum
I = Moment of Inertial about Center of Mass (COM)
r = radius vector perpendicular to COM
```
Some basic definitions,
<p class="equation">
L = I\omega = r x p\\
v_{A}^{total} = v_{A}^{linear} + r_{A}\omega_{A}
\\~\\
\Delta L = I \dfrac{\Delta v_{angular}}{r}
</p>
When considering the change in linear momentum also add angular momentum giving us final equation:
<p class="equation">
\boxed{j_{A} = -j_{B} = - \dfrac {(1+e) u_{AB}.n}{\big(\dfrac {1}{m_{A}} + \dfrac {1}{m_{B}} \big) + \dfrac {(r_{A}.n)^2}{I_{A}} + \dfrac {(r_{B}.n)^2}{I_{B}}}}
</p>

#### Frictional Impulse
Frictional Impulse is applied perpendicular to collision normal.
<div style="text-align:center"><img src="/assets/images/2019-01/tangent-normal-rv.png"/></div>

Frictional impulse can be calculated by just substituting normal vector with the tangential magnitude of relative velocity and in opposite direction.

Replace `n` with `t`:
<p class="equation">
\boxed{j_{f} = - \dfrac {(1+e) u_{AB}.t}{\big(\dfrac {1}{m_{A}} + \dfrac {1}{m_{B}} \big) + \dfrac {(r_{A}.n)^2}{I_{A}} + \dfrac {(r_{B}.n)^2}{I_{B}}}}
</p>
Now we just need to calculate `t`. For that we will get normal component of relative velocity and subtract from total relative velocity to get tangential component (Vector Math). Negative sign is used since friction is always opposite to the direction of motion.
<p class="equation">
t = -[V_{AB} − (V_{AB}⋅n)∗n]
</p>
But wait there is a catch, friction acts differently for static and dynamic objects, that is why two coefficients of friction. How to use them can be determined using [Coulomb's Law](https://en.wikipedia.org/wiki/Friction#Dry_friction).
<pre><code>j<sub>f</sub> <= μj<sub>n</sub></code></pre>

Let us understand this definition, if our solved `jf` (representing the force of friction ) is less than μ<sub>static</sub> times the normal force (`jn`), then we can use our `jf` magnitude as friction. If not, then we must use our normal force times μ<sub>dynamic</sub> instead.
<pre><code>
if (abs(jf) < μ<sub>s</sub>jn) {
    // no change
} else {
    jf = μ<sub>d</sub>jn
}
</code></pre>

<br>
Hopefully you can now begin to understand the basics of writing a game engine, and again you can find the code [here](https://github.com/deep110/LucidEngine). I have tried to include most of the topics that are absolutely required to implement a working demo. Now you can read up articles for specific topics to understand them more and how it will benefit your implementation.

#### Image and Other Credits
* Wikipedia
* [ResearchGate](https://www.researchgate.net/figure/Spatial-partition-of-a-2D-scene-using-a-quadtree-subdivision_fig2_236611845)
* [GameDevTuts](https://gamedevelopment.tutsplus.com/tutorials/collision-detection-using-the-separating-axis-theorem--gamedev-169)