var canvas = document.getElementById("canvas");
var gl = canvas.getContext("experimental-webgl");
// setup a GLSL program
var vertexShader = createShader(gl, "2d-vertex-shader");
var fragmentShader = createShader(gl, "2d-fragment-shader");
var program = createProgram(gl, [vertexShader, fragmentShader]);
gl.useProgram(program);
// look up where the vertex data needs to go.
var positionLocation = gl.getAttribLocation(program, "a_position");
// Create a buffer and put a single clipspace rectangle in it (2 triangles)
var buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, 
    new Float32Array([-1.0, -1.0,  1.0, 
        -1.0,  -1.0,  1.0,  
        -1.0,  1.0,  1.0, 
        -1.0,  1.0,  1.0]), 
    gl.STATIC_DRAW);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
// draw
gl.drawArrays(gl.TRIANGLES, 0, 6);
//**************2d-vertex-shader*****************
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0, 1);
}
//**************2d-fragment-shader***************
void main() {
  gl_FragColor = vec4(0,1,0,1);  // green
}