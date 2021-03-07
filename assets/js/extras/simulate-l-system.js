let canvas;
let context;
var currentSystem;
var sentence;

var systems = {
  "tree": {
    "axiom": "F",
    "axiomAngle": 25,
    "lengthMul": 0.5,
    "startPositionY": 0.5,
    "rules": [
      {
        "a": 'F',
        "b": 'FF+[+F-F-F]-[-F+F+F]'
      },
    ]
  },
  "tree1": {
    "axiom": "X",
    "axiomAngle": 25,
    "lengthMul": 0.5,
    "startPositionY": 0.5,
    "rules": [
      {
        "a": 'F',
        "b": 'FF'
      },
      {
        "a": 'X',
        "b": 'F+[-F-XF-X][+FF][--XF[+X]][++F-X]'
      },
    ]
  },
  "tree2": {
    "axiom": "X",
    "axiomAngle": 25,
    "lengthMul": 0.55,
    "startPositionY": 0.3,
    "rules": [
      {
        "a": 'F',
        "b": 'FX[FX[+XF]]'
      },
      {
        "a": 'X',
        "b": 'FF[+XZ++X-F[+ZX]][-X++F-X]'
      },
      {
        "a": 'Z',
        "b": '[+F-X-F][++ZX]'
      }
    ]
  },
  "tree3": {
    "axiom": "X",
    "axiomAngle": 33,
    "lengthMul": 0.5,
    "startPositionY": 0.5,
    "rules": [
      {
        "a": 'XF',
        "b": 'XXF'
      },
      {
        "a": 'XX',
        "b": 'XXX'
      }
    ]
  }
}

class Turtle {
  constructor() {
    this.axiomAngle = 0;
    this.length = 100;
    this.startPosY = 0;
    this.position = new Vector2(0, 0);
    this.stack = [];
    this.resetPosition();
  }

  draw(ctx, char) {
    if (char == 'F') {
      let newX = this.position.x + this.length * Math.cos(this.angle);
      let newY = this.position.y + this.length * Math.sin(this.angle);

      ctx.moveTo(this.position.x, this.cartToScreen(this.position.y));
      ctx.lineTo(newX, this.cartToScreen(newY));
      this.position.set(newX, newY);
    } else if (char == '+') {
      this.angle -= this.axiomAngle;
    } else if (char == '-') {
      this.angle += this.axiomAngle;
    } else if (char == '[') {
      this.stack.push({"positionX": this.position.x, "positionY": this.position.y, "angle": this.angle});
    } else if (char == ']') {
      let val = this.stack.pop();
      this.position.set(val.positionX, val.positionY);
      this.angle = val.angle;
    }
  }

  cartToScreen(py) {
    return -py + canvas.height;
  }

  resetPosition() {
    this.position.set(canvas.width * this.startPosY, 0);
    this.angle = 90 * 0.01745; // 90 degree
    this.stack = [];
  }

  reset(axiomAngle, posY) {
    this.resetPosition();
    this.axiomAngle = axiomAngle * 0.01745;
    this.startPosY = posY;
    this.length = 100;
  }
}

function generate() {
  var rules = currentSystem.rules;
  turtle.length *= currentSystem.lengthMul;
  var nextSentence = '';
  for (var i = 0; i < sentence.length; i++) {
    var current = sentence.charAt(i);
    var found = false;
    for (var j = 0; j < rules.length; j++) {
      if (current == rules[j].a) {
        found = true;
        nextSentence += rules[j].b;
        break;
      }
    }
    if (!found) {
      nextSentence += current;
    }
  }
  sentence = nextSentence;
  render();
}

function reset() {
  sentence = currentSystem.axiom;
  turtle.reset(currentSystem.axiomAngle, currentSystem.startPositionY);
  render();
}

function render() {
  turtle.resetPosition();
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  for (var i = 0; i < sentence.length; i++) {
    turtle.draw(context, sentence.charAt(i));
  }
  context.strokeStyle = "#FFFFFF80";
  context.stroke();
}

window.addEventListener('DOMContentLoaded', (_) => {
  // setup
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");

  setupInteractiveSystem();
  turtle = new Turtle();
  reset();
});

function setupInteractiveSystem() {
  let select = document.getElementById("system-selector");
  for (const sys in systems) {
    var option = document.createElement("option");
    option.value = sys;
    option.text = sys;
    select.appendChild(option);
  }
  currentSystem = systems[select.value];

  select.addEventListener("change", ()=> {
    currentSystem = systems[select.value];
    reset();
  }, false);
}
