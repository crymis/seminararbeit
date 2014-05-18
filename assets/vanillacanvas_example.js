var container = document.getElementById("container"); //träger DOM-element
var c = container.getContext("2d"); //hole context-objekt
var lastRenderTime = (new Date()).getTime(); //merke zeit für normalisierung
//setze füllfarbe (muss nur einmal gemacht werden)
c.fillStyle = '#0000ff'; 
//initialisiere spiele-welt
var gameObject = {
	x: 5, y: 5,
	vecX: 2, vecY: 2
};
function render() { //definiere render-methode
    //fordere nächsten render-schritt an
	requestAnimationFrame(render); 
	var now = (new Date()).getTime();
    //ermittle zeit seit letzten renderschritt
	var timeDiff = now - lastRenderTime; 
	lastRenderTime = now;
    //spiele-physik (bewegung des spiele-objekts), angepasst auf zeit-delta
	gameObject.x += (gameObject.vecX / timeDiff); 
	gameObject.y += (gameObject.vecY / timeDiff);
	c.clearRect(0, 0, 500, 400); //leere zeichenfläche
	c.fillRect(gameObject.x, gameObject.y, 4, 4); //zeichne spiele-welt
}
//starte animation
requestAnimationFrame(render);
