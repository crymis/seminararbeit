var xmlns = "http://www.w3.org/2000/svg";
var xlinkns = "http://www.w3.org/1999/xlink";
//erzeuge zeichenfläche
var cEl = document.createElementNS(xmlns, "svg");
var x = y = 5; //erzeuge spiele-objekt
var domObject = document.createElementNS(xmlns, "image");
domObject.setAttributeNS(null, "x",x);
domObject.setAttributeNS(null, "y",y);
domObject.setAttributeNS(xlinkns, "xlink:href", "img/smiley.png");
cEl.appendChild(imgEl);
function render() { //definiere render-methode
    x += 5; //spiele-"logik"
    y += 5; //smiley bewegt sich
    domObject.setAttributeNS(null, "x", x); //setze neue position
    domObject.setAttributeNS(null, "y", y);
} //starte animation
requestAnimationFrame(render);