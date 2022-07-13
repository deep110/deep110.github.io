---
layout: blog.liquid
title:  "Generating Convex Hull using Graham Scan"
categories: ["blog"]
data:
  keywords: "html5, canvas, convex, hull, graham, polygon"
  css: [katex.min.css]
  scripts: [extras/simulate-graham-scan.js]
---

I am trying to experiment with rendering some basic shapes on a pixel buffer for another [side project](https://github.com/deep110/verlet.rs) of mine. After trying out a few rust crates out there and not liking any, I eventually fell into the classic software engineering trap and wrote a small library - [ada](https://github.com/deep110/ada). It supports some basic shapes like - Line2D, Rectangle2D, Ellipse2D, Polygon2D and Bezier2D.

For polygons I wanted to create random shaped [convex polygons](https://en.wikipedia.org/wiki/Convex_polygon). One way to do that is to generate a set of random points and compute its convex hull. There are many [convex hull algorithms](https://en.wikipedia.org/wiki/Convex_hull_algorithms) but the one we are discussing below is [Graham Scan](https://en.wikipedia.org/wiki/Graham_scan) which takes O(n log n) time.

### Visualizing Steps

Here is a demo of the steps the algorithm takes.

<canvas id="canvas" height=500 width=600></canvas>
<style>
  canvas {
    background: #3a3a3a;
    display: block;
    margin: auto;
  }

  @media only screen and (max-width: 740px) {
    #canvas {
        width: calc(100vw - 2em);
    }
  }
</style>


### How does it work

#### **Step1:** Get the bottom most point P

We will start by finding the point with lowest y coordinate. If two points have same y-coordinate we will take the one with least x-coordinate. In the above demo, bottom most point is colored red.

<div style="text-align:center">
  <img src="/assets/images/2021-06/graham-bottom-point.png" alt="Graham Scan Bottom Most Point"></img>
</div>
<br>

Here is the code to find bottom-most point:
```js
class GrahamScan {
  constructor(points: []Vector2) {
    this.points = points;
    this.startPointIndex = undefined;
    this.stack = [];
  }

  function getBottomMostPoint() {
    var bottomIndex = 0;
    for (let i = 1; i < this.points.length; i++) {
      let pTry = this.points[i];
      if (pTry.y < this.points[bottomIndex].y ||
            (pTry.y == this.points[bottomIndex].y && pTry.x < this.points[bottomIndex].x)) {
        bottomIndex = i;
      }
    }
    this.startPointIndex = bottomIndex;
  }
}
```

We only iterate through the array once, hence time complexity till now is `O(n)`.

#### **Step2:** Sort the points in increasing order of angle with x-axis

Next we will sort the points in increasing order of angle they and Point P make with x-axis. In the above demo, the result of this sorting is shown by drawing a blue line to each point from bottom-most point P. You can intuitively see that marked line moves in anti-clockwise direction.

<div style="text-align:center">
  <img src="/assets/images/2021-06/graham-sort-order.png" alt="Graham Scan Sort Order"></img>
</div>
<br>

For making a comparison of angles for sorting function, we can calculate `cos θ` using dot product, but that would be little inefficient and we can do better than that.

{% equation %}
cos \theta = \frac{a.b} {|a| * |b|}
{% endequation %}

We don't need to actually calculate the angle to sort. We can compare the angle made by any two points [Let's call them A and B] using just the cross product of {% equation inline %}\overrightarrow{PA}{% endequation %} and {% equation inline %}\overrightarrow{PB}{% endequation %}.

Calculate the cross product for ordered triplet [P, A, B], If

<pre>
<code>{% equation inline %}\overrightarrow{PA} \times \overrightarrow{PB} > 0{% endequation %} => anti-clockwise means keep order as it is i.e A then B

{% equation inline %}\overrightarrow{PA} \times \overrightarrow{PB} < 0{% endequation %} => clockwise hence swap the order i.e B then A

{% equation inline %}\overrightarrow{PA} \times \overrightarrow{PB} = 0{% endequation %} => points are colinear, keep the one with least distance first
</code></pre>

<div style="text-align:center">
  <img src="/assets/images/2021-06/graham-sort-ab.png" alt="Graham Scan Sort AB"></img>
</div>
<br>

In the above picture if we get the order [P, A, B] then cross product will be positive keeping A first then B. Else if we get the order [P, B, A] then product will be negative, causing order to swap, again choosing A first then B.


Here is the code to implement sorting:
```js
class GrahamSort {
  ...

  /**
   * To find orientation of ordered triplet (p, q, r).
   *
   * @param {Vector2} p, q, r
   * @return {number} wether points are clockwise, counter-clockwise or colinear
   *
   *  0 => colinear, 1 => clockwise and 2 => counter-clockwise
   */
  function orientation(p, q, r) {
    let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

    if (val == 0) return 0;  // colinear
    return (val > 0) ? 1 : 2; // clock or counter-clock wise
  }

  function sort() {
    // first remove the bottom most point in the array
    let startPoint = this.points.splice(this.startPointIndex, 1);

    // now sort rest of the points
    this.sortedPoints = this.points.sort((a, b) => {
      let o = orientation(startPoint, this.points[a], this.points[b]);
      if (o == 0) {
        return (distSq(startPoint, points[a]) >= distSq(startPoint, points[b])) ? -1 : 1;
      }
      return (o == 2) ? -1 : 1;
    });

    this.stack.push(startPoint);
  }
}
```

Sorting can be done via any of the `O(n log n)` algorithms like quicksort.

#### **Step3:** Scan the points for left turns

Let us create a stack to keep the points which will make the hull. First we push bottom most Point P and the next two points from sorted points into the stack.

<div style="text-align:center">
  <img src="/assets/images/2021-06/graham-hull-start.png" alt="Graham Scan Hull Init"></img>
</div>
<br>

Now we will iterate through rest of the points and check wether we will add it in the stack or not. The check is as follows:

- Calculate the orientation of ordered pair of last two points in stack and current point in consideration.
- If orientation is:
  - *Anticlockwise* i.e we took a left turn reaching this point, we consider it part of hull and add it in stack
  - *Collinear* discard the current point
  - *Clockwise* i.e we took a right turn to reach this point, we will temporarily keep this point. But we will keep removing previous points unless new point makes a left turn with last two points.
- The points on stack will form a convex hull.

<div style="text-align:center">
  <img src="/assets/images/2021-06/graham-hull-left.png" alt="Graham Scan Hull Left Turn"></img>
</div>
<br>

Consider the above image, On checking point 3, we see that we took a left turn to reach it with respect to last two points i.e 1 and 2. Hence we will add three 3 in the stack and consider it as part of hull for now.

<div style="text-align:center">
  <img src="/assets/images/2021-06/graham-hull-right.png" alt="Graham Scan Hull Right Turn"></img>
</div>
<br>

For the next point 4, we see that we have to take a right turn to reach it. Hence we will temporarily keep point 4 and pop previous point i.e 3 and check if point 2 and 4 make a left turn. If yes we will take out 3 and consider 4 as part of hull [as seen in below image].

<div style="text-align:center">
  <img src="/assets/images/2021-06/graham-hull-right-pop.png" alt="Graham Scan Hull Pop"></img>
</div>
<br>


Well here is the code for final step:
```js

class GrahamScan {
  ...

  function scan() {
    // push first and second point
    this.stack.push(this.sortedPoints[0]);
    this.stack.push(this.sortedPoints[1]);

    for (let i = 2; i < this.sortedPoints.length; i++) {
      // Keep removing top while the angle formed by points
      // next-to-top, top, and sortedPoints[i] makes a non-left turn
      let stackLength = this.stack.length;
      while (this.orientation(this.stack[stackLength - 2], this.stack[stackLength - 1], this.sortedPoints[i]) != 2) {
        this.stack.pop();
      }
      this.stack.push(this.sortedPoints[i]);
    }
  }
}
```

Well it might look like complexity for this step is `O(n^2)` because for adding each new point we might iterate back the whole loop. But when encountering the right turn, previous point is removed and doesn't get considered for iterating back for a future point. It means each point would only be considered at-most twice. So complexity of this step would actually be `O(n)`.

Hence the final complexity of this algorithm will be `O(n log n)` with sorting taking the most time.

That's all folks, hope this makes sense.


### References

1. [Wikipedia](https://en.wikipedia.org/wiki/Graham_scan)
