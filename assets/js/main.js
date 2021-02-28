setTheme();

window.onload = function () {
  document.getElementById("menu-icon").onclick = function () {
    toggleClass(document.body, "exp");
  }
  document.getElementById("dark-theme-icon").onclick = function () {
    toggleTheme();
  }
  inflateKatex();
}

function setTheme() {
  // TODO: maybe check user settings preference
  if (localStorage.getItem("theme") === "dark") {
    document.getElementsByTagName("body")[0].setAttribute("theme", "dark");
  }
}

function toggleTheme() {
  var currentTheme = localStorage.getItem("theme");
  if (currentTheme == null || currentTheme == "light") {
    localStorage.setItem("theme", "dark");
    document.getElementsByTagName("body")[0].setAttribute("theme", "dark");

    // $("#dark-mode").attr("title", "Switch to light theme");
  } else {
    localStorage.setItem("theme", "light");
    document.getElementsByTagName("body")[0].removeAttribute("theme");

    // $("#dark-mode").attr("title", "Switch to dark theme");
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
