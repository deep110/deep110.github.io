const PI2 = 2 * Math.PI;

var points = [];
var pInitialIndex = null;
var pSelect = null;
var hull = [];

let canvas;
let context;
let stayCounter = 0;

function distSq(p1, p2) {
  return p2.subtract(p1).distanceSqr();
}

// To find orientation of ordered triplet (p, q, r). 
// The function returns following values 
// 0 --> p, q and r are colinear 
// 1 --> Clockwise 
// 2 --> Counterclockwise 
function getOrientation(p, q, r) {
  let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  val = Math.trunc(val);

  if (val == 0) return 0;  // colinear 
  return (val > 0) ? 1 : 2; // clock or counter-clock wise 
}

function partialSort(arr, start, end, sortF) {
  var preSorted = arr.slice(0, start), postSorted = arr.slice(end);
  var sorted = arr.slice(start, end).sort(sortF);
  arr.length = 0;
  arr.push.apply(arr, preSorted.concat(sorted).concat(postSorted));
  return arr;
}

function* GrahamScan() {
  var pointsSorted = new Array(points.length).fill(-1);

  // Step1
  // find the bottom most point
  pInitialIndex = 0;
  for (let i = 1; i < points.length; i++) {
    let pTry = points[i];
    if (pTry.y < points[pInitialIndex].y || (pTry.y == points[pInitialIndex].y && pTry.x < points[pInitialIndex].x)) {
      pointsSorted[i] = pInitialIndex;
      pInitialIndex = i;
    } else {
      pointsSorted[i] = i;
    }
  }
  pointsSorted[0] = pInitialIndex;
  yield 1;

  // Step2
  // Arrange the points in increasing order of angle with x axis relative to bottom most point
  partialSort(pointsSorted, 1, pointsSorted.length, (a, b) => {
    let o = getOrientation(points[pInitialIndex], points[a], points[b]);
    if (o == 0) {
      return (distSq(points[pInitialIndex], points[b]) >= distSq(points[pInitialIndex], points[b])) ? -1 : 1;
    }
    return (o == 2) ? -1 : 1;
  })

  // loop just to show the order
  for (var i = 1; i < pointsSorted.length; i++) {
    pSelect = points[pointsSorted[i]];
    yield 2;
  }

  // Step 3
  // Remove two or more points which make same angle with initial index
  let m = 1; // Initialize size of modified array
  for (let i = 1; i < points.length; i++) {
    // Keep removing i while angle of i and i+1 is same with respect to p0
    while (i < points.length - 1 && getOrientation(points[pInitialIndex], points[pointsSorted[i]], points[pointsSorted[i + 1]]) == 0) {
      i++;
    }
    pointsSorted[m] = pointsSorted[i];
    m++;  // Update size of modified array 
  }
  if (m < 4) return;

  // Step 4
  // Now iterate over sorted array and only add anti-clock wise angles to final hull
  hull.push(pointsSorted[0]);
  hull.push(pointsSorted[1]);
  hull.push(pointsSorted[2]);

  for (let i = 3; i < m; i++) {
    // Keep removing top while the angle formed by 
    // points next-to-top, top, and points[i] makes 
    // a non-left turn 
    while (getOrientation(points[hull[hull.length - 2]], points[hull[hull.length - 1]], points[pointsSorted[i]]) != 2) {
      hull.pop();
    }
    hull.push(pointsSorted[i]);
    yield 3;
  }
}

window.addEventListener('DOMContentLoaded', (_) => {
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");

  setup();
  GameLoopController.loop(draw, 10);
});

function setup() {
  gs = GrahamScan();
  points = [];
  pInitialIndex = null;
  pSelect = null;
  hull = [];
  stayCounter = 0;

  let buffer = 20;
  for (let i = 0; i < 30; i++) {
    points.push(new Vector2(
      Math.random() * (canvas.width - buffer),
      Math.random() * (canvas.height - buffer),
    ));
  }

}

function draw(dt) {
  context.clearRect(0, 0, canvas.width, canvas.height);

  drawPoints(context);

  var result = gs.next();
  var value = result.value;
  if (result.done) value = 4;

  // draw a red circle on start point
  if (value >= 1) {
    context.beginPath();

    context.strokeStyle = "#FF0000";
    context.lineWidth = 5;
    context.arc(points[pInitialIndex].x, points[pInitialIndex].y, 10, 0, PI2);
    context.stroke();
  }

  // show the result of the sort
  if (value == 2) {
    context.beginPath();
    context.strokeStyle = "#0000FF";
    context.lineWidth = 3;
    context.moveTo(points[pInitialIndex].x, points[pInitialIndex].y);
    context.lineTo(pSelect.x, pSelect.y);
    context.stroke();

    context.beginPath();
    context.strokeStyle = "#0000FF";
    context.lineWidth = 4;
    context.arc(pSelect.x, pSelect.y, 10, 0, PI2);
    context.stroke();
  }

  if (value >= 3) {
    context.beginPath();
    context.strokeStyle = "#00FF00";
    context.lineWidth = 3;

    for (let i = 0; i < hull.length - 1; i++) {
      var curr = points[hull[i]]
      var next = points[hull[i + 1]]
      context.moveTo(curr.x, curr.y);
      context.lineTo(next.x, next.y);
    }

    // complete the loop from last point to first point
    if (value == 4) {
      context.moveTo(points[hull[hull.length - 1]].x, points[hull[hull.length - 1]].y);
      context.lineTo(points[hull[0]].x, points[hull[0]].y);
    }

    context.stroke();
  }

  if (value == 3) {
    context.beginPath();
    context.strokeStyle = "#0000FF";
    context.lineWidth = 3;

    var pBeforeLast = points[hull[hull.length - 2]];
    var pLast = points[hull[hull.length - 1]];

    context.moveTo(pBeforeLast.x, pBeforeLast.y);
    context.lineTo(pLast.x, pLast.y);

    context.moveTo(pLast.x, pLast.y);
    context.lineTo(pSelect.x, pSelect.y);
    context.stroke();
  }

  if (value == 4) {
    // restart simulation again after 1 sec
    stayCounter += dt
    if (stayCounter > 1000) {
      setup();
    }
  }
}

function drawPoints(ctx) {
  ctx.beginPath();

  ctx.fillStyle = "#FFFFFFA0";
  for (let i = 0; i < points.length; i++) {
    ctx.moveTo(points[i].x, points[i].y);
    ctx.arc(points[i].x, points[i].y, 4, 0, PI2);
  }
  ctx.fill();
}
