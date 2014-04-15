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
    if(state == "up") { //aufwärts-suche
    if(currentFPSValue < 30) { //obere grenze gefunden
      state = "down";
      setTimeout(nextBenchmarkStep, stepDelay);
    } else { //obere grenze noch nicht gefunden
      $('#amountObjects').val(amountFnUp(amountObjects, currentFPSValue));
      $('#start-button').click();
      setTimeout(nextBenchmarkStep, stepDelay); 
    }	
  } else { //abwärts-suche
    if(currentFPSValue > 30) { //anzahl objekte für 30 FPS gefunden
      cb(amountObjects);
    } else { //grenze noch nicht gefunden
      $('#amountObjects').val(amountFnDown(amountObjects, currentFPSValue));
      $('#start-button').click();
      setTimeout(nextBenchmarkStep, stepDelay); 
    }
  }    
}
setTimeout(nextBenchmarkStep, stepDelay);
}
