'use strict';

/*
 * Stupid Monolithic object for managing app context
 */

(function () {
  var tmpVec = new SVec.Vector();

  window.sm = {
    programDescription: function () {
      return sm.activeProgram ? sm.activeProgram.state.meta.description : 'No Program Loaded';
    },
    toggleDebug : function () {
      sm.conf.debug.active = !sm.conf.debug.active;
    },
    
    togglePause : function () {
      sm.conf.paused = !sm.conf.paused;
    },
    
    checkIfMobile : function () {
      sm.conf.mobile.is_mobile = window.innerWidth < sm.conf.mobile.mobile_break;

      if (sm.conf.mobile.last_win_width > sm.conf.mobile.mobile_break && sm.conf.mobile.is_mobile) {
        sm.resizeCanvas();
      }

      if (sm.conf.mobile.last_win_width < sm.conf.mobile.mobile_break && !sm.conf.mobile.is_mobile) {
        sm.resizeCanvas();
      }
      sm.conf.mobile.last_win_width = window.innerWidth;
    },

    resizeCanvas : function () {
      if (sm.conf.mobile.is_mobile) {
        sm.canvas.width = sm.canvas.height;
      } else {
        sm.canvas.width = sm.canvas.height * 2;
      }

      if (sm.activeProgram && sm.activeProgram.onResize) {
        sm.activeProgram.onResize(sm.conf.mobile.is_mobile);
      }
    },
    stop : function() {
      sm.breakOnNextLoop = true;
    },
    context: 'root', // Used for logging context.
    conf: {
      paused : false,
      resourceDir: 'assets',
      mobile : {
        is_mobile : true,
        last_win_width : 451,
        mobile_break : 450
      },
      debug: {
        active: false,
        logConsole: {
          logToScreen: true,
          logToBrowserConsole: true,
          textConf : {
            color: sc.color.white,
            size: 12,
            font: 'Arial',
            style : 'normal',
            align: 'left'
          },
          padding: 0.025,
          logInProgram: true
        }
      }
    },
    time: {
      last : new Date().getTime(),
      current : new Date().getTime(),
      delta : 0,
      frameRate : 0,
      frameHistory : [],
      historyCap : 100,
      update : function () {
        sm.time.current = new Date().getTime();
        sm.time.delta = (sm.time.current - sm.time.last) / 1000;
        sm.time.frameRate = (1000 / sm.time.delta) / 1000;
        sm.time.last = sm.time.current;
        sm.time.frameHistory.push(sm.time.frameRate);
        if (sm.time.frameHistory.length > sm.time.historyCap) {
          sm.time.frameHistory.splice(0, 1);
        }
        var avg = 0;
        for (var i = 0; i < sm.time.frameHistory.length; i++) {
          avg += sm.time.frameHistory[i];
        }
        avg /= sm.time.frameHistory.length;
        sm.time.frameRate = avg;
      }
    },
    logs: [],
    ctx: {},
    canvas: {},
    input: {
      state: {
        cursor: new SVec.Vector(),
        keyboard: {

        },
        controllers: [

        ]
      },
      init: function () {
        // Input initializations
        document.addEventListener('keydown', function (event) {
          var keyCode = event.keyCode;
          sm.input.state.keyboard[keyCode] = true;
        });

        document.addEventListener('keyup', function (event) {
          var keyCode = event.keyCode;
          sm.input.state.keyboard[keyCode] = false;
        });

        sm.input.conf = {};
        var stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(sm.canvas, null)['paddingLeft'], 10) || 0;
        var stylePaddingTop = parseInt(document.defaultView.getComputedStyle(sm.canvas, null)['paddingTop'], 10)|| 0;
        var styleBorderLeft = parseInt(document.defaultView.getComputedStyle(sm.canvas, null)['borderLeftWidth'], 10) || 0;
        var styleBorderTop = parseInt(document.defaultView.getComputedStyle(sm.canvas, null)['borderTopWidth'], 10) || 0;
        // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
        // They will mess up mouse coordinates and this fixes that
        var html = document.body.parentNode;
        var htmlTop = html.offsetTop;
        var htmlLeft = html.offsetLeft;

        var element = sm.canvas, offsetX = 0, offsetY = 0;

        // Compute the total offset. It's possible to cache this if you want
        if (element.offsetParent !== undefined) {
          do {
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
          } while ((element = element.offsetParent));
        }

        offsetX += stylePaddingLeft + styleBorderLeft + htmlLeft;
        offsetY += stylePaddingTop + styleBorderTop + htmlTop;
        
        sm.input.conf.offsetX = offsetX;
        sm.input.conf.offsetY = offsetY;
        
        sm.canvas.onmousemove = function (evt) {
          var x = evt.clientX;
          var y = evt.clientY;
          var newX = x - sm.input.conf.offsetX;
          var newY = y - sm.input.conf.offsetY;
          newX -= sm.canvas.offsetWidth / 2;
          newY -= sm.canvas.offsetHeight / 2;
          newY *= -1;

          SVec.setVec(sm.input.state.cursor, newX, newY);
        };
        
        sm.canvas.onmousedown = function () {
          sm.input.state.mouseDown = true;
        };

        sm.canvas.onmouseup = function () {
          sm.input.state.mouseDown = false;
        };
      },

      update: function () {
        var controllers = navigator.getGamepads();

        if (controllers) {
          var realControllers = [];
          var controllerKeys = Object.keys(controllers);
          controllerKeys.forEach(function (key) {
            var entry = controllers[key];
            if (entry && entry.axes && entry.buttons) {
              realControllers.push(entry);
            }
          });
          sm.input.state.controllers = realControllers;
        }
      }
    },
    log: {
      notify: function (msg, context) {
        var date = new Date();
        var log = '[SM-Notify][' + (context ? context : 'root') + ']: ' + msg;
        if (sm.conf.debug.logConsole.logToBrowserConsole) {
          console.log(log);
        }
        sm.logs.push(this.timestamp() + log);
      },

      error: function (msg, context) {
        var log = '[SM-Error][' + (context ? context : 'root') + ']: ' + msg;
        if (sm.conf.debug.logConsole.logToBrowserConsole) {
          console.error(log);
        }
        sm.logs.push(this.timestamp() + log);
      },

      timestamp: function () {
        var date = new Date();
        return '(' +
            date.getHours() + ':' +
            date.getMinutes() + ':' +
            date.getSeconds() + ':' +
            date.getMilliseconds() +
            ')';
      }
    },

    gfx: {
      textConf : {
        color: sc.color.white,
        size: 12,
        font: 'Arial',
        style : 'normal',
        align: 'left'
      },
      width: 0,
      height: 0,
      clear: function (color) {
        sm.ctx.translate(-sm.canvas.width / 2, -sm.canvas.height / 2);
        if (color) {
          sm.ctx.fillStyle = color;
        } else {
          sm.ctx.fillStyle = sm.conf.debug.logConsole.bgColor;
        }
        sm.ctx.fillRect(0, 0, sm.canvas.width * 100, sm.canvas.height * 100);
        sm.ctx.translate(sm.canvas.width / 2, sm.canvas.height / 2);
      },
      
      drawPolygonConst: function (polygon, x, y, fill, rotation) {
        SVec.setVec(tmpVec, x, y);
        this.drawPolygon(polygon, tmpVec, fill, rotation);
      },

      drawPolygon: function (polygon, pos, fill, rotation) {
        if (!pos) {
          pos = tmpVec;
        }
        sm.ctx.translate(pos.x, -pos.y);
        sm.ctx.rotate(rotation);
        sm.ctx.beginPath();
        if (!polygon.pts) {
          console.error('No property of name [pts] found on polygon parameter.');
        } else {
          var firstPt = polygon.pts[0];
          sm.ctx.moveTo(firstPt.x, -firstPt.y);
          polygon.pts.forEach(function (pt) {
            if (pt !== firstPt) {
              sm.ctx.lineTo(pt.x , -pt.y);
            }
          });
          sm.ctx.lineTo(firstPt.x, -firstPt.y);
        }
        sm.ctx.closePath();
        sm.ctx.stroke();
        if (fill) {
          sm.ctx.fill();
        }
        sm.ctx.rotate(-rotation);
        sm.ctx.translate(-pos.x, pos.y);
      },

      clipPoly: function (polygon, pos, rotation) {
        sm.ctx.translate(pos.x, -pos.y);
        sm.ctx.rotate(rotation);
        sm.ctx.beginPath();
        if (!polygon.pts) {
          console.error('No property of name [pts] found on polygon parameter.');
        } else {
          var firstPt = polygon.pts[0];
          sm.ctx.moveTo(firstPt.x, firstPt.y);
          polygon.pts.forEach(function (pt) {
            if (pt !== firstPt) {
              sm.ctx.lineTo(pt.x , pt.y);
            }
          });
          sm.ctx.lineTo(firstPt.x, firstPt.y);
        }
        sm.ctx.closePath();
        sm.ctx.clip();
        sm.ctx.rotate(-rotation);
        sm.ctx.translate(-pos.x, pos.y);
      },

      drawImage: function (image, x, y, w, h, flipped) {
        if (image) {
          if (flipped) {
            sm.ctx.translate(x + image.width, 0);
            sm.ctx.scale(-1,1);
            sm.ctx.drawImage(image, 0, y);
          } else {
            sm.ctx.drawImage(image, x, y);
          }
        }
      },

      loadImage: function (handle, callback) {
        var img = new Image();
        if (sm.activeProgram) {
          img.src = sm.activeProgram.resourceDir + '/' + handle;
        } else {
          img.src = sm.conf.resourceDir + '/' + handle;
        }
        img.onload = callback;
      },

      preDraw: function () {
        sm.gfx.width = sm.canvas.width;
        sm.gfx.height = sm.canvas.height;
        sm.ctx.save();
      },

      postDraw: function () {
        sm.ctx.restore();
      },

      drawRect: function (x, y, w, h, fill, rotation, noAlign) {
        sm.ctx.beginPath();
        sm.ctx.fillStyle = 'white';
        var adj;

        if (!noAlign) {
          adj = Align.center(x, y, w, h);
        } else {
          adj = { x: x, y: y};
        }
        var transX = adj.x + (w / 2);
        var transY = adj.y + (h / 2);
        sm.ctx.translate(transX, -transY);
        sm.ctx.rotate(rotation / DEG_RAD);
        sm.ctx.rect(-(w / 2), -(h / 2), w, h);
        if (fill) {
          sm.ctx.fill();
        }
        sm.ctx.stroke();
        sm.ctx.closePath();
        sm.ctx.rotate(- (rotation / DEG_RAD));
        sm.ctx.translate(-transX, transY);
      },

      drawRectVec: function (vec, w, h, fill, rotation) {
        sm.ctx.beginPath();
        sm.ctx.fillStyle = 'white';
        var x = vec.x;
        var y = vec.y;
        var adj = Align.center(x, y, w, h);
        var transX = adj.x + (w / 2);
        var transY = adj.y + (h / 2);
        sm.ctx.translate(transX, transY);
        sm.ctx.rotate(rotation / DEG_RAD);
        sm.ctx.rect(-(w / 2), -(h / 2), w, h);
        if (fill) {
          sm.ctx.fill();
        }
        sm.ctx.stroke();
        sm.ctx.closePath();
        sm.ctx.rotate(- (rotation / DEG_RAD));
        sm.ctx.translate(-transX, -transY);
      },

      drawLineVec: function (ptA, ptB) {
        sm.ctx.beginPath();
        sm.ctx.moveTo(ptA.x, -ptA.y);
        sm.ctx.lineTo(ptB.x, -ptB.y);
        sm.ctx.stroke();
        sm.ctx.closePath();
      },

      drawLine: function (x1, y1, x2, y2) {
        sm.ctx.beginPath();
        sm.ctx.moveTo(x1, -y1);
        sm.ctx.lineTo(x2, -y2);
        sm.ctx.stroke();
        sm.ctx.closePath();
      },

      drawVec: function (vec) {
        sm.ctx.beginPath();
        sm.ctx.moveTo(0, 0);
        sm.ctx.lineTo(vec.x, -vec.y);
        sm.ctx.stroke();
        sm.ctx.closePath();
      },

      drawPtVec: function (pt, vec) {
        sm.ctx.beginPath();
        sm.ctx.moveTo(pt.x, -pt.y);
        sm.ctx.lineTo(pt.x + vec.x, -pt.y - vec.y);
        sm.ctx.stroke();
        sm.ctx.closePath();
      },

      drawCircle: function (x, y, radius) {
        sm.ctx.beginPath();
        sm.ctx.arc(x, -y, radius, 0, Math.PI * 2);
        sm.ctx.stroke();
        sm.ctx.closePath();
      },

      drawCircleVec: function (pos, radius) {
        sm.ctx.beginPath();
        sm.ctx.arc(pos.x, -pos.y, radius, 0, Math.PI * 2);
        sm.ctx.stroke();
        sm.ctx.fill();
        sm.ctx.closePath();
      },

      setStrokeColor: function (color) {
        sm.ctx.strokeStyle = color;
      },

      setStrokeWidth: function (width) {
        sm.ctx.lineWidth = width;
      },

      setFillColor: function (color) {
        sm.ctx.fillStyle = color;
      },

      setTextColor: function (color) {
        this.textConf.color = color;
      },

      setTextConf: function (conf) {
        this.textConf = conf;
        var keys = Object.keys(conf);
        keys.forEach(function (key) {
          if (conf[key]) {
            sm.gfx.textConf[key] = conf[key];
          }
        });
        this._processTextConf();
      },

      _processTextConf : function () {
        var conf = sm.gfx.textConf;
        var size = conf.size;
        var font = conf.font;
        var style = conf.style;
        var weight = 'normal';
        var align = conf.align;
        var color = conf.color;
        if (!color) {
          conf.color = sc.color.white;
        }
        var styleString = '';

        styleString += (style ? style : 'normal') + ' ';
        styleString += (weight ? weight : 'normal') + ' ';
        styleString += (size ? size : '12') + 'px ';
        styleString += (font ? font : 'arial') + ' ';

        sm.ctx.textBaseline = 'middle';
        sm.ctx.textAlign = align ? align : 'center';
        sm.ctx.font = styleString;
      },

      text: function (msgs, x, y, rotation) {
        this._processTextConf();
        var currentColor = sm.ctx.fillStyle;
        var fontSize = sm.gfx.textConf.size;

        y = y ? -y : 0;
        x = x ? x : 0;

        sm.gfx.setFillColor(this.textConf.color);
        if (msgs.forEach) {
          sm.ctx.save();
          sm.ctx.translate(x, y);
          sm.ctx.rotate(rotation);
          msgs.forEach(function (msg, index) {
            sm.ctx.fillText(msg, 0, (index * fontSize));
          });
          sm.ctx.restore();
        } else {
          sm.ctx.save();
          sm.ctx.translate(x, y);
          sm.ctx.rotate(rotation);
          sm.ctx.fillText(msgs, 0, 0);
          sm.ctx.restore();
        }

        if (currentColor) {
          sm.gfx.setFillColor(currentColor);
        }
      }
    },

    music: {
      playingTracks: [],
      loadTrack: function (location) {
        var track = new Audio(location);
        this.playingTracks.push(track);
        track.loop = true;
        return track;
      },

      playTrack: function () {

      }
    },

    sfx: {
      ctx: new (window.AudioContext || window.webkitAudioContext)(),
      beep: function (note) {
        var oscillator = this.ctx.createOscillator();
        var gainNode = this.ctx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        gainNode.gain.value = .025;
        oscillator.frequency.value = note ? note : 440;
        oscillator.type = 'square';
        oscillator.start();
        setTimeout(
            function () {
              oscillator.stop();
            },
            200
        );
      },
      loadSound: function (location) {
        return new Audio(location);
      },

      playSound: function (sound) {
        sound.play();
      }
    },

    init: function (canvasMountId, program) {
      this.log.notify('Mounting @ ' + canvasMountId + '...', sm.context);
      var mountPoint = document.getElementById(canvasMountId);

      if (mountPoint && mountPoint.tagName.toLowerCase() === 'canvas') {
        this.ctx = mountPoint.getContext('2d');
        this.canvas = mountPoint;
        window.requestAnimationFrame(this.appLoop);
      } else {
        this.log.error(console.error('Specified Mount Point: ' + canvasMountId + ' is not a canvas.'), sm.context);
      }

      sm.gfx.width = sm.canvas.width;
      sm.gfx.height = sm.canvas.height;

      sm.input.init();
      sm.input.update();
      if (program) {
        sm.loadProgram(program);
      }
    },

    loadV2Program: function (program) {
      var conf = program.conf;

      if (!conf) {
        sm.log.error('No conf found on provided program.');
        return -1;
      } else {
        sm.log.notify('Loading Program: ' + conf.name + '...', sm.context);
        if (sm.activeProgram) {
          sm.unloadProgram();
        }
        sm.activeProgram = program;
        program.setup();

        document.body.dispatchEvent(new CustomEvent('smProgramLoaded',
            {
              'detail': {
                'name': conf.name,
                'description': conf.description
              }
            })
        );
      }
    },

    unloadProgram: function () {
      sm.music.playingTracks.forEach(function (track) {
        track.pause();
        track.currentTime = 0;
      });

      if (!sm.activeProgram) {
        sm.log.notify('Nothing to unload. Did you load a program?', sm.context);
      } else {
        var name = sm.activeProgram.conf.name;
        sm.log.notify('Unloading: ' + name + '...', sm.context);
        sm.activeProgram = undefined;
        document.body.dispatchEvent(
            new CustomEvent('smProgramUnloaded', {'detail': {'programName': name}})
        );
      }
    },

    appLoop: function () {
      sm.time.update();
      sm.input.update();

      sm.gfx.clear(sc.color.dark_blue);

      sm.gfx.preDraw();
      sm.gfx.setTextConf({});
      if (sm.activeProgram) {
        if (!sm.conf.paused ) {
          sm.ctx.translate(sm.canvas.width / 2, sm.canvas.height / 2);
          // sm.activeProgram.update(sm.time.delta, sm.gfx);
          sm.ctx.translate(-sm.canvas.width / 2, -sm.canvas.height / 2);
        } else {
          sm.gfx.setFillColor(sc.color.green);
          sm.gfx.text(true, 'SM-PAUSED', 0, 0);
        }
      }
      sm.gfx.postDraw();
      sm.ctx.translate(sm.canvas.width / 2, sm.canvas.height / 2 );

      // Render Log
      if (!sm.activeProgram || (sm.conf.debug.logConsole.logInProgram && sm.conf.debug.active)) {
        if (sm.activeProgram) {
					sm.gfx.setFillColor(sm.conf.debug.logConsole.color);
				} else {
					sm.gfx.setFillColor(sc.color.white);
        }
        var viewPortW = sm.canvas.width;
        var viewPortH = sm.canvas.height;
        var padding = sm.conf.debug.logConsole.padding;
        var offsetW = viewPortW * padding;
        var offsetH = viewPortH * padding;
        sm.gfx.setTextConf(sm.conf.debug.logConsole.textConf);
        sm.logs.reverse();
        sm.gfx.text(
            sm.logs,
            (-viewPortW / 2) + offsetW,
            ((viewPortH / 2) - offsetH * 2)
        );
        sm.logs.reverse();
      }

      // Reset State and Input
      sm.ctx.translate(-sm.canvas.width / 2, -sm.canvas.height / 2 );
      sm.checkIfMobile();

      if (!sm.breakOnNextLoop) {
        window.requestAnimationFrame(sm.appLoop);
      } else {
        sm.breakOnNextLoop = false;
        sm.unloadProgram();
        console.log('Logs can be found at sm.logs.');
        sm.ctx.save();
        sm.ctx.fillStyle = '#000000';
        sm.ctx.fillRect(0, 0, sm.canvas.width, sm.canvas.height);
      }
    }
  };
})();

