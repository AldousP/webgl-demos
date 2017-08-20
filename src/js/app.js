(function () {
	'use strict';

	var gl;
	var program;
	var assets = new AssetHandler({
		vert: 'glsl/vertex/example_1.glsl',
		frag: 'glsl/fragment/example_1.glsl'
	}, compileShaders);


	function init () {
		var canvas = document.getElementById('webgl_example');
		gl = canvas.getContext('webgl');

		if (!gl) {
			console.error('No WebGL context available.');
			return;
		}

		assets.load();
	}

	function compileShaders (assets) {
		var vertexShader = createShader(gl, gl.VERTEX_SHADER, assets.vert);
		var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, assets.frag);
		program = createProgram(gl, vertexShader, fragmentShader);
		console.log(program);
	}

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

	init();
}());