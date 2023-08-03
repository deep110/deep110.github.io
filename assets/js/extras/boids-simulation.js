const canvas = document.getElementById("canvas");
const DEFAULT_WIDTH = canvas.clientWidth;
const DEFAULT_HEIGHT = canvas.clientHeight;

const BOID_TEXTURE = new PIXI.Texture(PIXI.BaseTexture.from('/assets/images/2023-08/boid.png'));
const BOID_SPEED = 4;

const gui = new lil.GUI({ container: document.getElementById("settings") });
const guiController = {
    "PerceptionRadius": 100,
    "Alignment": 0.5,
    "Cohesion": 0.4,
    "Separation": 0.5,
};

let isFullScreen = false;
let isSeeking = false;
let mousePosition = new Vector2();
let flock = [];

let perceptionRadiusSquared = guiController["PerceptionRadius"] * guiController["PerceptionRadius"];
let alignmentForce = guiController["Alignment"];
let cohesionForce = guiController["Cohesion"];
let separationForce = guiController["Separation"];


class Boid {
    constructor(x, y, turnAngle) {
        this.position = new Vector2(x, y);
        this.rotation = MathUtil.toRadian(-turnAngle);
        this.velocity = new Vector2(Math.cos(this.rotation), Math.sin(this.rotation)).iscale(BOID_SPEED);
        this.acceleration = new Vector2();
        this.maxForce = 0.4;

        // setup for sprite
        this.sprite = new PIXI.Sprite(BOID_TEXTURE);
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(0.5);
        // this.sprite.alpha = MathUtil.randomFloat(0.6, 0.9);
    }

    handleEdge() {
        if (this.position.x > canvas.width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = canvas.width;
        }
        
        if (this.position.y > canvas.height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = canvas.height;
        }
    }

    move(dt) {
        this.velocity.iadd(this.acceleration);

        // limit the velocity to max speed
        this.velocity.setMagnitude(BOID_SPEED);

        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;

        this.handleEdge();
        this.rotation = Math.atan2(this.velocity.y, this.velocity.x);

        // reset acceleration
        this.acceleration.set(0, 0);
    }

    alignment(flock) {
        let steering = new Vector2();
        let total = 0;
        for (let i = 0; i < flock.length; i++) {
            let boidOther = flock[i];
            if (boidOther != this && this.position.distanceSqr(boidOther.position) < perceptionRadiusSquared) {
                steering.iadd(boidOther.velocity);
                total += 1;
            }
        }
        if (total > 0) {
            steering.iscale(1/total);
            steering.setMagnitude(BOID_SPEED);
            steering.isub(this.velocity).limit(this.maxForce);
        }

        // apply the steering force as acceleration
        this.acceleration.iadd(steering.iscale(alignmentForce));
    }

    cohesion(flock) {
        let steering = new Vector2();
        let total = 0;
        for (let i = 0; i < flock.length; i++) {
            let boidOther = flock[i];
            if (boidOther != this && this.position.distanceSqr(boidOther.position) < perceptionRadiusSquared) {
                steering.iadd(boidOther.position);
                total += 1;
            }
        }
        if (total > 0) {
            steering.iscale(1/total);
            steering.isub(this.position); // desired velocity

            steering.setMagnitude(BOID_SPEED);
            steering.isub(this.velocity).limit(this.maxForce);
        }

        // apply the steering force as acceleration
        this.acceleration.iadd(steering.iscale(cohesionForce));
    }

    separation(flock) {
        let steering = new Vector2();
        let total = 0;
        for (let i = 0; i < flock.length; i++) {
            let boidOther = flock[i];
            let distanceSqr = this.position.distanceSqr(boidOther.position);
            if (boidOther != this && distanceSqr < perceptionRadiusSquared) {
                let diff = this.position.sub(boidOther.position);
                diff.iscale(1/distanceSqr);
                steering.iadd(diff);
                total += 1;
            }
        }
        if (total > 0) {
            steering.iscale(1/total);
            steering.setMagnitude(BOID_SPEED);
            steering.isub(this.velocity).limit(this.maxForce);
        }

        // apply the steering force as acceleration
        this.acceleration.iadd(steering.iscale(separationForce));
    }

    seek(target) {
        let steering = target.sub(this.position);
        steering.setMag(BOID_SPEED);
        steering.isub(this.velocity).limit(this.maxForce);

        return steering;
    }

    render() {
        this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;
        this.sprite.rotation = this.rotation;
    }
}


function update(dt) {
    // console.log("update called: ", dt);

    for (let i = 0; i < flock.length; i++) {
        flock[i].alignment(flock);
        flock[i].cohesion(flock);
        flock[i].separation(flock);
    }

    for (let i = 0; i < flock.length; i++) {
        flock[i].move(dt);
    }
    for (let i = 0; i < flock.length; i++) {
        flock[i].render();
    }
}

function setupGUI() {
    gui.add(guiController, "PerceptionRadius", 10, 500, 10).onChange(value => {
        perceptionRadiusSquared = value * value;
    });
    gui.add(guiController, "Alignment", 0, 1, 0.05).onChange(value => {
        alignmentForce = value;
    });
    gui.add(guiController, "Cohesion", 0, 1, 0.05).onChange(value => {
        cohesionForce = value;
    });
    gui.add(guiController, "Separation", 0, 1, 0.05).onChange(value => {
        separationForce = value;
    });
}


let app = new PIXI.Application({
    view: canvas,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    backgroundColor: 0x3a3a3a,
});
app.ticker.add(update);
app.ticker.maxFPS = 60;

const toggleBtn = document.getElementById("toggle-fs");
toggleBtn.addEventListener("click", () => {
    canvas.classList.toggle("fullscreen");
    toggleBtn.classList.toggle("fullscreen");
    document.getElementById("settings").classList.toggle("fullscreen");
    isFullScreen = !isFullScreen;

    // also correct drawing buffer size
    if (isFullScreen) {
        toggleBtn.children[1].setAttribute("transform", "translate(16,16)rotate(135)scale(5)translate(-1.85,0)");
        app.renderer.resize(canvas.clientWidth, canvas.clientHeight);
    } else {
        toggleBtn.children[1].setAttribute("transform", "translate(16,16)rotate(-45)scale(5)translate(-1.85,0)");
        app.renderer.resize(DEFAULT_WIDTH, DEFAULT_HEIGHT);
    }
});
setupGUI();

canvas.addEventListener('mousedown', (event) => {
    // const position = event.data.global;
    // console.log('Mouse Down:', position.x, position.y);
    console.log(event.offsetX, event.offsetY)
});


// setup flock
const flockContainer = new PIXI.Container();
for (let i = 0; i < 200; i++) {
    let x = MathUtil.randomInt(0, canvas.width);
    let y = MathUtil.randomInt(0, canvas.height);
    let angle = MathUtil.randomInt(0, 360);

    let b = new Boid(x, y, angle);
    flockContainer.addChild(b.sprite);

    flock.push(b);
}
app.stage.addChild(flockContainer);
