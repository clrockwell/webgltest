function initBuffers(gl) {
  var bufferNames = Object.keys(buffers);
  for (var i = 0; i < bufferNames.length; i++) {
    var name = bufferNames[i];
    setupBufferInfo(gl, buffers[name]);
  }
}

function setupBufferInfo(gl, bufferInfo) {
  bufferInfo.buffer = createBuffer(gl, bufferInfo.data);
}

function createBuffer(gl, data) {
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  return buffer;
}
