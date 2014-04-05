//lege wurzel-objekt an (stage genannt)
var stage = new Kinetic.Stage({
	container: 'container', //id des träger dom elements
	width: 578, //größe
	height: 363
});

//lege layer an
var layer = new Kinetic.Layer();

//lege shape an
var shape = new Kinetic.RegularPolygon({
	x: Math.random() * stage.getWidth(), //zufällige position
	y: Math.random() * stage.getHeight(),
	sides: 3, //form
	radius: 70, //größe
	fillRed: 1, //farbe
	fillGreen: 0,
	fillBlue: 0
});

//verknüpfe form mit layer
layer.add(shape);

//verknüpfe layer mit stage
stage.add(layer);

//das rote dreieck ist jetzt sichtbar
