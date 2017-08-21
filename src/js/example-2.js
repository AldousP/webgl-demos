(function () {
	'use strict';

	var gl;
	var program;
	var assets = new AssetHandler({
		vert: 'glsl/vertex/example_2.glsl',
		frag: 'glsl/fragment/example_2.glsl'
	}, compileShaders);

	var positionAttributeLocation;
	var positionBuffer;
	var positions;

	/**
	 * App start code.
	 */
	function init () {
		var canvas = document.getElementById('webgl_example');
		gl = canvas.getContext('webgl');

		if (!gl) {
			console.error('No WebGL context available.');
			return;
		}

		assets.load();
	}

	/**
	 * Perform render calls.
	 */
	function renderLoop () {
		if (!program)

		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.useProgram(program);
		gl.enableVertexAttribArray(positionAttributeLocation);
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

		var size = 2;          // 2 components per iteration
		var type = gl.FLOAT;   // the data is 32bit floats
		var normalize = false; // don't normalize the data
		var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
		var offset = 0;        // start at the beginning of the buffer
		gl.vertexAttribPointer(
			positionAttributeLocation, size, type, normalize, stride, offset);

		var primitiveType = gl.TRIANGLES;
		var count = 3;
		gl.drawArrays(primitiveType, offset, count);
		window.requestAnimationFrame(renderLoop);
	}

	/**
	 * Init shader attributes once program has loaded.
	 */
	function programInit () {
		positionAttributeLocation = gl.getAttribLocation(program, "a_position");
		positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		// three 2d points
		positions = [
			0, 0,
			0, 0.5,
			0.7, 0
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);


		/**
		 * Start render loop.
		 */
		window.requestAnimationFrame(renderLoop);
	}

	/**
	 * Called when the asset manager has finished loading. Operates on loaded assets.
	 *
	 * @param assets
	 */
	function compileShaders (assets) {
		var vertexShader = createShader(gl, gl.VERTEX_SHADER, assets.vert);
		var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, assets.frag);
		program = createProgram(gl, vertexShader, fragmentShader);
		programInit();
	}

	/**
	 * Returns a webGL shader for the provided source and parameters.
	 *
	 * @param gl a gl context
	 * @param type the type of the shader (gl.X_SHADER)
	 * @param source GLSL shader source
	 * @returns {*}
	 */
	function createShader(gl, type, source) {
		var shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
		if (success) {
			return shader;
		}

		// Used to hold error states.
		console.log(gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
	}

	/**
	 * Creates the program context by linking the provided shaders.
	 *
	 * @param gl
	 * @param vertexShader
	 * @param fragmentShader
	 * @returns A linked shader program.
	 */
	function createProgram(gl, vertexShader, fragmentShader) {
		var program = gl.createProgram();
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);
		var success = gl.getProgramParameter(program, gl.LINK_STATUS);
		if (success) {
			return program;
		}

		console.log(gl.getProgramInfoLog(program));
		gl.deleteProgram(program);
	}

	/**
	 * Starts the app.
	 */
	init();
}());