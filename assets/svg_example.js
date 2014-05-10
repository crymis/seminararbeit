var namespace = "http://www.w3.org/2000/svg";
//erzeuge svg-root-element
var cEl = document.createElementNS(namespace, "svg");
//erzeuge svg-circle-element
var circle = document.createElementNS(namespace, "circle");

cEl.appendChild(circle);

