---
---
window.onload = function(){
  document.getElementById("menu-icon").onclick=function(){
    toggleClass(document.body, "exp");
  }
}

// util functions
function toggleClass(element, toggleClass){
  var currentClass = element.className;
  var newClass;
  if(currentClass.split(" ").indexOf(toggleClass) > -1){ //has class
     newClass = currentClass.replace(new RegExp('\\b'+toggleClass+'\\b','g'),"")
  }else{
     newClass = currentClass + " " + toggleClass;
  }
  element.className = newClass.trim();
}
