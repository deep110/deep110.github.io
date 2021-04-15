let canvas;
let context;
let lsystem;

var labels = {
  "context_free": "Context Free Deterministic Grammar",
  "context_sensitive": "Context Sensitive Grammar",
  "stochastic": "Stochastic Grammar"
}

var systems = {
  "context_free": {
    "system1": {
      "axiom": "F",
      "axiomAngle": 25,
      "startLength": 200,
      "lengthMul": 0.5,
      "startPositionY": 0.5,
      "type": 0,
      "rules": [
        {
          "a": 'F',
          "b": 'FF+[+F-F-F]-[-F+F+F]'
        },
      ]
    },
    "system2": {
      "axiom": "X",
      "axiomAngle": 25,
      "startLength": 200,
      "lengthMul": 0.5,
      "startPositionY": 0.5,
      "type": 0,
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
    "system3": {
      "axiom": "X",
      "axiomAngle": 25,
      "startLength": 200,
      "lengthMul": 0.53,
      "startPositionY": 0.3,
      "type": 0,
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
    "system4": {
      "axiom": "X",
      "axiomAngle": 22,
      "startLength": 200,
      "lengthMul": 0.53,
      "startPositionY": 0.4,
      "type": 0,
      "rules": [
        {
          "a": 'X',
          "b": 'F-[[X]+X]+F[+FX]-X'
        },
        {
          "a": 'F',
          "b": 'FF'
        }
      ]
    }
  },
  "context_sensitive": {
    "system1": {
      "axiom": "FYFYFY",
      "axiomAngle": 30,
      "startLength": 100,
      "lengthMul": 0.85,
      "startPositionY": 0.5,
      "ignore": "\\+|-|F",
      "type": 1,
      "rules": [
        {
          "a": 'F < F',
          "b": 'F'
        }
      ]
    }
  },
  "stochastic": {
    "system1": {
      "axiom": "F",
      "axiomAngle": 25,
      "startLength": 200,
      "lengthMul": 0.5,
      "startPositionY": 0.5,
      "type": 2,
      "rules": [
        {
          "a": 'F',
          "b": 'FF+[+F-F-F]-[-F+F+F]'
        },
      ]
    }
  }
}

class Turtle {
  constructor(axiomAngle, startPosY, startLength) {
    this.axiomAngle = axiomAngle;
    this.length = startLength;
    this.startPosY = startPosY;
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
      this.stack.push({ "positionX": this.position.x, "positionY": this.position.y, "angle": this.angle });
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

  reset(axiomAngle, posY, startLength) {
    this.resetPosition();
    this.axiomAngle = axiomAngle * 0.01745;
    this.startPosY = posY;
    this.length = startLength;
  }
}

class LSystem2 {
  constructor(axiom, type, rules, ignoredSymbols) {
    this.axiom = axiom;
    this.type = type;
    this.rules = rules;
    this.ignoredSymbols = ignoredSymbols;
    this.ignoreSymbolRegex = new RegExp(ignoredSymbols, "g");
    this.code = axiom;
  }

  iterate() {
    console.log("curr code: ", this.code);
    var nextSentence = '';
    for (var i = 0; i < this.code.length; i++) {
      var current = this.code.charAt(i);

      switch (this.type) {
        case 0:
          nextSentence += this.matchForContextFree(current, this.rules);
          break;
        case 1:
          nextSentence += this.matchForContextSensitive(i, this.code, this.rules, this.ignoreSymbolRegex);
          break;
      }
    }

    this.code = nextSentence;
    // this.code = lsystemT.iterate();

    console.log( "next code: ", this.code)
    // console.log( "truth    : ", lsystemT.iterate())
    console.log("--------------------------")
    return this.code;
  }

  getString() {
    return this.code;
  }

  matchForContextFree(codeChar, rules) {
    for (var j = 0; j < rules.length; j++) {
      if (codeChar == rules[j].a) {
        return rules[j].b;
      }
    }
    return codeChar;
  }
  
  matchForContextSensitive(index, code, rules, ignoreStringReg) {
    var pre = code.substring(0, index).replace(ignoreStringReg, '')
    var post = code.substring(index+1, code.length).replace(ignoreStringReg, '')
  
    // console.log( "pre: ", pre)
    // console.log( "post: ", post)
  
    return code[index]
  }

  reset() {
    this.code = this.axiom;
  }
}

function render(code) {
  turtle.resetPosition();
  turtle.length *= currentSystem.lengthMul;
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  for (var i = 0; i < code.length; i++) {
    turtle.draw(context, code.charAt(i));
  }
  context.strokeStyle = "#FFFFFF80";
  context.stroke();
}

function setupInteractiveSystem() {
  let select = document.getElementById("system-selector");
  for (const sys_name in systems) {
    var optGrp = document.createElement("optgroup");
    optGrp.label = labels[sys_name]
    optGrp.id = sys_name
    for (const ex in systems[sys_name]) {
      var option = document.createElement("option");
      option.value = ex;
      option.text = ex;
      optGrp.appendChild(option);
    }
    select.appendChild(optGrp);
  }
  fillDescription(currentSystem);

  select.addEventListener("change", () => {
	  var optgroupId = select.options[select.selectedIndex].parentNode.id;
    currentSystem = systems[optgroupId][select.value]

    fillDescription(currentSystem);
    lsystem = new LSystem2(
      currentSystem.axiom,
      currentSystem.type,
      currentSystem.rules,
      currentSystem.ignore,
    );
    turtle.reset(currentSystem.axiomAngle, currentSystem.startPositionY, currentSystem.startLength);
    render(lsystem.getString());

  }, false);
}

function fillDescription(cs) {
  document.getElementById("desc-axiom").innerHTML = "Axiom: " + cs["axiom"]
  document.getElementById("desc-angle").innerHTML = "Angle: " + cs["axiomAngle"]

  var ruleStr = "Rules: "
  var rules = cs["rules"]
  for (let i=0; i < rules.length; i++) {
    ruleStr += "<br>" + rules[i]["a"] + " -> " + rules[i]["b"]
  }

  document.getElementById("desc-rules").innerHTML = ruleStr
}

window.addEventListener('DOMContentLoaded', (_) => {
  // setup
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  currentSystem = systems["context_sensitive"]["system1"];

  turtle = new Turtle(currentSystem.axiomAngle, currentSystem.startPositionY, currentSystem.startLength);
  lsystem = new LSystem2(
    currentSystem.axiom,
    currentSystem.type,
    currentSystem.rules,
    currentSystem.ignore,
  );

  setupInteractiveSystem();

  lsystemT = new LSystem({
    axiom: "FYFYFY",
    productions: {
      "X<X>X": "Y",
      "X<X>Y": "Y[-FYFY]",
      "X<Y>X": "Y",
      "X<Y>Y": "Y",
      "Y<X>X": "X",
      "Y<X>Y": "YFY",
      "Y<Y>X": "X",
      "Y<Y>Y": "X",
      "+": "-",
      "-": "+",
    },
    "ignoredSymbols": "+-F&^/|\\"
  })

  // lsystemT.iterate(4)

  document.getElementById("generate").addEventListener("click", function() {
    // generate next iteration
    var code = lsystem.iterate();

    // render the next generated iteration
    render(code);
  });

  document.getElementById("reset").addEventListener("click", function() {
    turtle.reset(currentSystem.axiomAngle, currentSystem.startPositionY, currentSystem.startLength);
    lsystem.reset();
    render(lsystem.getString());
  });
});
