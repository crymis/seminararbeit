var x = y = 5; //erzeuge spiele-objekt
var domObject = document.createElement("img");
domObject.setAttribute("class", "smileyEl");
domObject.setAttribute("src", "img/smiley.png");
domObject.setAttribute("style","left:"+x+"px;top:"+y+"px");
cEl.appendChild(imgEl);
function render() { //definiere render-methode
    x += 5; //spiele-"logik"
    y += 5; //smiley bewegt sich
    domObject.style.left = x+"px"; //setze neue position
    domObject.style.top = y+"px";
} //starte animation
requestAnimationFrame(render);