---
layout: blog.liquid
title:  "Natural Looking Trees with Stochastic L-Systems"
categories: ["blog"]
is_draft: true
data:
  scripts: [extras/simulate-l-system.js]
---

[No Man's Sky](https://www.nomanssky.com/) is built around a procedurally generated deterministic open world universe with too many planets to be explored realistically. It is claimed that they used [Superformula](https://en.wikipedia.org/wiki/Superformula) and [L-Systems](https://en.wikipedia.org/wiki/L-system) for generating flora and  fauna procedurally. I tried experimenting with L systems to create realistic looking trees and described my results here.

### What is a L-System
An L-system or [Lindenmayer system](https://en.wikipedia.org/wiki/L-system) is a recursive and string-rewriting framework that was discovered by Hungarian biologist Aristid Lindenmayer while studying algae growth. Nowadays, in computer graphics it is used for creating procedural and fractal like structures. I won't go into much depth about it, since it is described quite elaborately on wikipedia.

There are mainly three types of L systems:
1. Deterministic Grammar
    - Context Free
    - Context Sensitive
2. Stochastic Grammar
3. Parametric Grammar

<style>
  #container {
    display: flex;
    margin: auto;
  }
  canvas {
    background: #3a3a3a;
    display: block;
    margin: 0 10px 10px 0;
  }
  #dropdown-container {
    display: inline-block;
  }

  @media only screen and (max-width: 600px) {
    #container {
      flex-direction: column;
    }
    #canvas {
        width: calc(100vw - 30px);
    }
  }
</style>

<div id="container">
  <div id="canvas-container">
    <canvas id="canvas" height=400 width=500></canvas>
    <div id="controls-container">
        <button id="generate" onclick="generate()">Generate</button>
        <button id="reset" onclick="reset()">Reset</button>
        <div id="dropdown-container">
          <label>Choose: </label>
          <select id="system-selector"></select>
        </div>
    </div>
  </div>
  <div id="lsystem-description">
    <p>Axiom: FF</p>
    <p>System Description</p>
    <p>Rules: F-> FF</p>
  </div>
</div>

<br>

Above, I have created a small interactive demo which can generate different types of L systems and you can see how it grows over generations. You can select different examples from the dropdown. To learn more about how i am rendering this see [rendering](#rendering) section.

### Deterministic Grammar
In deterministic grammar the system always generate a fixed output because the predecessor is always fixed. It can be further divided into two subtypes:

#### Context Free
In context free grammar, each token is evaluated in the isolation. For example:

```js
Axiom = X
Rules = [
  F -> FF
  X -> F+[-F-XF-X][+FF][--XF[+X]][++F-X]
]
```
Here when started with the axiom X,[^fn1] both replacements will happen independently and for single tokens i.e F and X.

#### Context Sensitive
Contrary to context free systems, in context sensitive rules can be defined for symbols to match when it is proceeded or succeeded by specific symbols. It can be used along with context free rules to propagate a symbol in certain direction for simulating signal propagation. These context rules are defined using < and > in the rule, near the predecessor or successor.

For example rule `B < A -> B` means that change A to B only if there is a B before A. Similarly you can have rules with either side.
```js
A > B -> B
B < A > B -> C
```
First one means change A to B only if there is a B after A. Second one means change A to C only if there is a B before and after A.
Consider the following system:
```js
Axiom = BAAAAA
Rules => [
  BA -> BB
  B  -> A
]
```

Now if you apply these rules on the axiom it will result in simulating B moving right.
```
Pass0 => BAAAAA
Pass1 => ABAAAA
Pass2 => AABAAA
Pass3 => AAABAA
Pass4 => AAAABA
Pass5 => AAAAAB
```

### Stochastic Grammar

You cannot generate infinite variations of even same type of tree with these deterministic methods. So, for creating an infinite world we can take probabilistic approach to provide more randomness to the generated fractal trees.


<h3 id="rendering">Rendering</h3>

Hello world

### References
- [The Algorithmic Beauty of Plants](http://algorithmicbotany.org/papers/#abop)
- [Job Talle - Lindenmayer Systems](https://jobtalle.com/lindenmayer_systems.html)

### Footnotes
[^fn1]:. Here X is just a dummy variable for rendering i.e it will get ignored. For more indepth see rendering section. Dummy variables are used to give a more realistic look to the generate fractal trees.
