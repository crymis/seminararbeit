var container = document.getElementById("container"); //träger DOM-element
var c = container.getContext("2d"); //hole context-objekt
var lastRenderTime = (new Date()).getTime(); //merke aktuelle zeit für normalisierung

c.fillStyle = '#0000ff'; //setze füllfarbe (muss nur einmal gemacht werden)

var gameObject = { //initialisiere spiele-welt
	x: 5,
	y: 5,
	vecX: 2,
	vecY: 2
};

//definiere render-methode
function render() {
	requestAnimationFrame(render); //fordere nächsten render-schritt an
	var now = (new Date()).getTime();
	var timeDiff = now - lastRenderTime; //ermittle zeit seit letzten renderschritt
	lastRenderTime = now;
	gameObject.x += (gameObject.vecX / timeDiff); //spiele-physik (bewegung des spiele-objekts), angepasst auf zeit-delta
	gameObject.y += (gameObject.vecY / timeDiff);

	c.clearRect(0, 0, 500, 400); //leere zeichenfläche
	c.fillRect(gameObject.x, gameObject.y, 4, 4); //zeichne spiele-welt
}

//starte animation
requestAnimationFrame(render);