function benchmarkDemo(cb) {
	var startObjectCount = 50;
    	var stepDelay = 7000;

	//stelle anzahl objekte ein    	
	$('#amountObjects').val(startObjectCount);
	//starte demo
	$('#start-button').click();

	//funktion zur bestimmung der nächsten objekt-anzahl
	function amountFnUp(amountObjects, currentFPSValue) {
	    return Math.floor(amountObjects + amountObjects * (currentFPSValue - 30) / 30 );
	}

	//funktion zur bestimmung der nächsten objekt-anzahl für finetunig
	function amountFnDown(amountObjects, currentFPSValue) {
	    return Math.floor(amountObjects * 0.95);
	}
	
	    
	var state = "up";
	    
	function nextBenchmarkStep() {
		if(state == "up") {
			if(currentFPSValue < 30) {
				state = "down";
				console.log("Upper bound reached: "+amountObjects+", finetuning...");
				setTimeout(nextBenchmarkStep, stepDelay);
			} else {
				console.log(amountObjects+" objects passed, remaining FPS to break down: "+(currentFPSValue - 30));
				$('#amountObjects').val(amountFnUp(amountObjects, currentFPSValue));
				$('#start-button').click();
				setTimeout(nextBenchmarkStep, stepDelay); 
			}	
		} else {
			if(currentFPSValue > 30) {
				console.log("Demo "+selectedDemo+" benchmarked: "+amountObjects+" Objects @ 30FPS");
	    $('#benchmark-button').addClass("btn-success").removeClass("btn-default");
				if(typeof cb == "function") cb(amountObjects);
			} else {
				console.log("finetuning...");
				$('#amountObjects').val(amountFnDown(amountObjects, currentFPSValue));
				$('#start-button').click();
				setTimeout(nextBenchmarkStep, stepDelay); 
			}
		}    
	
	}

	setTimeout(nextBenchmarkStep, stepDelay);
	}
