window.performanceDemos = {};
window.performanceDemos["webgl"] = function ($, callback) {
    var cEl = $('<canvas width="' + window.demoWidth + '" height="' + window.demoHeight + '" />');
    var gl = cEl[0].getContext("experimental-webgl");
    var img = new Image();

    // setup a GLSL program
    var vertexShader = getShader(gl, "2d-vertex-shader");
    var fragmentShader = getShader(gl, "2d-fragment-shader");

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable ( gl.BLEND ) ;
    
    var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
    
    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");

    //var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");

    // provide texture coordinates for the rectangle.
    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    

    // Create a texture.
    var amount = parseInt($('#amountObjects').val());
    var texBuffer = new Float32Array(amount * 12);
    for(var i=0;i<amount;i++) {
        var baseIndex = i * 12;
        texBuffer[baseIndex + 0] = 0.0;
        texBuffer[baseIndex + 1] = 0.0;
        texBuffer[baseIndex + 2] = 1.0;
        texBuffer[baseIndex + 3] = 0.0;
        texBuffer[baseIndex + 4] = 0.0;
        texBuffer[baseIndex + 5] = 1.0;
        texBuffer[baseIndex + 6] = 0.0;
        texBuffer[baseIndex + 7] = 1.0;
        texBuffer[baseIndex + 8] = 1.0;
        texBuffer[baseIndex + 9] = 0.0;
        texBuffer[baseIndex + 10] = 1.0;
        texBuffer[baseIndex + 11] = 1.0;
    }
    
    gl.bufferData(gl.ARRAY_BUFFER, texBuffer, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    // lookup uniforms
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");

    // set the resolution
    gl.uniform2f(resolutionLocation, window.demoWidth, window.demoHeight);
    
    var dataBuffer = null;//new Float32Array(24);
    
    function setBuffer(gl, objects, width, height) {
        for (var i = 0; i < objects.length; i++) {
            var baseIndex = i * 12;
            var x = objects[i].x;
            var y = objects[i].y;
            var x2 = x + width;
            var y2 = y + height;
            
            dataBuffer[baseIndex+0] = x;
            dataBuffer[baseIndex+1] = y;
            dataBuffer[baseIndex+2] = x2;
            dataBuffer[baseIndex+3] = y;
            dataBuffer[baseIndex+4] = x;
            dataBuffer[baseIndex+5] = y2;
            dataBuffer[baseIndex+6] = x;
            dataBuffer[baseIndex+7] = y2;
            dataBuffer[baseIndex+8] = x2;
            dataBuffer[baseIndex+9] = y;
            dataBuffer[baseIndex+10] = x2;
            dataBuffer[baseIndex+11] = y2;
            
        }
        
        gl.bufferData(gl.ARRAY_BUFFER, dataBuffer, gl.DYNAMIC_DRAW);
    }
    
        // Create a buffer for the position of the rectangle corners.
        var buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);   
    
    function buildBuffers(amount) {
        dataBuffer = new Float32Array(amount * 12);
    }
    
    
    function drawIt(objects) {
        if(dataBuffer == null) {
           buildBuffers(objects.length);
        }
        setBuffer(gl, objects, 16, 16);
        gl.drawArrays(gl.TRIANGLES, 0, objects.length * 6);
    }

    img.onload = function () {
        // Upload the image into the texture.
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.activeTexture(gl.TEXTURE0);
        //gl.uniform1i(texCoordLocation, 0);
        callback(drawIt);
    };

    this.append(cEl);
    //drawing will start if img is loaded
    img.src = "img/smiley.png";
};

function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
      return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
      if (k.nodeType == 3) {
        str += k.textContent;
      }
      k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
      shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
      return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(shader));
      return null;
    }

    return shader;
  }
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
    var selectedDemo = "webgl";
    
    var maxVec = 10;
    var amountObjects = 10;
    var objectRadius = 8;
    
    var fpsCounterInterval = 1000;
    
    //simulation-vars
    var runningSimulation = false;
    var lastWatch = window.performance.now();
    var fpsCounter = 0;
    var currentFPSValue = 0;
    
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
        
        $('#benchmark-button').click(function (e){
            $('#stop-button').click();
            benchmarkDemo();
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
    
