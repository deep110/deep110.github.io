window.onload = function () {
  document.getElementById("menu-icon").onclick = function () {
    toggleClass(document.body, "exp");
  }

  // setup things
  setTheme();
  inflateKatex();
}

function setTheme() {
  var themeToggleButton = document.getElementById("dark-theme-icon");
  if (localStorage.getItem("theme") === "dark") {
    themeToggleButton.setAttribute("title", "Switch to light theme");
  }
  themeToggleButton.onclick = function () {
    toggleTheme(this);
  }
}

function toggleTheme(themeButton) {
  var currentTheme = localStorage.getItem("theme");
  if (currentTheme == null || currentTheme == "light") {
    localStorage.setItem("theme", "dark");
    document.documentElement.setAttribute("theme", "dark");

    themeButton.setAttribute("title", "Switch to light theme");
  } else {
    localStorage.setItem("theme", "light");
    document.documentElement.removeAttribute("theme");

    themeButton.setAttribute("title", "Switch to dark theme");
  }
}

// util functions
function toggleClass(element, toggleClass) {
  var currentClass = element.className;
  var newClass;
  if (currentClass.split(" ").indexOf(toggleClass) > -1) { //has class
    newClass = currentClass.replace(new RegExp('\\b' + toggleClass + '\\b', 'g'), "")
  } else {
    newClass = currentClass + " " + toggleClass;
  }
  element.className = newClass.trim();
}

function inflateKatex() {
  var classes = document.getElementsByClassName("equation");
  for (var i = 0; i < classes.length; i++) {
    katex.render(classes[i].innerHTML.trim(), classes[i], {
      output: "html",
      throwOnError: false,
      displayMode: true
    });
  }
}

// create a basic game loop controller to run simulations at target FPS
window.raf = (function() {
  return window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(callback) {window.setTimeout(callback, 1000 / 60);};
})();

var GameLoopController = {
  loop: function(loopFunc, targetFps) {
      window.raf(function(now){
          var dt = now - GameLoopController.stamp || 0;
          GameLoopController.stamp = now;
          loopFunc(dt);
          GameLoopController.loop(loopFunc, targetFps);
      });

  },
  stamp: undefined
};
