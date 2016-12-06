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
    programInfo.uniforms[uniform.name] = createUniformSetter(gl, uniform, location);
  }
}

function createAttribSetter(gl, attribLocation) {
  return function attachBufferToAttrib(bufferInfo) {
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.buffer);
    gl.enableVertexAttribArray(attribLocation);
    gl.vertexAttribPointer(
      attribLocation,
      bufferInfo.numComponents,
      bufferInfo.float || gl.FLOAT,
      bufferInfo.normalize || false,
      bufferInfo.stride || 0,
      bufferInfo.offset || 0
    );
  };
}

function createUniformSetter(gl, uniformInfo, uniformLocation) {
  // Check if this uniform is an array
  var isArray = (uniformInfo.size > 1 && uniformInfo.name.substr(-3) === "[0]");

  if (uniformInfo.type === gl.FLOAT && isArray) {
    return function(v) {
      gl.uniform1fv(uniformLocation, v);
    };
  }
  if (uniformInfo.type === gl.FLOAT) {
    return function(v) {
      gl.uniform1f(uniformLocation, v);
    };
  }
  if (uniformInfo.type === gl.FLOAT_VEC2) {
    return function(v) {
      gl.uniform2fv(uniformLocation, v);
    };
  }
  if (uniformInfo.type === gl.FLOAT_VEC3) {
    return function(v) {
      gl.uniform3fv(uniformLocation, v);
    };
  }
  if (uniformInfo.type === gl.FLOAT_VEC4) {
    return function(v) {
      gl.uniform4fv(uniformLocation, v);
    };
  }
  if (uniformInfo.type === gl.INT && isArray) {
    return function(v) {
      gl.uniform1iv(uniformLocation, v);
    };
  }
  if (uniformInfo.type === gl.INT) {
    return function(v) {
      gl.uniform1i(uniformLocation, v);
    };
  }
  if (uniformInfo.type === gl.INT_VEC2) {
    return function(v) {
      gl.uniform2iv(uniformLocation, v);
    };
  }
  if (uniformInfo.type === gl.INT_VEC3) {
    return function(v) {
      gl.uniform3iv(uniformLocation, v);
    };
  }
  if (uniformInfo.type === gl.INT_VEC4) {
    return function(v) {
      gl.uniform4iv(uniformLocation, v);
    };
  }
  if (uniformInfo.type === gl.BOOL) {
    return function(v) {
      gl.uniform1iv(uniformLocation, v);
    };
  }
  if (uniformInfo.type === gl.BOOL_VEC2) {
    return function(v) {
      gl.uniform2iv(uniformLocation, v);
    };
  }
  if (uniformInfo.type === gl.BOOL_VEC3) {
    return function(v) {
      gl.uniform3iv(uniformLocation, v);
    };
  }
  if (uniformInfo.type === gl.BOOL_VEC4) {
    return function(v) {
      gl.uniform4iv(uniformLocation, v);
    };
  }
  if (uniformInfo.type === gl.FLOAT_MAT2) {
    return function(v) {
      gl.uniformMatrix2fv(uniformLocation, false, v);
    };
  }
  if (uniformInfo.type === gl.FLOAT_MAT3) {
    return function(v) {
      gl.uniformMatrix3fv(uniformLocation, false, v);
    };
  }
  if (uniformInfo.type === gl.FLOAT_MAT4) {
    return function(v) {
      gl.uniformMatrix4fv(uniformLocation, false, v);
    };
  }
  if ((uniformInfo.type === gl.SAMPLER_2D || uniformInfo.type === gl.SAMPLER_CUBE) && isArray) {
    var units = [];
    for (var ii = 0; ii < info.size; ++ii) {
      units.push(textureUnit++);
    }
    return function(bindPoint, units) {
      return function(textures) {
        gl.uniform1iv(uniformLocation, units);
        textures.forEach(function(texture, index) {
          gl.activeTexture(gl.TEXTURE0 + units[index]);
          gl.bindTexture(bindPoint, texture);
        });
      };
    }(getBindPointForSamplerType(gl, uniformInfo.type), units);
  }
  if (uniformInfo.type === gl.SAMPLER_2D || uniformInfo.type === gl.SAMPLER_CUBE) {
    return function(bindPoint, unit) {
      return function(texture) {
        gl.uniform1i(uniformLocation, unit);
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(bindPoint, texture);
      };
    }(getBindPointForSamplerType(gl, uniformInfo.type), textureUnit++);
  }
  throw ("unknown type: 0x" + uniformInfo.type.toString(16)); // we should never get here.
}
