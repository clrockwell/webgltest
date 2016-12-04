function buildShaderProgram(gl, vertexId, fragmentId) {
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, getShader(vertexId));
  var fragementShader = createShader(gl, gl.FRAGMENT_SHADER, getShader(fragmentId));
  return createProgram(gl, vertexShader, fragementShader);
}

function getShader(id) {
  return document.getElementById(id).text;
}

function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.error(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

