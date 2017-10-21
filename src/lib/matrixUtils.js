//
// Matrix utility functions
//

function loadIdentity() {
	mvMatrix = Matrix.I(4);
}

function multMatrix(m) {
	mvMatrix = mvMatrix.x(m);
}

function mvTranslate(v) {
	multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}

function setMatrixUniforms(gl, program, perspectiveMatrix) {
	var pUniform = gl.getUniformLocation(program, "uPMatrix");
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

	var mvUniform = gl.getUniformLocation(program, "uMVMatrix");
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
}

export {
  loadIdentity,
  multMatrix,
  mvTranslate,
  setMatrixUniforms
}