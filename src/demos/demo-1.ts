(function () {
  function AssetHandler (map, onComplete) {
    this.loadedFileCount = 0;
    this.map = map;
    this.assets = {};
    /**
     * Called when every file has finished loading.
     */
    this.onCompleted = onComplete;

    /**
     * Begins loading the assets.
     */
    this.load = function () {
      var keys = Object.keys(this.map);
      if (keys) {
        var that = this;
        keys.forEach(function (key) {
          var ref = that.map[key];
          that._loadFile(ref, key);
        })
      }
    };

    /**
     * Called after each asset is loaded. Increments the loaded asset count.
     */
    this._assetLoaded = function () {
      this.loadedFileCount++;
      if (Object.keys(this.map).length === this.loadedFileCount) {
        this.onCompleted(this.assets);
      }
    };

    /**
     * Loads a file with the given handle from the domain.
     */
    this._loadFile = function (srcRef, name, callback) {
      var req = new XMLHttpRequest();
      var that = this;
      req.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          that.assets[name] = req.responseText;
          that._assetLoaded();
          if (typeof callback === 'function') {
            callback();
          }
        }
      };
      req.open("GET", srcRef, true);
      req.send();
    };
  }
  'use strict';

  var gl;
  var program;
  var positionAttributeLocation;
  var positionBuffer;
  var positions;

  var vertShader = require('app/glsl/vertex/example_1');
  var fragShader = require('app/glsl/fragment/example_1');

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

    compileShaders();
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
  function compileShaders () {
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertShader);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragShader);
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
  function createShader (gl, type, source) {
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
  function createProgram (gl, vertexShader, fragmentShader) {
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