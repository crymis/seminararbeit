window.performanceDemos = {};
window.demoWidth = -1;
window.demoHeight = -1;

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

(function($) {
    var selectedDemo = "canvas";
    
    var maxVec = 10;
    var amountObjects = 10;
    var objectRadius = 8;
    
    var fpsCounterInterval = 1000;
    
    //simulation-vars
    var runningSimulation = false;
    var lastWatch = window.performance.now();
    var fpsCounter = 0;
    var currentFPSValue = 0;
    
    function createBenchmarkChart(results) {
        console.log(results);
        
        var c = $('<canvas width="'+window.demoWidth+'" height="'+window.demoHeight+'" />');
        $('#benchmark_chart').html("").append(c);
        
        var data = {
            labels : ["Canvas","WebGL","SVG","DOM"],
            datasets : [
                {
                    fillColor : "rgba(220,220,220,0.5)",
                    strokeColor : "rgba(220,220,220,1)",
                    data : [results.canvas,
                            results.webgl,
                            results.svg,
                            results.dom,
                           ]
                }
            ]
        };
                
        var options = {
                
        };
        
        var barChart = new Chart(c[0].getContext("2d")).Bar(data, options);
    }
    
    function benchmarkAll() {
        $('#benchmark-all-button').removeClass("btn-success").addClass("btn-default");
    	var i = -1;
	    var demos = $('#demo-nav li');
        var results = {};
	    
	    function benchmarkNextDemo() {
		    i++;
            if(i < demos.length) {
		    demos[i].click();
		    benchmarkDemo(function(result) {
                results[selectedDemo] = result;
			    benchmarkNextDemo();
		    });
            } else {
                $('#benchmark-all-button').addClass("btn-success").removeClass("btn-default");
                createBenchmarkChart(results);
            }
	    }
	    	    
	    benchmarkNextDemo();
    }
    
    function benchmarkDemo(cb) {
        $('#benchmark-button').removeClass("btn-success").addClass("btn-default");
    	console.log("Benchmarking Demo "+selectedDemo);
    
    	var startObjectCount = 50;
    	var stepDelay = 7000;
    	
	    $('#amountObjects').val(startObjectCount);
	    $('#start-button').click();
	    
	    function amountFnUp(amountObjects, currentFPSValue) {
		    return Math.floor(amountObjects + amountObjects * (currentFPSValue - 30) / 30 );
	    }
	    
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
    
    function simulation(drawingFunction) {
        var objects = [];
        for(var i=0;i<amountObjects;i++) {
            objects.push({
                x: Math.random()*(window.demoWidth-4*objectRadius),
                y: Math.random()*(window.demoHeight-4*objectRadius),
                vecX: (Math.random()*maxVec)-(maxVec/2),
                vecY: (Math.random()*maxVec)-(maxVec/2)
            });
        }
        function tick() {
            for(var i=0;i<amountObjects;i++) {
                var objectToMove = objects[i];
                if(objectToMove.x+objectToMove.vecX+2*objectRadius > window.demoWidth || objectToMove.x+objectToMove.vecX < 0) {
                    objectToMove.vecX *= -1;
                }
                if(objectToMove.y+objectToMove.vecY+2*objectRadius > window.demoHeight || objectToMove.y+objectToMove.vecY < 0) {
                    objectToMove.vecY *= -1;
                }
                objectToMove.x += objectToMove.vecX;
                objectToMove.y += objectToMove.vecY;
            }
            drawingFunction(objects);
            fpsCounter++;
        }
        runningSimulation = true;
        (function animloop(){
          if(!runningSimulation) return;
          requestAnimFrame(animloop);
          tick();
        })();
    }
    
    
    function fpsWatcher() {
        var currentFPS = fpsCounter;
        fpsCounter = 0;
        var currentTime = window.performance.now();
        var lastlastWatch = lastWatch;
        lastWatch = currentTime;
        return currentFPS / ((currentTime - lastlastWatch) / 1000);
    }
    
    $(document).ready(function() {
        var counterEl = $('#fps-counter');
        $('#demo-nav li').click(function (){
            $(this).addClass("active").siblings().removeClass("active");
            runningSimulation = false;
            $('#democontainer').html("");
            selectedDemo = $(this).attr("data-show");
        });
        
        $('#benchmark-button').click(function (e){
            $('#stop-button').click();
            benchmarkDemo();
            e.preventDefault();
        });
        
        $('#benchmark-all-button').click(function (e){
            benchmarkAll();
            e.preventDefault();
        });
        
        $('#stop-button').click(function (e){
            $('#democontainer').html("");
            runningSimulation = false;
            e.preventDefault();
        });
        
        $('#start-button').click(function (e){
            $('#democontainer').html("");
            runningSimulation = false;
            amountObjects = parseInt($('#amountObjects').val());
            window.demoWidth = $('#democontainer').width();
            window.demoHeight = $('#democontainer').height();
            //trigger demo
            if(typeof window.performanceDemos[selectedDemo] != "function") {
                alert("Not yet implemented");
            } else {
                //wait for the current animation-loop to break
                setTimeout(function() {
                    window.performanceDemos[selectedDemo].call($('#democontainer'),$, simulation);
                }, 1000);
            }
            e.preventDefault();
        });
        
        setInterval(function() {
	        currentFPSValue = fpsWatcher();
            counterEl.html("<i class='glyphicon glyphicon-eye-open'></i> FPS: "+currentFPSValue);
        }, fpsCounterInterval);
    });
})(jQuery);
    
