// setImmediate
if (!window.setImmediate) {
  window.setImmediate = (function setupSetImmediate() {
    return (
      window.msSetImmediate ||
      window.webkitSetImmediate ||
      window.mozSetImmediate ||
      window.oSetImmediate ||
      (function setupSetZeroTimeout() {
        if (!window.postMessage || !window.addEventListener) {
          return null;
        }

        const callbacks = [undefined];
        const message = 'zero-timeout-message';

        // Like setTimeout, but only takes a function argument.  There's
        // no time argument (always zero) and no arguments (you have to
        // use a closure).
        const setZeroTimeout = function setZeroTimeout(callback) {
          const id = callbacks.length;
          callbacks.push(callback);
          window.postMessage(message + id.toString(36), '*');

          return id;
        };

        window.addEventListener(
          'message',
          function setZeroTimeoutMessage(evt) {
            // Skipping checking event source, retarded IE confused this window
            // object with another in the presence of iframe
            if (
              typeof evt.data !== 'string' ||
              evt.data.substr(0, message.length) !== message /* ||
            evt.source !== window */
            ) {
              return;
            }

            evt.stopImmediatePropagation();

            const id = Number.parseInt(evt.data.substr(message.length), 36);
            if (!callbacks[id]) {
              return;
            }

            callbacks[id]();
            callbacks[id] = undefined;
          },
          true,
        );

        /* specify clearImmediate() here since we need the scope */
        window.clearImmediate = function clearZeroTimeout(id) {
          if (!callbacks[id]) {
            return;
          }

          callbacks[id] = undefined;
        };

        return setZeroTimeout;
      })() ||
      // fallback
      function setImmediateFallback(fn) {
        window.setTimeout(fn, 0);
      }
    );
  })();
}

if (!window.clearImmediate) {
  window.clearImmediate = (function setupClearImmediate() {
    return (
      window.msClearImmediate ||
      window.webkitClearImmediate ||
      window.mozClearImmediate ||
      window.oClearImmediate ||
      // "clearZeroTimeout" is implement on the previous block ||
      // fallback
      function clearImmediateFallback(timer) {
        window.clearTimeout(timer);
      }
    );
  })();
}

((global) => {
  // Check if WordCloud can run on this browser
  const isSupported = (function isSupported() {
    const canvas = document.createElement('canvas');
    if (!canvas || !canvas.getContext) {
      return false;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return false;
    }
    if (!ctx.getImageData) {
      return false;
    }
    if (!ctx.fillText) {
      return false;
    }

    if (!Array.prototype.some) {
      return false;
    }
    if (!Array.prototype.push) {
      return false;
    }

    return true;
  })();

  // Find out if the browser impose minium font size by
  // drawing small texts on a canvas and measure it's width.
  const minFontSize = (function getMinFontSize() {
    if (!isSupported) {
      return;
    }

    const ctx = document.createElement('canvas').getContext('2d');

    // start from 20
    let size = 20;

    // two sizes to measure
    let hanWidth;
    let mWidth;

    while (size) {
      ctx.font = `${size.toString(10)}px sans-serif`;
      if (ctx.measureText('\uFF37').width === hanWidth && ctx.measureText('m').width === mWidth) {
        return size + 1;
      }

      hanWidth = ctx.measureText('\uFF37').width;
      mWidth = ctx.measureText('m').width;

      size--;
    }

    return 0;
  })();

  // Based on http://jsfromhell.com/array/shuffle
  const shuffleArray = function shuffleArray(arr) {
    for (let j, x, i = arr.length; i; j = Math.floor(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x) {}
    return arr;
  };

  const WordCloud = function WordCloud(elements, options) {
    if (!isSupported) {
      return;
    }

    if (!Array.isArray(elements)) {
      elements = [elements];
    }

    elements.forEach((el, i) => {
      if (typeof el === 'string') {
        elements[i] = document.getElementById(el);
        if (!elements[i]) {
          throw 'The element id specified is not found.';
        }
      } else if (!el.tagName && !el.appendChild) {
        throw 'You must pass valid HTML elements, or ID of the element.';
      }
    });

    /* Default values to be overwritten by options object */
    const settings = {
      list: [],
      fontFamily:
        '"Trebuchet MS", "Heiti TC", "微軟正黑體", ' + '"Arial Unicode MS", "Droid Fallback Sans", sans-serif',
      fontWeight: 'normal',
      color: 'random-dark',
      minSize: 0, // 0 to disable
      weightFactor: 1,
      clearCanvas: true,
      backgroundColor: '#fff', // opaque white = rgba(255, 255, 255, 1)

      gridSize: 8,
      drawOutOfBound: false,
      shrinkToFit: false,
      origin: null,

      drawMask: false,
      maskColor: 'rgba(255,0,0,0.3)',
      maskGapWidth: 0.3,

      wait: 0,
      abortThreshold: 0, // disabled
      abort: function noop() {},

      minRotation: -Math.PI / 2,
      maxRotation: Math.PI / 2,
      rotationSteps: 0,

      shuffle: true,
      rotateRatio: 0.1,

      shape: 'circle',
      ellipticity: 0.65,

      classes: null,

      hover: null,
      click: null,
    };

    if (options) {
      for (const key in options) {
        if (key in settings) {
          settings[key] = options[key];
        }
      }
    }

    /* Convert weightFactor into a function */
    if (typeof settings.weightFactor !== 'function') {
      const factor = settings.weightFactor;
      settings.weightFactor = function weightFactor(pt) {
        return pt * factor; //in px
      };
    }

    /* Convert shape into a function */
    if (typeof settings.shape !== 'function') {
      switch (settings.shape) {
        /* falls through */
        default:
          // 'circle' is the default and a shortcut in the code loop.
          settings.shape = 'circle';
          break;

        case 'cardioid':
          settings.shape = function shapeCardioid(theta) {
            return 1 - Math.sin(theta);
          };
          break;

        /*

        To work out an X-gon, one has to calculate "m",
        where 1/(cos(2*PI/X)+m*sin(2*PI/X)) = 1/(cos(0)+m*sin(0))
        http://www.wolframalpha.com/input/?i=1%2F%28cos%282*PI%2FX%29%2Bm*sin%28
        2*PI%2FX%29%29+%3D+1%2F%28cos%280%29%2Bm*sin%280%29%29

        Copy the solution into polar equation r = 1/(cos(t') + m*sin(t'))
        where t' equals to mod(t, 2PI/X);

        */

        case 'diamond':
          // http://www.wolframalpha.com/input/?i=plot+r+%3D+1%2F%28cos%28mod+
          // %28t%2C+PI%2F2%29%29%2Bsin%28mod+%28t%2C+PI%2F2%29%29%29%2C+t+%3D
          // +0+..+2*PI
          settings.shape = function shapeSquare(theta) {
            const thetaPrime = theta % ((2 * Math.PI) / 4);
            return 1 / (Math.cos(thetaPrime) + Math.sin(thetaPrime));
          };
          break;

        case 'square':
          // http://www.wolframalpha.com/input/?i=plot+r+%3D+min(1%2Fabs(cos(t
          // )),1%2Fabs(sin(t)))),+t+%3D+0+..+2*PI
          settings.shape = function shapeSquare(theta) {
            return Math.min(1 / Math.abs(Math.cos(theta)), 1 / Math.abs(Math.sin(theta)));
          };
          break;

        case 'triangle-forward':
          // http://www.wolframalpha.com/input/?i=plot+r+%3D+1%2F%28cos%28mod+
          // %28t%2C+2*PI%2F3%29%29%2Bsqrt%283%29sin%28mod+%28t%2C+2*PI%2F3%29
          // %29%29%2C+t+%3D+0+..+2*PI
          settings.shape = function shapeTriangle(theta) {
            const thetaPrime = theta % ((2 * Math.PI) / 3);
            return 1 / (Math.cos(thetaPrime) + Math.sqrt(3) * Math.sin(thetaPrime));
          };
          break;

        case 'triangle':
        case 'triangle-upright':
          settings.shape = function shapeTriangle(theta) {
            const thetaPrime = (theta + (Math.PI * 3) / 2) % ((2 * Math.PI) / 3);
            return 1 / (Math.cos(thetaPrime) + Math.sqrt(3) * Math.sin(thetaPrime));
          };
          break;

        case 'pentagon':
          settings.shape = function shapePentagon(theta) {
            const thetaPrime = (theta + 0.955) % ((2 * Math.PI) / 5);
            return 1 / (Math.cos(thetaPrime) + 0.726543 * Math.sin(thetaPrime));
          };
          break;

        case 'star':
          settings.shape = function shapeStar(theta) {
            const thetaPrime = (theta + 0.955) % ((2 * Math.PI) / 10);
            if (((theta + 0.955) % ((2 * Math.PI) / 5)) - (2 * Math.PI) / 10 >= 0) {
              return (
                1 / (Math.cos((2 * Math.PI) / 10 - thetaPrime) + 3.07768 * Math.sin((2 * Math.PI) / 10 - thetaPrime))
              );
            }
            return 1 / (Math.cos(thetaPrime) + 3.07768 * Math.sin(thetaPrime));
          };
          break;
      }
    }

    /* Make sure gridSize is a whole number and is not smaller than 4px */
    settings.gridSize = Math.max(Math.floor(settings.gridSize), 4);

    /* shorthand */
    const g = settings.gridSize;
    const maskRectWidth = g - settings.maskGapWidth;

    /* normalize rotation settings */
    const rotationRange = Math.abs(settings.maxRotation - settings.minRotation);
    const rotationSteps = Math.abs(Math.floor(settings.rotationSteps));
    const minRotation = Math.min(settings.maxRotation, settings.minRotation);

    /* information/object available to all functions, set when start() */
    let grid; // 2d array containing filling information
    let ngx;
    let ngy; // width and height of the grid
    let center; // position of the center of the cloud
    let maxRadius;

    /* timestamp for measuring each putWord() action */
    let escapeTime;

    /* function for getting the color of the text */
    let getTextColor;
    function random_hsl_color(min, max) {
      return `hsl(${(Math.random() * 360).toFixed()},${(Math.random() * 30 + 70).toFixed()}%,${(Math.random() * (max - min) + min).toFixed()}%)`;
    }
    switch (settings.color) {
      case 'random-dark':
        getTextColor = function getRandomDarkColor() {
          return random_hsl_color(10, 50);
        };
        break;

      case 'random-light':
        getTextColor = function getRandomLightColor() {
          return random_hsl_color(50, 90);
        };
        break;

      default:
        if (typeof settings.color === 'function') {
          getTextColor = settings.color;
        }
        break;
    }

    /* function for getting the font-weight of the text */
    let getTextFontWeight;
    if (typeof settings.fontWeight === 'function') {
      getTextFontWeight = settings.fontWeight;
    }

    /* function for getting the classes of the text */
    let getTextClasses = null;
    if (typeof settings.classes === 'function') {
      getTextClasses = settings.classes;
    }

    /* Interactive */
    let interactive = false;
    const infoGrid = [];
    let hovered;

    const getInfoGridFromMouseTouchEvent = function getInfoGridFromMouseTouchEvent(evt) {
      const canvas = evt.currentTarget;
      const rect = canvas.getBoundingClientRect();
      let clientX;
      let clientY;
      /** Detect if touches are available */
      if (evt.touches) {
        clientX = evt.touches[0].clientX;
        clientY = evt.touches[0].clientY;
      } else {
        clientX = evt.clientX;
        clientY = evt.clientY;
      }
      const eventX = clientX - rect.left;
      const eventY = clientY - rect.top;

      const x = Math.floor((eventX * (canvas.width / rect.width || 1)) / g);
      const y = Math.floor((eventY * (canvas.height / rect.height || 1)) / g);

      return infoGrid[x][y];
    };

    const wordcloudhover = function wordcloudhover(evt) {
      const info = getInfoGridFromMouseTouchEvent(evt);

      if (hovered === info) {
        return;
      }

      hovered = info;
      if (!info) {
        settings.hover(undefined, undefined, evt);

        return;
      }

      settings.hover(info.item, info.dimension, evt);
    };

    const wordcloudclick = function wordcloudclick(evt) {
      const info = getInfoGridFromMouseTouchEvent(evt);
      if (!info) {
        return;
      }

      settings.click(info.item, info.dimension, evt);
      evt.preventDefault();
    };

    /* Get points on the grid for a given radius away from the center */
    const pointsAtRadius = [];
    const getPointsAtRadius = function getPointsAtRadius(radius) {
      if (pointsAtRadius[radius]) {
        return pointsAtRadius[radius];
      }

      // Look for these number of points on each radius
      const T = radius * 8;

      // Getting all the points at this radius
      let t = T;
      const points = [];

      if (radius === 0) {
        points.push([center[0], center[1], 0]);
      }

      while (t--) {
        // distort the radius to put the cloud in shape
        let rx = 1;
        if (settings.shape !== 'circle') {
          rx = settings.shape((t / T) * 2 * Math.PI); // 0 to 1
        }

        // Push [x, y, t]; t is used solely for getTextColor()
        points.push([
          center[0] + radius * rx * Math.cos((-t / T) * 2 * Math.PI),
          center[1] + radius * rx * Math.sin((-t / T) * 2 * Math.PI) * settings.ellipticity,
          (t / T) * 2 * Math.PI,
        ]);
      }

      pointsAtRadius[radius] = points;
      return points;
    };

    /* Return true if we had spent too much time */
    const exceedTime = function exceedTime() {
      return settings.abortThreshold > 0 && new Date().getTime() - escapeTime > settings.abortThreshold;
    };

    /* Get the deg of rotation according to settings, and luck. */
    const getRotateDeg = function getRotateDeg() {
      if (settings.rotateRatio === 0) {
        return 0;
      }

      if (Math.random() > settings.rotateRatio) {
        return 0;
      }

      if (rotationRange === 0) {
        return minRotation;
      }

      if (rotationSteps > 0) {
        // Min rotation + zero or more steps * span of one step
        return minRotation + (Math.floor(Math.random() * rotationSteps) * rotationRange) / (rotationSteps - 1);
      }
      return minRotation + Math.random() * rotationRange;
    };

    const getTextInfo = function getTextInfo(word, weight, rotateDeg) {
      // calculate the acutal font size
      // fontSize === 0 means weightFactor function wants the text skipped,
      // and size < minSize means we cannot draw the text.
      const debug = false;
      const fontSize = settings.weightFactor(weight);
      if (fontSize <= settings.minSize) {
        return false;
      }

      // Scale factor here is to make sure fillText is not limited by
      // the minium font size set by browser.
      // It will always be 1 or 2n.
      let mu = 1;
      if (fontSize < minFontSize) {
        mu = (function calculateScaleFactor() {
          let mu = 2;
          while (mu * fontSize < minFontSize) {
            mu += 2;
          }
          return mu;
        })();
      }

      // Get fontWeight that will be used to set fctx.font
      let fontWeight;
      if (getTextFontWeight) {
        fontWeight = getTextFontWeight(word, weight, fontSize);
      } else {
        fontWeight = settings.fontWeight;
      }

      const fcanvas = document.createElement('canvas');
      const fctx = fcanvas.getContext('2d', { willReadFrequently: true });

      fctx.font = `${fontWeight} ${(fontSize * mu).toString(10)}px ${settings.fontFamily}`;

      // Estimate the dimension of the text with measureText().
      const fw = fctx.measureText(word).width / mu;
      const fh = Math.max(fontSize * mu, fctx.measureText('m').width, fctx.measureText('\uFF37').width) / mu;

      // Create a boundary box that is larger than our estimates,
      // so text don't get cut of (it sill might)
      let boxWidth = fw + fh * 2;
      let boxHeight = fh * 3;
      const fgw = Math.ceil(boxWidth / g);
      const fgh = Math.ceil(boxHeight / g);
      boxWidth = fgw * g;
      boxHeight = fgh * g;

      // Calculate the proper offsets to make the text centered at
      // the preferred position.

      // This is simply half of the width.
      const fillTextOffsetX = -fw / 2;
      // Instead of moving the box to the exact middle of the preferred
      // position, for Y-offset we move 0.4 instead, so Latin alphabets look
      // vertical centered.
      const fillTextOffsetY = -fh * 0.4;

      // Calculate the actual dimension of the canvas, considering the rotation.
      const cgh = Math.ceil((boxWidth * Math.abs(Math.sin(rotateDeg)) + boxHeight * Math.abs(Math.cos(rotateDeg))) / g);
      const cgw = Math.ceil((boxWidth * Math.abs(Math.cos(rotateDeg)) + boxHeight * Math.abs(Math.sin(rotateDeg))) / g);
      const width = cgw * g;
      const height = cgh * g;

      fcanvas.setAttribute('width', width);
      fcanvas.setAttribute('height', height);

      if (debug) {
        // Attach fcanvas to the DOM
        document.body.appendChild(fcanvas);
        // Save it's state so that we could restore and draw the grid correctly.
        fctx.save();
      }

      // Scale the canvas with |mu|.
      fctx.scale(1 / mu, 1 / mu);
      fctx.translate((width * mu) / 2, (height * mu) / 2);
      fctx.rotate(-rotateDeg);

      // Once the width/height is set, ctx info will be reset.
      // Set it again here.
      fctx.font = `${fontWeight} ${(fontSize * mu).toString(10)}px ${settings.fontFamily}`;

      // Fill the text into the fcanvas.
      // XXX: We cannot because textBaseline = 'top' here because
      // Firefox and Chrome uses different default line-height for canvas.
      // Please read https://bugzil.la/737852#c6.
      // Here, we use textBaseline = 'middle' and draw the text at exactly
      // 0.5 * fontSize lower.
      fctx.fillStyle = '#000';
      fctx.textBaseline = 'middle';
      fctx.fillText(word, fillTextOffsetX * mu, (fillTextOffsetY + fontSize * 0.5) * mu);

      // Get the pixels of the text
      const imageData = fctx.getImageData(0, 0, width, height).data;

      if (exceedTime()) {
        return false;
      }

      if (debug) {
        // Draw the box of the original estimation
        fctx.strokeRect(fillTextOffsetX * mu, fillTextOffsetY, fw * mu, fh * mu);
        fctx.restore();
      }

      // Read the pixels and save the information to the occupied array
      const occupied = [];
      let gx = cgw;
      let gy;
      let x;
      let y;
      const bounds = [cgh / 2, cgw / 2, cgh / 2, cgw / 2];
      while (gx--) {
        gy = cgh;
        while (gy--) {
          y = g;
          singleGridLoop: {
            while (y--) {
              x = g;
              while (x--) {
                if (imageData[((gy * g + y) * width + (gx * g + x)) * 4 + 3]) {
                  occupied.push([gx, gy]);

                  if (gx < bounds[3]) {
                    bounds[3] = gx;
                  }
                  if (gx > bounds[1]) {
                    bounds[1] = gx;
                  }
                  if (gy < bounds[0]) {
                    bounds[0] = gy;
                  }
                  if (gy > bounds[2]) {
                    bounds[2] = gy;
                  }

                  if (debug) {
                    fctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
                    fctx.fillRect(gx * g, gy * g, g - 0.5, g - 0.5);
                  }
                  break singleGridLoop;
                }
              }
            }
            if (debug) {
              fctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
              fctx.fillRect(gx * g, gy * g, g - 0.5, g - 0.5);
            }
          }
        }
      }

      if (debug) {
        fctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
        fctx.fillRect(bounds[3] * g, bounds[0] * g, (bounds[1] - bounds[3] + 1) * g, (bounds[2] - bounds[0] + 1) * g);
      }

      // Return information needed to create the text on the real canvas
      return {
        mu: mu,
        occupied: occupied,
        bounds: bounds,
        gw: cgw,
        gh: cgh,
        fillTextOffsetX: fillTextOffsetX,
        fillTextOffsetY: fillTextOffsetY,
        fillTextWidth: fw,
        fillTextHeight: fh,
        fontSize: fontSize,
      };
    };

    /* Determine if there is room available in the given dimension */
    const canFitText = function canFitText(gx, gy, gw, gh, occupied) {
      // Go through the occupied points,
      // return false if the space is not available.
      let i = occupied.length;
      while (i--) {
        const px = gx + occupied[i][0];
        const py = gy + occupied[i][1];

        if (px >= ngx || py >= ngy || px < 0 || py < 0) {
          if (!settings.drawOutOfBound) {
            return false;
          }
          continue;
        }

        if (!grid[px][py]) {
          return false;
        }
      }
      return true;
    };

    /* Actually draw the text on the grid */
    const drawText = function drawText(gx, gy, info, word, weight, distance, theta, rotateDeg, attributes) {
      const fontSize = info.fontSize;
      let color;
      if (getTextColor) {
        color = getTextColor(word, weight, fontSize, distance, theta);
      } else {
        color = settings.color;
      }

      // get fontWeight that will be used to set ctx.font and font style rule
      let fontWeight;
      if (getTextFontWeight) {
        fontWeight = getTextFontWeight(word, weight, fontSize);
      } else {
        fontWeight = settings.fontWeight;
      }

      let classes;
      if (getTextClasses) {
        classes = getTextClasses(word, weight, fontSize);
      } else {
        classes = settings.classes;
      }

      let dimension;
      const bounds = info.bounds;
      dimension = {
        x: (gx + bounds[3]) * g,
        y: (gy + bounds[0]) * g,
        w: (bounds[1] - bounds[3] + 1) * g,
        h: (bounds[2] - bounds[0] + 1) * g,
      };

      elements.forEach((el) => {
        if (el.getContext) {
          const ctx = el.getContext('2d');
          const mu = info.mu;

          // Save the current state before messing it
          ctx.save();
          ctx.scale(1 / mu, 1 / mu);

          ctx.font = `${fontWeight} ${(fontSize * mu).toString(10)}px ${settings.fontFamily}`;
          ctx.fillStyle = color;

          // Translate the canvas position to the origin coordinate of where
          // the text should be put.
          ctx.translate((gx + info.gw / 2) * g * mu, (gy + info.gh / 2) * g * mu);

          if (rotateDeg !== 0) {
            ctx.rotate(-rotateDeg);
          }

          // Finally, fill the text.

          // XXX: We cannot because textBaseline = 'top' here because
          // Firefox and Chrome uses different default line-height for canvas.
          // Please read https://bugzil.la/737852#c6.
          // Here, we use textBaseline = 'middle' and draw the text at exactly
          // 0.5 * fontSize lower.
          ctx.textBaseline = 'middle';
          ctx.fillText(word, info.fillTextOffsetX * mu, (info.fillTextOffsetY + fontSize * 0.5) * mu);

          // The below box is always matches how <span>s are positioned
          /* ctx.strokeRect(info.fillTextOffsetX, info.fillTextOffsetY,
            info.fillTextWidth, info.fillTextHeight); */

          // Restore the state.
          ctx.restore();
        } else {
          // drawText on DIV element
          const span = document.createElement('span');
          let transformRule = '';
          transformRule = `rotate(${(-rotateDeg / Math.PI) * 180}deg) `;
          if (info.mu !== 1) {
            transformRule += `translateX(-${info.fillTextWidth / 4}px) scale(${1 / info.mu})`;
          }
          const styleRules = {
            position: 'absolute',
            display: 'block',
            font: `${fontWeight} ${fontSize * info.mu}px ${settings.fontFamily}`,
            left: `${(gx + info.gw / 2) * g + info.fillTextOffsetX}px`,
            top: `${(gy + info.gh / 2) * g + info.fillTextOffsetY}px`,
            width: `${info.fillTextWidth}px`,
            height: `${info.fillTextHeight}px`,
            lineHeight: `${fontSize}px`,
            whiteSpace: 'nowrap',
            transform: transformRule,
            webkitTransform: transformRule,
            msTransform: transformRule,
            transformOrigin: '50% 40%',
            webkitTransformOrigin: '50% 40%',
            msTransformOrigin: '50% 40%',
          };
          if (color) {
            styleRules.color = color;
          }
          span.textContent = word;
          for (const cssProp in styleRules) {
            span.style[cssProp] = styleRules[cssProp];
          }
          if (attributes) {
            for (const attribute in attributes) {
              span.setAttribute(attribute, attributes[attribute]);
            }
          }
          if (classes) {
            span.className += classes;
          }
          el.appendChild(span);
        }
      });
    };

    /* Help function to updateGrid */
    const fillGridAt = function fillGridAt(x, y, drawMask, dimension, item) {
      if (x >= ngx || y >= ngy || x < 0 || y < 0) {
        return;
      }

      grid[x][y] = false;

      if (drawMask) {
        const ctx = elements[0].getContext('2d');
        ctx.fillRect(x * g, y * g, maskRectWidth, maskRectWidth);
      }

      if (interactive) {
        infoGrid[x][y] = { item: item, dimension: dimension };
      }
    };

    /* Update the filling information of the given space with occupied points.
       Draw the mask on the canvas if necessary. */
    const updateGrid = function updateGrid(gx, gy, gw, gh, info, item) {
      const occupied = info.occupied;
      const drawMask = settings.drawMask;
      let ctx;
      if (drawMask) {
        ctx = elements[0].getContext('2d');
        ctx.save();
        ctx.fillStyle = settings.maskColor;
      }

      let dimension;
      if (interactive) {
        const bounds = info.bounds;
        dimension = {
          x: (gx + bounds[3]) * g,
          y: (gy + bounds[0]) * g,
          w: (bounds[1] - bounds[3] + 1) * g,
          h: (bounds[2] - bounds[0] + 1) * g,
        };
      }

      let i = occupied.length;
      while (i--) {
        const px = gx + occupied[i][0];
        const py = gy + occupied[i][1];

        if (px >= ngx || py >= ngy || px < 0 || py < 0) {
          continue;
        }

        fillGridAt(px, py, drawMask, dimension, item);
      }

      if (drawMask) {
        ctx.restore();
      }
    };

    /* putWord() processes each item on the list,
       calculate it's size and determine it's position, and actually
       put it on the canvas. */
    const putWord = function putWord(item) {
      let word;
      let weight;
      let attributes;
      if (Array.isArray(item)) {
        word = item[0];
        weight = item[1];
      } else {
        word = item.word;
        weight = item.weight;
        attributes = item.attributes;
      }
      const rotateDeg = getRotateDeg();

      // get info needed to put the text onto the canvas
      const info = getTextInfo(word, weight, rotateDeg);

      // not getting the info means we shouldn't be drawing this one.
      if (!info) {
        return false;
      }

      if (exceedTime()) {
        return false;
      }

      // If drawOutOfBound is set to false,
      // skip the loop if we have already know the bounding box of
      // word is larger than the canvas.
      if (!settings.drawOutOfBound) {
        const bounds = info.bounds;
        if (bounds[1] - bounds[3] + 1 > ngx || bounds[2] - bounds[0] + 1 > ngy) {
          return false;
        }
      }

      // Determine the position to put the text by
      // start looking for the nearest points
      let r = maxRadius + 1;

      const tryToPutWordAtPoint = (gxy) => {
        const gx = Math.floor(gxy[0] - info.gw / 2);
        const gy = Math.floor(gxy[1] - info.gh / 2);
        const gw = info.gw;
        const gh = info.gh;

        // If we cannot fit the text at this position, return false
        // and go to the next position.
        if (!canFitText(gx, gy, gw, gh, info.occupied)) {
          return false;
        }

        // Actually put the text on the canvas
        drawText(gx, gy, info, word, weight, maxRadius - r, gxy[2], rotateDeg, attributes);

        // Mark the spaces on the grid as filled
        updateGrid(gx, gy, gw, gh, info, item);

        // Return true so some() will stop and also return true.
        return true;
      };

      while (r--) {
        let points = getPointsAtRadius(maxRadius - r);

        if (settings.shuffle) {
          points = [].concat(points);
          shuffleArray(points);
        }

        // Try to fit the words by looking at each point.
        // array.some() will stop and return true
        // when putWordAtPoint() returns true.
        // If all the points returns false, array.some() returns false.
        const drawn = points.some(tryToPutWordAtPoint);

        if (drawn) {
          // leave putWord() and return true
          return true;
        }
      }
      if (settings.shrinkToFit) {
        if (Array.isArray(item)) {
          item[1] = (item[1] * 3) / 4;
        } else {
          item.weight = (item.weight * 3) / 4;
        }
        return putWord(item);
      }
      // we tried all distances but text won't fit, return false
      return false;
    };

    /* Send DOM event to all elements. Will stop sending event and return
       if the previous one is canceled (for cancelable events). */
    const sendEvent = function sendEvent(type, cancelable, details) {
      if (cancelable) {
        return !elements.some((el) => {
          const event = new CustomEvent(type, {
            detail: details || {},
          });
          return !el.dispatchEvent(event);
        }, this);
      }
      elements.forEach((el) => {
        const event = new CustomEvent(type, {
          detail: details || {},
        });
        el.dispatchEvent(event);
      }, this);
    };

    /* Start drawing on a canvas */
    const start = function start() {
      // For dimensions, clearCanvas etc.,
      // we only care about the first element.
      const canvas = elements[0];

      if (canvas.getContext) {
        ngx = Math.ceil(canvas.width / g);
        ngy = Math.ceil(canvas.height / g);
      } else {
        const rect = canvas.getBoundingClientRect();
        ngx = Math.ceil(rect.width / g);
        ngy = Math.ceil(rect.height / g);
      }

      // Sending a wordcloudstart event which cause the previous loop to stop.
      // Do nothing if the event is canceled.
      if (!sendEvent('wordcloudstart', true)) {
        return;
      }

      // Determine the center of the word cloud
      center = settings.origin ? [settings.origin[0] / g, settings.origin[1] / g] : [ngx / 2, ngy / 2];

      // Maxium radius to look for space
      maxRadius = Math.floor(Math.sqrt(ngx * ngx + ngy * ngy));

      /* Clear the canvas only if the clearCanvas is set,
         if not, update the grid to the current canvas state */
      grid = [];

      let gx;
      let gy;
      let i;
      if (!canvas.getContext || settings.clearCanvas) {
        elements.forEach((el) => {
          if (el.getContext) {
            const ctx = el.getContext('2d');
            ctx.fillStyle = settings.backgroundColor;
            ctx.clearRect(0, 0, ngx * (g + 1), ngy * (g + 1));
            ctx.fillRect(0, 0, ngx * (g + 1), ngy * (g + 1));
          } else {
            el.textContent = '';
            el.style.backgroundColor = settings.backgroundColor;
            el.style.position = 'relative';
          }
        });

        /* fill the grid with empty state */
        gx = ngx;
        while (gx--) {
          grid[gx] = [];
          gy = ngy;
          while (gy--) {
            grid[gx][gy] = true;
          }
        }
      } else {
        /* Determine bgPixel by creating
           another canvas and fill the specified background color. */
        let bctx = document.createElement('canvas').getContext('2d');

        bctx.fillStyle = settings.backgroundColor;
        bctx.fillRect(0, 0, 1, 1);
        let bgPixel = bctx.getImageData(0, 0, 1, 1).data;

        /* Read back the pixels of the canvas we got to tell which part of the
           canvas is empty.
           (no clearCanvas only works with a canvas, not divs) */
        let imageData = canvas.getContext('2d').getImageData(0, 0, ngx * g, ngy * g).data;

        gx = ngx;
        let x;
        let y;
        while (gx--) {
          grid[gx] = [];
          gy = ngy;
          while (gy--) {
            y = g;
            singleGridLoop: while (y--) {
              x = g;
              while (x--) {
                i = 4;
                while (i--) {
                  if (imageData[((gy * g + y) * ngx * g + (gx * g + x)) * 4 + i] !== bgPixel[i]) {
                    grid[gx][gy] = false;
                    break singleGridLoop;
                  }
                }
              }
            }
            if (grid[gx][gy] !== false) {
              grid[gx][gy] = true;
            }
          }
        }

        imageData = bctx = bgPixel = undefined;
      }

      // fill the infoGrid with empty state if we need it
      if (settings.hover || settings.click) {
        interactive = true;

        /* fill the grid with empty state */
        gx = ngx + 1;
        while (gx--) {
          infoGrid[gx] = [];
        }

        if (settings.hover) {
          canvas.addEventListener('mousemove', wordcloudhover);
        }

        if (settings.click) {
          canvas.addEventListener('click', wordcloudclick);
          canvas.style.webkitTapHighlightColor = 'rgba(0, 0, 0, 0)';
        }

        canvas.addEventListener('wordcloudstart', function stopInteraction() {
          canvas.removeEventListener('wordcloudstart', stopInteraction);

          canvas.removeEventListener('mousemove', wordcloudhover);
          canvas.removeEventListener('click', wordcloudclick);
          hovered = undefined;
        });
      }

      i = 0;
      let loopingFunction;
      let stoppingFunction;
      if (settings.wait !== 0) {
        loopingFunction = window.setTimeout;
        stoppingFunction = window.clearTimeout;
      } else {
        loopingFunction = window.setImmediate;
        stoppingFunction = window.clearImmediate;
      }

      const addEventListener = function addEventListener(type, listener) {
        elements.forEach((el) => {
          el.addEventListener(type, listener);
        }, this);
      };

      const removeEventListener = function removeEventListener(type, listener) {
        elements.forEach((el) => {
          el.removeEventListener(type, listener);
        }, this);
      };

      const anotherWordCloudStart = function anotherWordCloudStart() {
        removeEventListener('wordcloudstart', anotherWordCloudStart);
        stoppingFunction(timer);
      };

      addEventListener('wordcloudstart', anotherWordCloudStart);

      let timer = loopingFunction(function loop() {
        if (i >= settings.list.length) {
          stoppingFunction(timer);
          sendEvent('wordcloudstop', false);
          removeEventListener('wordcloudstart', anotherWordCloudStart);

          return;
        }
        escapeTime = new Date().getTime();
        const drawn = putWord(settings.list[i]);
        const canceled = !sendEvent('wordclouddrawn', true, {
          item: settings.list[i],
          drawn: drawn,
        });
        if (exceedTime() || canceled) {
          stoppingFunction(timer);
          settings.abort();
          sendEvent('wordcloudabort', false);
          sendEvent('wordcloudstop', false);
          removeEventListener('wordcloudstart', anotherWordCloudStart);
          return;
        }
        i++;
        timer = loopingFunction(loop, settings.wait);
      }, settings.wait);
    };

    // All set, start the drawing
    start();
  };

  WordCloud.isSupported = isSupported;
  WordCloud.minFontSize = minFontSize;

  // Expose the library as an AMD module
  if (typeof define === 'function' && define.amd) {
    global.WordCloud = WordCloud;
    define('wordcloud', [], () => WordCloud);
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = WordCloud;
  } else {
    global.WordCloud = WordCloud;
  }
})(this); //jshint ignore:line
