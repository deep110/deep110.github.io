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
      "axiom": "X",
      "axiomAngle": 25,
      "startLength": 200,
      "lengthMul": 0.5,
      "startPositionY": 0.5,
      "type": 0,
      "rules": [
        { "a": 'F', "b": 'FF' },
        { "a": 'X', "b": 'F+[-F-XF-X][+FF][--XF[+X]][++F-X]' },
      ]
    },
    "system2": {
      "axiom": "F",
      "axiomAngle": 25,
      "startLength": 200,
      "lengthMul": 0.5,
      "startPositionY": 0.5,
      "type": 0,
      "rules": [
        { "a": 'F', "b": 'FF+[+F-F-F]-[-F+F+F]' },
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
        { "a": 'F', "b": 'FX[FX[+XF]]' },
        { "a": 'X', "b": 'FF[+XZ++X-F[+ZX]][-X++F-X]' },
        { "a": 'Z', "b": '[+F-X-F][++ZX]' }
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
        { "a": 'X', "b": 'F-[[X]+X]+F[+FX]-X' },
        { "a": 'F', "b": 'FF' },
      ]
    }
  },
  "context_sensitive": {
    "system1": {
      "axiom": "FYFXFXFY",
      "axiomAngle": 30,
      "startLength": 100,
      "lengthMul": 0.87,
      "startPositionY": 0.5,
      "ignore": "F+-",
      "type": 1,
      "rules": [
        { "a": 'X < X > X', "b": 'Y' },
        { "a": "X < X > Y", "b": "Y[-FYFY]" },
        { "a": "Y < X > Y", "b": "YFY" },
        { "a": "Y < Y > X", "b": "X" },
        { "a": "Y < Y > Y", "b": "X" },
        { "a": "+", "b": "-" },
        { "a": "-", "b": "+" },
      ]
    },
    "system2": {
      "axiom": "FYFYFYFY",
      "axiomAngle": 23,
      "startLength": 100,
      "lengthMul": 0.88,
      "startPositionY": 0.5,
      "ignore": "F+-",
      "type": 1,
      "rules": [
        { "a": "X < X > Y", "b": "Y[+FYFY]" },
        { "a": "Y < X > Y", "b": "YFY" },
        { "a": "Y < Y > X", "b": "X" },
        { "a": "Y < Y > Y", "b": "X" },
        { "a": "+", "b": "-" },
        { "a": "-", "b": "+" },
      ]
    },
    "system3": {
      "axiom": "FYFYFYFY",
      "axiomAngle": 23,
      "startLength": 100,
      "lengthMul": 0.88,
      "startPositionY": 0.5,
      "ignore": "F+-",
      "type": 1,
      "rules": [
        { "a": "X < X > Y", "b": "Y[-FYFY]" },
        { "a": "Y < X > Y", "b": "YFY" },
        { "a": "Y < Y > Y", "b": "X" },
        { "a": "+", "b": "-" },
        { "a": "-", "b": "+" },
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
          "b": [
            [0.33, "F[+F]F[-F]F"],
            [0.33, "F[+F]F"],
            [0.34, "F[-F]F"],
          ]
        },
      ]
    }
  }
}

class Turtle {
  constructor(axiomAngle, startPosY, startLength) {
    this.axiomAngle = axiomAngle * 0.01745;
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
    this.code = axiom;

    if (type == 1) {
      for (let i=0; i < this.rules.length; i++) {
        let rule = this.rules[i];
        let ruleMod = rule.a.replace(/ /g,'')
        
        let left = ruleMod.match(/(.+)<(.)/);
        let right = ruleMod.match(/(.)>(.+)/);

        if (left == undefined || right == undefined) {
          rule.toMatch = rule.a;
        }

        if (left != undefined) {
          rule.leftCtx = left[1]
          rule.toMatch = left[2]
        }
        if (right != undefined) {
          rule.rightCtx = right[2]
          rule.toMatch = right[1]
        }
      }
    } else if (type == 2) {
      for (var j = 0; j < this.rules.length; j++) {
        let subs = rules[j].b;
        let weightSum = 0;

        if (typeof subs !== "object") {
          continue
        }
  
        for (var k = 0; k < subs.length; k++) {
          weightSum += subs[k][0];
        }
        rules[j].weightSum = weightSum;
      }
    }
  }

  iterate() {
    var nextSentence = '';
    for (var i = 0; i < this.code.length; i++) {
      var current = this.code.charAt(i);

      switch (this.type) {
        case 0:
          nextSentence += this.matchForContextFree(current, this.rules);
          break;
        case 1:
          nextSentence += this.matchForContextSensitive(i, this.code, this.rules);
          break;
        case 2:
          nextSentence += this.matchStochastic(current, this.rules);
      }
    }

    this.code = nextSentence;
    return this.code;
  }

  getString() {
    return this.code;
  }

  matchForContextFree(codeChar, rules) {
    for (var i = 0; i < rules.length; i++) {
      if (codeChar == rules[i].a) {
        return rules[i].b;
      }
    }
    return codeChar;
  }

  matchForContextSensitive(index, code, rules) {
    for (let i=0; i < rules.length; i++) {
      let rule = rules[i];
      if (rule.toMatch == code[index]) {
        if (rule.leftCtx !== undefined && rule.rightCtx !== undefined) {
          if (this.matchContext(code, rule.leftCtx, index-1, 0, this.ignoredSymbols)
               && this.matchContext(code, rule.rightCtx, index+1, code.length-1, this.ignoredSymbols)) {
            return rule.b;
          }
        } else if (rule.leftCtx !== undefined) {
          if (this.matchContext(code, rule.leftCtx, index-1, 0, this.ignoredSymbols)) {
            return rule.b;
          }
        } else if (rule.rightCtx !== undefined) {
          if (this.matchContext(code, rule.rightCtx, index+1, code.length-1, this.ignoredSymbols)) {
            return rule.b;
          }
        } else {
          return rule.b
        }
      }
    }

    return code[index]
  }

  matchStochastic(codeChar, rules) {
    for (var j = 0; j < rules.length; j++) {
      if (codeChar == rules[j].a) {
        let subs = rules[j].b;

        let randomWeight = Math.random() * rules[j].weightSum;
        let cumulativeWeight = 0;
        for (var k = 0; k < subs.length; k++) {
          cumulativeWeight += subs[k][0];
          if (randomWeight <= cumulativeWeight) {
            return subs[k][1];
          }
        }
      }
    }
    return codeChar;
  }

  matchContext(code, toMatch, startIndex, endIndex, ignoredSymbols) {
    let branchCount = 0;
    let explicitBranchCount = 0;
    let matchIndex, matchIndexOverflow;
    let inc, branchStart, branchEnd;

    if (startIndex > endIndex) { // left dir match
      inc = -1
      matchIndex = toMatch.length - 1
      matchIndexOverflow = -1
      branchStart = "]"
      branchEnd = "["
    } else {
      inc = 1
      matchIndex = 0
      matchIndexOverflow = toMatch.length
      branchStart = "["
      branchEnd = "]"
    }
    let codeIndex = startIndex - inc;

    while(codeIndex !== endIndex) {
      codeIndex += inc
      let axiomSymbol = code[codeIndex];
      let matchSymbol = toMatch[matchIndex];

      if (axiomSymbol == matchSymbol) {
        if (branchCount === 0 || explicitBranchCount > 0) {
          // if its a match and previously NOT inside branch (branchCount===0) or in explicitly wanted branch (explicitBranchCount > 0)
          // if a bracket was explicitly stated in match axiom
          if (axiomSymbol === branchStart) {
            explicitBranchCount++;
            branchCount++;
            matchIndex += inc;
          } else if (axiomSymbol === branchEnd) {
            explicitBranchCount = Math.max(0, explicitBranchCount - 1);
            branchCount = Math.max(0, branchCount - 1); // only increase match if we are out of explicit branch

            if (explicitBranchCount === 0) {
              matchIndex += inc;
            }
          } else {
            matchIndex += inc;
          }
        }

        if (matchIndex == matchIndexOverflow) {
          return true;
        }
      } else if (axiomSymbol === branchStart) {
        branchCount++;
        if (explicitBranchCount > 0) explicitBranchCount++;
      } else if (axiomSymbol === branchEnd) {
        branchCount = Math.max(0, branchCount - 1);
        if (explicitBranchCount > 0) explicitBranchCount = Math.max(0, explicitBranchCount - 1);
      } else if ((branchCount === 0 || explicitBranchCount > 0 && matchSymbol !== branchEnd) && ignoredSymbols.includes(axiomSymbol) === false) {
        // not in branchSymbols/branch? or if in explicit branch, and not at the very end of
        // condition (at the ]), and symbol not in ignoredSymbols ? then false
        return false;
      }
    }

    return false
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

function drawTurtle(context, turtle, angle) {
  context.beginPath();
  var l = 10 * Math.pow(2, 0.5);
  var cp = turtle.position;

  var cp1 = cp.subtract(new Vector2(l * Math.sin((45 + angle) * 0.01745), l * Math.cos((45 + angle) * 0.01745)))
  var cp2 = cp.add(new Vector2(l * Math.sin((45 - angle ) * 0.01745), -1 * l * Math.cos((45 - angle) * 0.01745)))

  context.moveTo(cp.x, turtle.cartToScreen(cp.y));

  context.lineTo(cp1.x, turtle.cartToScreen(cp1.y));
  context.lineTo(cp2.x, turtle.cartToScreen(cp2.y));
  context.closePath();
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
  for (let i = 0; i < rules.length; i++) {
    ruleStr += "<br>" + rules[i]["a"] + " -> " + rules[i]["b"]
  }

  document.getElementById("desc-rules").innerHTML = ruleStr
}

window.addEventListener('DOMContentLoaded', (_) => {
  // setup
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  currentSystem = systems["context_free"]["system1"];

  turtle = new Turtle(currentSystem.axiomAngle, currentSystem.startPositionY, currentSystem.startLength);
  lsystem = new LSystem2(
    currentSystem.axiom,
    currentSystem.type,
    currentSystem.rules,
    currentSystem.ignore,
  );

  setupInteractiveSystem();
  render(lsystem.getString());

  document.getElementById("generate").addEventListener("click", function () {
    // generate next iteration
    var code = lsystem.iterate();

    // render the next generated iteration
    render(code);
  });

  document.getElementById("reset").addEventListener("click", function () {
    turtle.reset(currentSystem.axiomAngle, currentSystem.startPositionY, currentSystem.startLength);
    lsystem.reset();
    render(lsystem.getString());
  });
});
