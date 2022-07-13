let canvasCircle = document.getElementById("canvas-circle");
let canvasShape = document.getElementById("canvas-shape");
let ctxCircle = canvasCircle.getContext("2d");
let ctxShape = canvasShape.getContext("2d");

const WIDTH_2 = canvasCircle.width / 2;
const HEIGHT_2 = canvasCircle.height / 2;

let system;
let gui;

class Circle {
    constructor(center, radius, rotateSpeed, color = "#ffffff") {
        this.x = center.x;
        this.y = center.y;
        this.radius = radius;
        this.rotateSpeed = rotateSpeed;
        this.color = color;
        this.angle = MathUtil.toRadian(90);
    }

    rotate(parent) {
        this.angle += this.rotateSpeed;

        this.x = parent.x + (parent.radius + this.radius) * Math.cos(this.angle);
        this.y = parent.y + (parent.radius + this.radius) * Math.sin(this.angle);
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, MathUtil.PI2);
        ctx.strokeStyle = this.color;
        ctx.stroke();

        // ctx.fillStyle = this.color;
        // ctx.fillRect(this.x - 1, this.y - 1, 2, 2);
    }
}

class System {
    constructor(numCircles, radiusRatio, k, speedFalloff) {
        this.circles = [];
        this.prevPoint = new Vector2();

        this.reset(numCircles, radiusRatio, k, speedFalloff);
    }

    reset(numCircles, radiusRatio, k, speedFalloff) {
        let radiusStart = 140;
        let circleColor = "#ffffff50";
        this.circles = [];
        this.numCircles = numCircles;

        // add root circle
        let root = new Circle(new Vector2(0, 0), radiusStart, 0, circleColor);
        this.circles.push(root);

        for (let i = 1; i < this.numCircles; i++) {
            let prevCircle = this.circles[i - 1];

            let nextRadius = prevCircle.radius / radiusRatio;
            let nextY = prevCircle.y + prevCircle.radius + nextRadius;
            let fallOff = 1;
            for (var j = 0; j < speedFalloff; j++) {
                fallOff *= k;
            }

            let next = new Circle(new Vector2(0, nextY), nextRadius, Math.pow(k, i - 1) / fallOff, circleColor);
            this.circles.push(next);
        }

        this.prevPoint.set(0, 0);
    }

    update() {
        this.prevPoint.set(this.circles[this.numCircles - 1].x, this.circles[this.numCircles - 1].y);

        for (let i = 1; i < this.numCircles; i++) {
            this.circles[i].rotate(this.circles[i - 1]);
        }
    }

    renderCircle(ctx) {
        ctx.clearRect(-WIDTH_2, -HEIGHT_2, canvasCircle.width, canvasCircle.height);

        for (let i = 0; i < this.numCircles; i++) {
            this.circles[i].draw(ctx);
        }
    }

    renderShape(ctx, saturation) {
        let circleEnd = this.circles[this.numCircles - 1];
        ctx.strokeStyle = "hsl(" + MathUtil.toDegree(this.circles[1].angle) + "," + saturation + "%,50%)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.prevPoint.x, this.prevPoint.y);
        ctx.lineTo(circleEnd.x, circleEnd.y);
        ctx.stroke();
    }
}

function setup() {
    setCenterOrigin();

    gui = new lil.GUI();
    guiController = {
        "StopSimulation": false,
        "SimulationSpeed": 25,
        "NumCircles": 10,
        "RadiusFallOff": 3,
        "RotationSpeed": -8,
        "SpeedFallOff": 4,
        "ColorSaturation": 50,
    };
    system = new System(
        guiController["NumCircles"], guiController["RadiusFallOff"], guiController["RotationSpeed"],
        guiController["SpeedFallOff"]
    );

    setupGUI();
    GameLoopController.loop(update, 30);
}

function setCenterOrigin() {
    ctxCircle.translate(canvasCircle.width / 2, canvasCircle.height / 2);
    ctxCircle.scale(1, -1);

    ctxShape.translate(canvasShape.width / 2, canvasShape.height / 2);
    ctxShape.scale(1, -1);
}

function setupGUI() {
    gui.add(this.guiController, "StopSimulation").onChange(value => {
        if (value) {
            GameLoopController.stop();
        } else {
            GameLoopController.loop(update, 30);
        }
    });
    gui.add(this.guiController, "SimulationSpeed", 1, 40, 1);
    gui.add(this.guiController, "ColorSaturation", 0, 100, 1).onFinishChange(val => {
        system.reset(guiController["NumCircles"], guiController["RadiusFallOff"], guiController["RotationSpeed"], guiController["SpeedFallOff"]);
        ctxShape.clearRect(-WIDTH_2, -HEIGHT_2, canvasShape.width, canvasShape.height);
    });

    const systemGUI = gui.addFolder("System");
    systemGUI.add(this.guiController, "NumCircles", 3, 30, 1);
    systemGUI.add(this.guiController, "RadiusFallOff", 2, 6, 1);
    systemGUI.add(this.guiController, "RotationSpeed", -10, 10, 1);
    systemGUI.add(this.guiController, "SpeedFallOff", 2, 5, 1);
    systemGUI.onFinishChange(() => {
        system.reset(guiController["NumCircles"], guiController["RadiusFallOff"], guiController["RotationSpeed"], guiController["SpeedFallOff"]);
        ctxShape.clearRect(-WIDTH_2, -HEIGHT_2, canvasShape.width, canvasShape.height);
    });
}

function update() {
    for (var i = 0; i < guiController["SimulationSpeed"]; i++) {
        system.update();
        if (i % 3 == 0) {
            system.renderCircle(ctxCircle);
        }
        system.renderShape(ctxShape, guiController["ColorSaturation"]);
    }
}

setup();
