window.performanceDemos["webgl"] = function ($, callback) {
    var cEl = $('<canvas width="' + window.demoWidth + '" height="' + window.demoHeight + '" />');
    var gl = cEl[0].getContext("experimental-webgl");
    var img = new Image();

    // setup a GLSL program
    var vertexShader = createShaderFromScriptElement(gl, "2d-vertex-shader");
    var fragmentShader = createShaderFromScriptElement(gl, "2d-fragment-shader");
    var program = createProgram(gl, [vertexShader, fragmentShader]);
    gl.useProgram(program);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable ( gl.BLEND ) ;

    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");

    var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");

    // provide texture coordinates for the rectangle.
    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        1.0, 1.0
    ]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    // Create a texture.


    // lookup uniforms
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");

    // set the resolution
    gl.uniform2f(resolutionLocation, window.demoWidth, window.demoHeight);

    function setRectangle(gl, x, y, width, height) {
        var x1 = x;
        var x2 = x + width;
        var y1 = y;
        var y2 = y + height;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2
        ]), gl.STATIC_DRAW);
    }
    
    var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // Set the parameters so we can render any size image.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    
    
           

    function drawIt(objects) {
        // Upload the image into the texture.
         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        // Create a buffer for the position of the rectangle corners.
        var buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        for (var i = 0; i < objects.length; i++) {
            var objectToDraw = objects[i];
            setRectangle(gl, objectToDraw.x, objectToDraw.y, 20, 20);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
    }

    img.onload = function () {
        callback(drawIt);
    };

    this.append(cEl);
    //drawing will start if img is loaded
    img.src = "img/smiley.png";
};