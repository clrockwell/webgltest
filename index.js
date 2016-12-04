var buffers = {
  position: {
    data: [
      0, 0,
      0, 0.5,
      0.7, 0
    ],
    size: 2
  }
};

var programs = {
  default: {
    vertex: "vertex",
    fragment: "fragment"
  }
};

function main() {
  var canvas = document.getElementById("canvas");
  var gl = canvas.getContext("webgl");
  window.gl = gl;
  if (!gl) {
    console.error("WebGL isn't supported on this browser");
    return;
  }

  initPrograms(gl);
  initBuffers(gl);

  function mainLoop() {
    render(gl);
    window.requestAnimationFrame(mainLoop);
  }
  window.requestAnimationFrame(mainLoop);
}
main();

function render(gl) {
  resize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(programs.default.program);

  programs.default.attribs.a_position(buffers.position);
  gl.uniform4f(programs.default.uniforms.u_color, Math.random(), Math.random(), Math.random(), 1);

  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 3;
  gl.drawArrays(primitiveType, offset, count);
}

function resize(canvas) {
  // Lookup the size the browser is displaying the canvas.
  var displayWidth  = canvas.clientWidth;
  var displayHeight = canvas.clientHeight;

  // Check if the canvas is not the same size.
  if (canvas.width  != displayWidth ||
      canvas.height != displayHeight) {

    // Make the canvas the same size
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }
}
