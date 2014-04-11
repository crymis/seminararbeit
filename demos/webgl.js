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