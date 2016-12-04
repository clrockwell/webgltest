function initPrograms(gl) {
  var programNames = Object.keys(programs);
  for (var i = 0; i < programNames.length; i++) {
    var name = programNames[i];
    setupProgramInfo(gl, programs[name]);
  }
}

function setupProgramInfo(gl, programInfo) {
  var program = buildShaderProgram(gl, programInfo.vertex, programInfo.fragment);
  programInfo.program = program;
  programInfo.attribs = {};
  programInfo.uniforms = {};
  console.log(program);

  // auto-detect attribute & uniform locations

  var numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  for (var i = 0; i < numAttribs; i++) {
    var attrib = gl.getActiveAttrib(program, i);
    var location = gl.getAttribLocation(program, attrib.name);
    programInfo.attribs[attrib.name] = createAttribSetter(gl, location);
  }

  var numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (i = 0; i < numUniforms; i++) {
    var uniform = gl.getActiveUniform(program, i);
    var location = gl.getUniformLocation(program, uniform.name);
    programInfo.uniforms[uniform.name] = location;
  }
}

function createAttribSetter(gl, attribLocation) {
  return function attachBufferToAttrib(bufferInfo) {
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.buffer);
    gl.enableVertexAttribArray(attribLocation);
    gl.vertexAttribPointer(
      attribLocation,
      bufferInfo.size,
      bufferInfo.float || gl.FLOAT,
      bufferInfo.normalize || false,
      bufferInfo.stride || 0,
      bufferInfo.offset || 0
    );
  };
}
