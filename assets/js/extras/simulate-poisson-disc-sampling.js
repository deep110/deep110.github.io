let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

let radius = 10;
let maxTryLimit = 10; // k in paper
let cellSize, radiusSqr, numColumns, numRows;
let grid;
let activeList = [];

setup(canvas.width / 2, canvas.height / 2);
GameLoopController.loop(generate, 50);

var radiusSlider = document.getElementById("myRadius");
radiusSlider.value = radius;
radiusSlider.oninput = function () {
	radius = parseInt(this.value, 10);
	setup(canvas.width / 2, canvas.height / 2);
}

var kSlider = document.getElementById("myMaxTries");
kSlider.value = maxTryLimit;
kSlider.oninput = function () {
	maxTryLimit = parseInt(this.value, 10);
	setup(canvas.width / 2, canvas.height / 2);
}

canvas.addEventListener('click', function (event) {
	var x = event.pageX - canvas.offsetLeft,
		y = event.pageY - canvas.offsetTop;

	setup(x, y);
}, false);

function setup(xStart, yStart) {
	radiusSqr = radius * radius;
	cellSize = radius * Math.SQRT1_2;
	numColumns = Math.floor(canvas.width / cellSize);
	numRows = Math.floor(canvas.height / cellSize);
	grid = new Array(numColumns * numRows);
	grid.fill(undefined);
	activeList.length = 0;

	var startPoint = new Vector2(xStart, yStart);
	var [si, sj] = toGrid(startPoint);
	grid[sj + si * numColumns] = startPoint;
	activeList.push(startPoint);
}

function generate() {
	if (activeList.length < 1) {
		return
	}
	var pointsPerFrame = 60
	if (radius < 10) {
		pointsPerFrame = 80
	}
	if (radius > 15) {
		pointsPerFrame = 35
	}
	// generate n points per frame
	for (let i = 0; i < pointsPerFrame; i++) {
		generatePoint();
	}

	context.clearRect(0, 0, canvas.width, canvas.height);

	// draw all points
	context.beginPath();
	context.fillStyle = "#FFFFFFA0";
	for (let i = 0; i < grid.length; i++) {
		if (grid[i]) {
			context.moveTo(grid[i].x, grid[i].y);
			context.arc(grid[i].x, grid[i].y, 2, 0, MathUtil.PI2);
		}
	}
	context.fill();

	// draw active list
	context.beginPath();
	context.fillStyle = "#FF00FFA0";
	activeList.forEach(point => {
		context.moveTo(point.x, point.y);
		context.arc(point.x, point.y, 3, 0, MathUtil.PI2);
	});
	context.fill();
}

function generatePoint() {
	if (activeList.length < 1) {
		return
	}
	let index = MathUtil.randomInt(0, activeList.length);
	let activePoint = activeList[index];
	let sampleFound = false;

	for (let n = 0; n < maxTryLimit; n++) {
		// generate a random 2d point between r and 2r radius from active point
		let sample = Vector2.random();
		let randomDistance = MathUtil.randomInt(radius, 2 * radius);
		sample.iscale(randomDistance);
		sample.iadd(activePoint);

		let [sampleGridI, sampleGridJ] = toGrid(sample);
		let sampleGridIndex = sampleGridJ + sampleGridI * numColumns;

		// before proceeding check if sample lies inside our boundary and no sample already
		// exists in the grid in that position
		if (sampleGridI < 0 || sampleGridJ < 0 || sampleGridI > numRows || sampleGridJ > numColumns || grid[sampleGridIndex]) {
			continue;
		}

		let sampleOk = true;
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				let checkingIndex = (sampleGridJ + j) + (sampleGridI + i) * numColumns;
				if (grid[checkingIndex]) {
					let distanceSqr = sample.distanceSqr(grid[checkingIndex]);
					if (distanceSqr < radiusSqr) {
						sampleOk = false;
						break;
					}
				}
			}
		}
		if (sampleOk) {
			sampleFound = true;
			grid[sampleGridIndex] = sample;
			activeList.push(sample);
			break;
		}
	}
	if (!sampleFound) {
		activeList.splice(index, 1);
	}
}

function toGrid(v) {
	return [Math.floor(v.y / cellSize), Math.floor(v.x / cellSize)];
}
