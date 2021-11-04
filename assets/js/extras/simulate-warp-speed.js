const NUM_STARS = 300;
const PI2 = 2 * Math.PI;
let SPEED = 60;

function map(value, low1, high1, low2, high2) {
    return low2 + (value - low1) * (high2 - low2) / (high1 - low1)
}

class Star {
    constructor() {
        this.x = MathUtil.random(-1000, 1000);
        this.y = MathUtil.random(-1000, 1000);
        this.z = MathUtil.random(100, 1000);
        this.pz = this.z;
    }

    update() {
        this.z = this.z-SPEED
        if (this.z < 1) {
            this.x = MathUtil.random(-1000, 1000);
            this.y = MathUtil.random(-1000, 1000);
            this.z = MathUtil.random(100, 1000);
            this.pz = this.z;
        }
    }

    draw(ctx) {
        ctx.beginPath();

        let sx = map(this.x/this.z, -1, 1, 0, canvas.width);
        let sy = map(this.y/this.z, -1, 1, 0, canvas.height);
        let r = map(this.z, 100, 1000, MathUtil.random(2, 5), 1);

        ctx.fillStyle = "#FFF";
        ctx.arc(sx, sy, r, 0, PI2);
        ctx.fill();

        ctx.beginPath();
        let spx = map(this.x/this.pz, -1, 1, 0, canvas.width);
        let spy = map(this.y/this.pz, -1, 1, 0, canvas.height);

        ctx.moveTo(spx, spy);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = "#FFFFFFF0";
        ctx.lineWidth = 2;
        ctx.stroke();

        this.pz = this.z;
    }

}

window.addEventListener('DOMContentLoaded', (_) => {
    document.getElementById("icon-play").addEventListener("click", (_) => {
        document.getElementById("overlay").remove()
        setup();
    });
});

let canvas;
let context;
let stars = [];

function setup() {
    canvas = document.getElementById("myCanvas");

    // set canvas width and height
    canvasContainer = document.getElementById("canvas-container");
    canvas.width = canvasContainer.offsetWidth
    canvas.height = canvasContainer.offsetHeight

    context = canvas.getContext("2d");

    var slider = document.getElementById("myRange");
    slider.value = SPEED;
    slider.oninput = function() {
        SPEED = this.value;
    }

    for (let i=0; i < NUM_STARS; i++) {
        stars[i] = new Star();
    }

    GameLoopController.loop(draw, 60);
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i=0; i < stars.length; i++) {
        stars[i].update();
        stars[i].draw(context);
    }
}
