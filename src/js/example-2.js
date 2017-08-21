(function () {
	'use strict';

	var gl;
	var program;
	var assets = new AssetHandler({
		vert: 'glsl/vertex/example_2.glsl',
		frag: 'glsl/fragment/example_2.glsl'
	}, compileShaders);

	var squareVerticesBuffer;

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

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		var perspectiveMatrix = makePerspective(45, 640.0/480.0, 0.1, 100.0);

		loadIdentity();
		mvTranslate([-0.0, 0.0, -6.0]);

		gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
		gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
		setMatrixUniforms();
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

		window.requestAnimationFrame(renderLoop);
	}

	/**
	 * Init shader attributes once program has loaded.
	 */
	function programInit () {

		squareVerticesBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);

		var vertices = [
			1.0,  1.0,  0.0,
			-1.0, 1.0,  0.0,
			1.0,  -1.0, 0.0,
			-1.0, -1.0, 0.0
		];

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

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