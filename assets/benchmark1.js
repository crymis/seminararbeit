function simulation(drawingFunction) {
        var objects = [];
	
	//erzeuge objekte mit zufälliger position und geschwindigkeit
	for(var i=0;i<amountObjects;i++) {
		objects.push(getRandomObject());
	}

	//methode, die für jeden frame ausgeführt wird
        function tick() {
		for(var i=0;i<amountObjects;i++) { //für alle objekte
			var objectToMove = objects[i];
			//überprüfe auf kollision
			if(objectToMove.isXCollision()) objectToMove.vecX *= -1;
			if(objectToMove.isYCollision()) objectToMove.vecY *= -1;

			//bewege objekt nach bewegungs-vektoren
			objectToMove.move();
		}
		
		//zeichne objekte mit austauschbarer implementierung (canvas, webgl, ...)
		drawingFunction(objects);
        }

	//starte game-loop
        (function animloop(){
          requestAnimFrame(animloop);
          tick();
        })();
    }
