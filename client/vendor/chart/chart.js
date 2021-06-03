/*! 
 * MetroUI :: ChartJS - Create different charts in js
 * https://pimenov.com.ua
 *
 * Copyright 2021 Serhii Pimenov
 * Released under the MIT license
 */

(function () {
    'use strict';

    var defaultBorder = {
      width: 1,
      lineType: 'solid',
      color: '#e3e3e3',
      radius: 0
    };

    var defaultFont = {
      style: 'normal',
      family: "Helvetica, sans-serif",
      size: 12,
      weight: 'normal',
      lineHeight: 1.2,
      color: '#000'
    };
    var labelFont = Object.assign({}, defaultFont, {
      weight: 'bold'
    });
    var titleFont = Object.assign({}, defaultFont, {
      weight: 'bold',
      size: 24
    });

    var defaultTitle = {
      display: true,
      align: 'center',
      // start, center, end
      rtl: false,
      color: '#000',
      text: '',
      font: titleFont,
      padding: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      }
    };

    var defaultMargin = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    };

    var defaultPadding = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    };

    var defaultLegend = {
      rtl: false,
      margin: defaultMargin,
      padding: defaultPadding,
      font: labelFont,
      border: defaultBorder,
      dash: [],
      background: '#fff',
      vertical: false,
      position: 'top-left' // top-left, top-right, bottom-left, bottom-right, top-center, bottom-center

    };

    var defaultTooltip = {
      width: "auto",
      background: "#fff",
      color: "#000",
      font: defaultFont,
      border: defaultBorder,
      padding: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      },
      shadow: {
        shiftX: 2,
        shiftY: 2,
        blur: 4,
        stretch: 0,
        color: 'rgba(0,0,0,.5)'
      }
    };

    var defaultColors = {
      aliceBlue: "#f0f8ff",
      antiqueWhite: "#faebd7",
      aqua: "#00ffff",
      aquamarine: "#7fffd4",
      azure: "#f0ffff",
      beige: "#f5f5dc",
      bisque: "#ffe4c4",
      black: "#000000",
      blanchedAlmond: "#ffebcd",
      blue: "#0000ff",
      blueViolet: "#8a2be2",
      brown: "#a52a2a",
      burlyWood: "#deb887",
      cadetBlue: "#5f9ea0",
      chartreuse: "#7fff00",
      chocolate: "#d2691e",
      coral: "#ff7f50",
      cornflowerBlue: "#6495ed",
      cornsilk: "#fff8dc",
      crimson: "#dc143c",
      cyan: "#00ffff",
      darkBlue: "#00008b",
      darkCyan: "#008b8b",
      darkGoldenRod: "#b8860b",
      darkGray: "#a9a9a9",
      darkGreen: "#006400",
      darkKhaki: "#bdb76b",
      darkMagenta: "#8b008b",
      darkOliveGreen: "#556b2f",
      darkOrange: "#ff8c00",
      darkOrchid: "#9932cc",
      darkRed: "#8b0000",
      darkSalmon: "#e9967a",
      darkSeaGreen: "#8fbc8f",
      darkSlateBlue: "#483d8b",
      darkSlateGray: "#2f4f4f",
      darkTurquoise: "#00ced1",
      darkViolet: "#9400d3",
      deepPink: "#ff1493",
      deepSkyBlue: "#00bfff",
      dimGray: "#696969",
      dodgerBlue: "#1e90ff",
      fireBrick: "#b22222",
      floralWhite: "#fffaf0",
      forestGreen: "#228b22",
      fuchsia: "#ff00ff",
      gainsboro: "#DCDCDC",
      ghostWhite: "#F8F8FF",
      gold: "#ffd700",
      goldenRod: "#daa520",
      gray: "#808080",
      green: "#008000",
      greenYellow: "#adff2f",
      honeyDew: "#f0fff0",
      hotPink: "#ff69b4",
      indianRed: "#cd5c5c",
      indigo: "#4b0082",
      ivory: "#fffff0",
      khaki: "#f0e68c",
      lavender: "#e6e6fa",
      lavenderBlush: "#fff0f5",
      lawnGreen: "#7cfc00",
      lemonChiffon: "#fffacd",
      lightBlue: "#add8e6",
      lightCoral: "#f08080",
      lightCyan: "#e0ffff",
      lightGoldenRodYellow: "#fafad2",
      lightGray: "#d3d3d3",
      lightGreen: "#90ee90",
      lightPink: "#ffb6c1",
      lightSalmon: "#ffa07a",
      lightSeaGreen: "#20b2aa",
      lightSkyBlue: "#87cefa",
      lightSlateGray: "#778899",
      lightSteelBlue: "#b0c4de",
      lightYellow: "#ffffe0",
      lime: "#00ff00",
      limeGreen: "#32dc32",
      linen: "#faf0e6",
      magenta: "#ff00ff",
      maroon: "#800000",
      mediumAquaMarine: "#66cdaa",
      mediumBlue: "#0000cd",
      mediumOrchid: "#ba55d3",
      mediumPurple: "#9370db",
      mediumSeaGreen: "#3cb371",
      mediumSlateBlue: "#7b68ee",
      mediumSpringGreen: "#00fa9a",
      mediumTurquoise: "#48d1cc",
      mediumVioletRed: "#c71585",
      midnightBlue: "#191970",
      mintCream: "#f5fffa",
      mistyRose: "#ffe4e1",
      moccasin: "#ffe4b5",
      navajoWhite: "#ffdead",
      navy: "#000080",
      oldLace: "#fdd5e6",
      olive: "#808000",
      oliveDrab: "#6b8e23",
      orange: "#ffa500",
      orangeRed: "#ff4500",
      orchid: "#da70d6",
      paleGoldenRod: "#eee8aa",
      paleGreen: "#98fb98",
      paleTurquoise: "#afeeee",
      paleVioletRed: "#db7093",
      papayaWhip: "#ffefd5",
      peachPuff: "#ffdab9",
      peru: "#cd853f",
      pink: "#ffc0cb",
      plum: "#dda0dd",
      powderBlue: "#b0e0e6",
      purple: "#800080",
      rebeccaPurple: "#663399",
      red: "#ff0000",
      rosyBrown: "#bc8f8f",
      royalBlue: "#4169e1",
      saddleBrown: "#8b4513",
      salmon: "#fa8072",
      sandyBrown: "#f4a460",
      seaGreen: "#2e8b57",
      seaShell: "#fff5ee",
      sienna: "#a0522d",
      silver: "#c0c0c0",
      slyBlue: "#87ceeb",
      slateBlue: "#6a5acd",
      slateGray: "#708090",
      snow: "#fffafa",
      springGreen: "#00ff7f",
      steelBlue: "#4682b4",
      tan: "#d2b48c",
      teal: "#008080",
      thistle: "#d8bfd8",
      tomato: "#ff6347",
      turquoise: "#40e0d0",
      violet: "#ee82ee",
      wheat: "#f5deb3",
      white: "#ffffff",
      whiteSmoke: "#f5f5f5",
      yellow: "#ffff00",
      yellowGreen: "#9acd32"
    };

    var defaultOptions = {
      dpi: 1,
      height: 200,
      width: "100%",
      padding: {
        top: 40,
        left: 40,
        right: 40,
        bottom: 40
      },
      margin: defaultMargin,
      background: '#fff',
      color: '#000',
      font: defaultFont,
      border: defaultBorder,
      title: defaultTitle,
      legend: defaultLegend,
      tooltip: defaultTooltip,
      boundaries: false,
      colors: Object.values(defaultColors),
      animate: false,
      onDrawLabelY: null,
      onDrawLabelX: null,
      onTooltipShow: null,
      onHover: null,
      onLeave: null
    };

    /**
     * Simple object check.
     * @param item
     * @returns {boolean}
     */
    function isObject(item) {
      return item && typeof item === 'object' && !Array.isArray(item);
    }

    /**
     * Deep merge two objects.
     * @param target
     * @param ...sources
     */

    function merge(target) {
      for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        sources[_key - 1] = arguments[_key];
      }

      if (!sources.length) return target;
      var source = sources.shift();

      if (isObject(target) && isObject(source)) {
        for (var key in source) {
          if (isObject(source[key])) {
            if (!target[key]) Object.assign(target, {
              [key]: {}
            });
            merge(target[key], source[key]);
          } else {
            Object.assign(target, {
              [key]: source[key]
            });
          }
        }
      }

      return merge(target, ...sources);
    }

    var drawText = function drawText(ctx, text, _ref) {
      var [x, y] = _ref;
      var {
        align = 'left',
        baseLine = 'middle',
        color = '#000',
        stroke = '#000',
        font,
        angle = 0,
        translate = [0, 0]
      } = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var {
        style = 'normal',
        weight = 'normal',
        size = 12,
        lineHeight = 1,
        family = 'sans-serif'
      } = font;
      var tX = 0,
          tY = 0;

      if (typeof translate === "number") {
        tX = tY = translate;
      } else if (Array.isArray(translate)) {
        [tX, tY] = translate;
      }

      ctx.save();
      ctx.beginPath();
      ctx.textAlign = align;
      ctx.fillStyle = color;
      ctx.strokeStyle = stroke;
      ctx.font = "".concat(style, " ").concat(weight, " ").concat(size, "px/").concat(lineHeight, " ").concat(family);
      ctx.translate(tX, tY);
      ctx.rotate(angle * Math.PI / 180);
      ctx.textBaseline = baseLine;
      var lines = text.toString().split('\n');
      lines.map((str, i) => {
        ctx.fillText(str, x, y + y * i * lineHeight);
      });
      ctx.closePath();
      ctx.restore();
    };

    var getTextBoxWidth = (ctx, items, _ref) => {
      var {
        font = null
      } = _ref;
      var size = 0,
          w;
      ctx.save();

      if (font) {
        var {
          style = 'normal',
          weight = 'normal',
          size: _size = 12,
          lineHeight = 1.2,
          family = 'sans-serif'
        } = font;
        ctx.font = "".concat(style, " ").concat(weight, " ").concat(_size, "px/").concat(lineHeight, " ").concat(family);
      }

      for (var i = 0; i < items.length; i++) {
        w = ctx.measureText(items[i][0]).width;
        if (w > size) size = w;
      }

      ctx.restore();
      return size;
    };

    var drawSquare = function drawSquare(ctx, _ref) {
      var [x, y, r] = _ref;
      var {
        color = '#000',
        fill = '#fff',
        size = 1,
        dash = []
      } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      ctx.beginPath();
      ctx.save();
      ctx.setLineDash(dash);
      ctx.lineWidth = size;
      ctx.strokeStyle = color;
      ctx.fillStyle = fill;
      ctx.rect(x - r, y - r, r * 2, r * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      ctx.closePath();
    };

    var drawBox = function drawBox(ctx, _ref) {
      var [x, y, w, h] = _ref;
      var {
        color = '#fff',
        borderColor = '#000',
        dash = [],
        size = 1
      } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = borderColor;
      ctx.fillStyle = color;
      ctx.setLineDash(dash);
      ctx.lineWidth = size;
      ctx.clearRect(x, y, w, h);
      ctx.fillRect(x, y, w, h);
      if (size) ctx.strokeRect(x, y, w, h);
      ctx.closePath();
      ctx.restore();
    };

    var expandPadding = padding => {
      if (typeof padding === "number") {
        return {
          top: padding,
          left: padding,
          right: padding,
          bottom: padding
        };
      }

      return padding;
    };

    var expandMargin = margin => {
      if (typeof margin === "number") {
        return {
          top: margin,
          left: margin,
          right: margin,
          bottom: margin
        };
      }

      return margin;
    };

    var MixinLegend = {
      legend() {
        var o = this.options;
        return o.legend.vertical === true ? this.legendVertical() : this.legendHorizontal();
      },

      legendHorizontal() {
        var o = this.options,
            padding = expandPadding(o.padding),
            legend = o.legend;
        var ctx = this.ctx;
        var items = this.legendItems;
        if (!legend || !isObject(legend)) return;
        if (!items || !Array.isArray(items) || !items.length) return;
        var legendPadding = expandPadding(legend.padding);
        var legendMargin = expandMargin(legend.margin);
        var lh,
            x,
            y,
            magic = 5,
            box;
        var offset = 0;
        box = legend.font.size / 2;
        lh = legend.font.size * legend.font.lineHeight;
        y = padding.top + this.viewHeight + (legend.font.size + legendPadding.top + legendMargin.top);
        x = padding.left + legendPadding.left + legendMargin.left;

        for (var i = 0; i < items.length; i++) {
          var [name, _, value] = items[i];
          offset += getTextBoxWidth(ctx, [[legend.showValue ? "".concat(name, " - ").concat(value) : name]], {
            font: legend.font
          }) + box * 2 + magic;
        }

        offset = (this.viewWidth - offset) / 2;

        for (var _i = 0; _i < items.length; _i++) {
          var [_name, color, _value] = items[_i];
          var nameWidth = getTextBoxWidth(ctx, [[legend.showValue ? "".concat(_name, " - ").concat(_value) : _name]], {
            font: legend.font
          });

          if (x + nameWidth > this.viewWidth) {
            x = padding.left + legendPadding.left + legendMargin.left;
            y += lh;
          }

          drawSquare(ctx, [offset + x, y, box], {
            color,
            fill: color
          });
          drawText(ctx, legend.showValue ? "".concat(_name, " - ").concat(_value) : _name, [offset + x + box + magic, y + box / 2], {
            color: legend.font.color,
            stroke: legend.font.color,
            font: o.font
          });
          x += box + nameWidth + 20;
        }
      },

      legendVertical() {
        var _legend$font;

        var o = this.options,
            legend = o.legend,
            font = (_legend$font = legend.font) !== null && _legend$font !== void 0 ? _legend$font : o.font;
        var lh,
            x,
            y,
            magic = 5,
            box = font.size / 2;
        var ctx = this.ctx;
        var items = this.legendItems;
        var textBoxWidth, textBoxHeight;
        var legendPadding = expandPadding(legend.padding),
            legendMargin = expandMargin(legend.margin);
        var padding = expandPadding(o.padding);
        if (!legend || !isObject(legend)) return;
        if (!items || !Array.isArray(items) || !items.length) return;
        lh = font.size * font.lineHeight;
        textBoxWidth = getTextBoxWidth(ctx, items, {
          font
        }) + legendPadding.left + legendPadding.right + box * 3 + magic;
        textBoxHeight = items.length * lh + legendPadding.top + legendPadding.bottom + magic;

        if (legend.position === 'top-left') {
          x = legendPadding.left + legendMargin.left;
          y = legendPadding.top + legendMargin.top;
        } else if (legend.position === 'top-right') {
          x = this.dpiWidth - textBoxWidth - legendMargin.right - padding.right;
          y = legendPadding.top + legendMargin.top;
        } else if (legend.position === 'bottom-left') {
          x = legendPadding.left + legendMargin.left;
          y = this.dpiHeight - textBoxHeight - legendPadding.bottom - legendMargin.bottom;
        } else {
          x = this.dpiWidth - textBoxWidth - legendMargin.right - legendPadding.right;
          y = this.dpiHeight - textBoxHeight - legendPadding.bottom - legendMargin.bottom;
        }

        drawBox(ctx, [x, y, textBoxWidth, textBoxHeight], {
          color: legend.background,
          dash: legend.dash,
          size: legend.border.width,
          borderColor: legend.border.color
        });
        x += box + magic + legendPadding.left;
        y += box + magic + legendPadding.top;

        for (var i = 0; i < items.length; i++) {
          var [name, color, value] = items[i];
          drawSquare(ctx, [x, y, box], {
            color,
            fill: color
          });
          drawText(ctx, legend.showValue ? "".concat(name, " - ").concat(value) : name, [x + box + magic, y + 1], {
            color: legend.font.color,
            stroke: legend.font.color,
            font: legend.font
          });
          y += lh;
        }
      }

    };

    var MixinTooltip = {
      showTooltip(data, graph) {
        var o = this.options;

        if (this.tooltip) {
          this.tooltip.remove();
          this.tooltip = null;
        }

        if (!o.tooltip) return;
        var {
          x,
          y
        } = this.proxy.mouse;
        var tooltip = document.createElement("div");
        var onShow = o.onTooltipShow;
        var font = o.tooltip.font;
        var shadow = o.tooltip.shadow;
        var border = o.tooltip.border;
        var padding = expandPadding(o.tooltip.padding);
        tooltip.style.position = 'fixed';
        tooltip.style.border = "".concat(border.width, "px ").concat(border.lineType, " ").concat(border.color);
        tooltip.style.borderRadius = "".concat(border.radius);
        tooltip.style.padding = "".concat(padding.top, "px ").concat(padding.right, "px ").concat(padding.bottom, "px ").concat(padding.left, "px");
        tooltip.style.background = "".concat(o.tooltip.background);
        tooltip.style.font = "".concat(font.style, " ").concat(font.weight, " ").concat(font.size, "px/").concat(font.lineHeight, " ").concat(font.family);
        tooltip.style.boxShadow = "".concat(shadow.shiftX, "px ").concat(shadow.shiftY, "px ").concat(shadow.blur, "px ").concat(shadow.color);
        tooltip.innerHTML = onShow && typeof onShow === 'function' ? onShow.apply(null, [data, graph]) : data;
        document.querySelector('body').appendChild(tooltip);
        tooltip.style.top = "".concat(y - tooltip.clientHeight - 15, "px");
        tooltip.style.left = "".concat(x - tooltip.clientWidth / 2 - 5, "px");
        this.tooltip = tooltip;
      }

    };

    class Chart {
      constructor(el) {
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'unknown';
        this.el = document.querySelector(el);

        if (!this.el) {
          throw new Error("You must define a selector for chart wrapper element!");
        }

        this.options = merge({}, defaultOptions, options);
        this.data = data;
        this.canvas = null;
        this.ctx = null;
        this.raf = null;
        this.tooltip = null;
        this.legendItems = [];
        this.chartType = type;
        this.rect = this.el.getBoundingClientRect();
        this.canvasRect = null;
        this.static = false;
        var that = this;
        this.proxy = new Proxy({}, {
          set() {
            var result = Reflect.set(...arguments);
            that.raf = requestAnimationFrame(that.draw.bind(that));
            return result;
          }

        });

        if (this.options.border) {
          this.el.style.border = "".concat(this.options.border.width, "px ").concat(this.options.border.lineType, " ").concat(this.options.border.color);
        }

        this.calcInternalValues();
        this.createCanvas();
        this.addEvents();
      }

      createCanvas() {
        this.canvas = document.createElement("canvas");
        this.el.innerHTML = "";
        this.el.style.overflow = 'hidden';
        this.el.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.setCanvasSize();
        this.canvasRect = this.canvas.getBoundingClientRect();
      }

      setCanvasSize() {
        var o = this.options;
        this.canvas.style.height = this.height + 'px';
        this.canvas.style.width = this.width + 'px';
        this.canvas.width = o.dpi * this.width;
        this.canvas.height = o.dpi * this.height;
      }

      calcInternalValues() {
        var width, height;
        var o = this.options,
            padding = expandPadding(o.padding);
        var rect = this.el.getBoundingClientRect();
        var {
          width: elWidth,
          height: elHeight
        } = rect;
        width = o.width.toString().includes('%') ? elWidth / 100 * parseInt(o.width) : +o.width;
        height = o.height.toString().includes('%') ? elHeight / 100 * parseInt(o.height) : +o.height;
        this.width = width;
        this.height = height;
        this.dpi = o.dpi;
        this.dpiHeight = this.dpi * height;
        this.dpiWidth = this.dpi * width;
        this.viewHeight = this.dpiHeight - (padding.top + padding.bottom);
        this.viewWidth = this.dpiWidth - (padding.left + padding.right);
        this.center = [this.dpiWidth / 2, this.dpiHeight / 2];
        this.radius = Math.min(this.viewHeight, this.viewWidth) / 2;
      }

      title() {
        var title = this.options.title;
        var ctx = this.ctx;
        var magic = 5;
        var x;

        if (!title || !title.text) {
          return;
        }

        var {
          text,
          align,
          color,
          font
        } = title;

        switch (align) {
          case 'center':
            x = this.dpiWidth / 2;
            break;

          case 'right':
            x = this.dpiWidth - magic;
            break;

          default:
            x = magic;
        }

        drawText(ctx, text, [x, font.size + magic], {
          align: title.align,
          color: title.color,
          stroke: title.color,
          font: title.font
        });
      }

      draw() {
        this.clear();
        this.title();
      }

      clear() {
        this.ctx.clearRect(0, 0, this.dpiWidth, this.dpiHeight);
      }

      setData(data, index) {
        var redraw = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        if (typeof index !== "undefined") {
          this.data[index].data = data;
        } else {
          this.data = data;
        }

        if (redraw) this.resize();
      }

      setBoundaries(obj) {
        var redraw = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var grantedKeys = ["minX", "minY", "minZ", "maxX", "maxY", "maxZ", "min", "max"];

        for (var k in obj) {
          if (grantedKeys.includes(k)) {
            this[k] = obj[k];
            this.options.boundaries[k] = obj[k];
          }
        }

        if (redraw) {
          this.draw();
        }
      }

      mouseMove(e) {
        var onHover = this.options.onHover;
        var {
          clientX: x,
          clientY: y
        } = e.changedTouches ? e.touches[0] : e;
        if (typeof onHover === "function") onHover.apply(null, [x, y]);
        this.proxy.mouse = {
          x: x,
          y: y
        };
        if (e.cancelable) e.preventDefault();
      }

      mouseLeave() {
        var fn = this.options.onLeave;
        if (typeof fn === "function") fn.apply(null, []);
        this.proxy.mouse = null;
      }

      resize() {
        this.calcInternalValues();
        this.setCanvasSize();
        this.rect = this.el.getBoundingClientRect();
        this.canvasRect = this.canvas.getBoundingClientRect();
        this.draw();
      }

      addEvents() {
        var canvas = this.canvas;
        canvas.addEventListener("mousemove", this.mouseMove.bind(this));
        canvas.addEventListener("touchmove", this.mouseMove.bind(this), {
          passive: false
        });
        canvas.addEventListener("mouseleave", this.mouseLeave.bind(this));
        window.addEventListener("resize", this.resize.bind(this));
      }

      destroy() {
        var canvas = this.canvas;
        cancelAnimationFrame(this.raf);
        canvas.removeEventListener("mousemove", this.mouseMove.bind(this));
        canvas.removeEventListener("mouseleave", this.mouseLeave.bind(this));
        window.removeEventListener("resize", this.resize.bind(this));
      }

    }
    Object.assign(Chart.prototype, MixinLegend);
    Object.assign(Chart.prototype, MixinTooltip);

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);

      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
        keys.push.apply(keys, symbols);
      }

      return keys;
    }

    function _objectSpread2(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};

        if (i % 2) {
          ownKeys(Object(source), true).forEach(function (key) {
            _defineProperty(target, key, source[key]);
          });
        } else if (Object.getOwnPropertyDescriptors) {
          Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
          ownKeys(Object(source)).forEach(function (key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
          });
        }
      }

      return target;
    }

    var line = {
      color: '#e3e3e3',
      size: 1,
      dash: [],
      shortLineSize: 5
    };
    var label = {
      color: '#000',
      font: labelFont,
      count: 5,
      fixed: false,
      opposite: false,
      angle: 0,
      align: 'center',
      shift: {
        x: 0,
        y: 0
      },
      skip: 0,
      showLine: true,
      showLabel: true,
      showMin: true
    };
    var axis = {
      line,
      label
    };
    var defaultAxis = {
      x: axis,
      y: _objectSpread2(_objectSpread2({}, axis), {}, {
        label: _objectSpread2(_objectSpread2({}, label), {}, {
          align: 'right'
        })
      })
    };

    var defaultCross = {
      size: 1,
      color: '#bbb',
      dash: [5, 3]
    };

    var defaultArrow = {
      color: '#7d7d7d',
      size: 1,
      dash: [],
      factorX: 5,
      factorY: 5,
      outside: 0
    };
    var defaultArrows = {
      x: defaultArrow,
      y: defaultArrow
    };

    var defaultAreaChartOptions = {
      axis: defaultAxis,
      cross: defaultCross,
      showDots: true,
      accuracy: 2,
      arrows: defaultArrows
    };

    var minMax = function minMax() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var by = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'x';
      var min, max, v;
      var index;

      if (typeof by === "number") {
        index = by;
      } else {
        switch (by.toString().toLowerCase()) {
          case 'y':
            index = 1;
            break;

          case 'z':
            index = 2;
            break;

          default:
            index = 0;
        }
      }

      for (var _ of data) {
        v = _[index];
        if (isNaN(min) || min > v) min = v;
        if (isNaN(max) || max < v) max = v;
      }

      return [min, max];
    };
    var minMaxLinear = function minMaxLinear() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var min, max;
      min = Math.min.apply(null, data);
      max = Math.max.apply(null, data);
      return [min, max];
    };

    var drawCircle = function drawCircle(ctx, _ref) {
      var [x, y, r] = _ref;
      var {
        color = '#000',
        fill = '#fff',
        size = 1
      } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      ctx.beginPath();
      ctx.save();
      ctx.setLineDash([]);
      ctx.lineWidth = size;
      ctx.strokeStyle = color;
      ctx.fillStyle = fill;
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      ctx.closePath();
    };

    var drawTriangle = function drawTriangle(ctx, _ref) {
      var [x, y, r] = _ref;
      var {
        color = '#000',
        fill = '#fff',
        size = 1
      } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      ctx.beginPath();
      ctx.save();
      ctx.setLineDash([]);
      ctx.lineWidth = size;
      ctx.strokeStyle = color;
      ctx.fillStyle = fill;
      ctx.moveTo(x, y - r);
      ctx.lineTo(x + r, y + r);
      ctx.lineTo(x - r, y + r);
      ctx.lineTo(x, y - r);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      ctx.closePath();
    };

    var drawDiamond = function drawDiamond(ctx, _ref) {
      var [x, y, r] = _ref;
      var {
        color = '#000',
        fill = '#fff',
        size = 1
      } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      ctx.beginPath();
      ctx.save();
      ctx.setLineDash([]);
      ctx.lineWidth = size;
      ctx.strokeStyle = color;
      ctx.fillStyle = fill;
      ctx.moveTo(x, y - r);
      ctx.lineTo(x + r, y);
      ctx.lineTo(x, y + r);
      ctx.lineTo(x - r, y);
      ctx.lineTo(x, y - r);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      ctx.closePath();
    };

    var drawArea = function drawArea(ctx) {
      var coords = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var {
        color = '#000',
        fill = '#000',
        size = 1,
        dash = []
      } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      ctx.beginPath();
      ctx.save();
      ctx.setLineDash(dash);
      ctx.lineWidth = size;
      ctx.strokeStyle = color;
      ctx.fillStyle = fill;
      coords.map((_ref) => {
        var [x, y] = _ref;
        ctx.lineTo(x, y);
      });
      ctx.lineTo(coords[0][0], coords[0][1]);
      ctx.fill();
      ctx.restore();
      ctx.closePath();
    };

    var MixinCross = {
      cross() {
        var o = this.options,
            cross = o.cross;
        var padding = expandPadding(o.padding);
        var ctx = this.ctx;
        var rect = this.canvas.getBoundingClientRect();
        if (!o.cross || o.cross && !this.proxy.mouse) return;
        var {
          x,
          y
        } = this.proxy.mouse;
        x -= rect.left;
        y -= rect.top;
        if (x - padding.left + 1 < 0 || x > this.viewWidth + padding.left + 1) return;
        if (y - padding.top + 1 < 0 || y > this.viewHeight + padding.top + 1) return;
        ctx.beginPath();
        ctx.setLineDash(o.cross.dash);
        ctx.lineWidth = cross.size;
        ctx.strokeStyle = cross.color; // vertical line

        ctx.moveTo(x, padding.top);
        ctx.lineTo(x, this.viewHeight + padding.top); // Horizontal line

        ctx.moveTo(padding.left, y);
        ctx.lineTo(this.viewWidth + padding.left, y);
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
      }

    };

    var drawVector = function drawVector(ctx, _ref) {
      var [x1, y1, x2, y2] = _ref;
      var {
        color = '#000',
        size = 1,
        dash = []
      } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      ctx.beginPath();
      ctx.save();
      ctx.setLineDash(dash);
      ctx.lineWidth = size;
      ctx.strokeStyle = color;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.restore();
      ctx.closePath();
    };

    var MixinAxis = {
      axisX() {
        var _ref, _line$shortLineSize;

        var ctx = this.ctx,
            o = this.options;
        var padding = expandPadding(o.padding);
        if (!o.axis.x) return;
        var axis = o.axis.x,
            label = axis.label,
            line = axis.line,
            arrow = axis.arrow;
        var font = (_ref = label && label.font) !== null && _ref !== void 0 ? _ref : o.font;
        var labelStep = label.count ? (this.maxX - this.minX) / label.count : 0;
        var labelValue,
            value,
            k,
            x,
            y,
            labelY,
            shortLineSize = (_line$shortLineSize = line.shortLineSize) !== null && _line$shortLineSize !== void 0 ? _line$shortLineSize : 0;
        x = padding.left;
        y = padding.top;
        labelY = padding.top + this.viewHeight + font.size + 5;
        value = this.minX;
        k = 0;

        for (var i = 0; i <= label.count; i++) {
          labelValue = typeof label.fixed === "number" ? value.toFixed(label.fixed) : value;

          if (typeof o.onDrawLabelX === "function") {
            labelValue = o.onDrawLabelX.apply(null, [value]);
          }

          if (label.showLine) {
            drawVector(ctx, [x, y, x, y + this.viewHeight], {
              color: line.color,
              size: line.size,
              dash: line.dash
            });
          }

          if (label.skip && k !== label.skip) {
            k++;
          } else {
            k = 1;

            if (label.showLabel && !(!i && !label.showMin)) {
              var _label$color, _label$shift$x, _label$shift$y;

              // short line
              drawVector(ctx, [x, this.viewHeight + padding.top - shortLineSize, x, this.viewHeight + padding.top + shortLineSize], {
                color: arrow && arrow.color ? arrow.color : line.color
              }); // label

              drawText(ctx, labelValue.toString(), [0, 0], {
                color: (_label$color = label.color) !== null && _label$color !== void 0 ? _label$color : o.color,
                align: label.align,
                font,
                translate: [x + ((_label$shift$x = label.shift.x) !== null && _label$shift$x !== void 0 ? _label$shift$x : 0), labelY + ((_label$shift$y = label.shift.y) !== null && _label$shift$y !== void 0 ? _label$shift$y : 0)],
                angle: label.angle
              });
            }
          }

          value += labelStep;
          x = padding.left + (value - this.minX) * this.ratioX;
        }
      },

      axisY() {
        var _ref2, _line$shortLineSize2;

        var ctx = this.ctx,
            o = this.options;
        var padding = expandPadding(o.padding);
        if (!o.axis.y) return;
        var axis = o.axis.y,
            label = axis.label,
            line = axis.line,
            arrow = axis.arrow;
        var font = (_ref2 = label && label.font) !== null && _ref2 !== void 0 ? _ref2 : o.font;
        var labelStep = label.count ? (this.maxY - this.minY) / label.count : 0;
        var labelValue, value, k, x, y, labelX, shortLineX;
        var shortLineSize = (_line$shortLineSize2 = line.shortLineSize) !== null && _line$shortLineSize2 !== void 0 ? _line$shortLineSize2 : 0;
        x = padding.left;
        labelX = padding.left;
        y = this.viewHeight + padding.top;
        value = this.minY;
        k = 0;

        if (label.opposite) {
          labelX += this.viewWidth + 10 + shortLineSize;
          shortLineX = padding.left + this.viewWidth;
          label.align = 'left';
        } else {
          labelX -= 10;
          shortLineX = x - shortLineSize;
        }

        for (var i = 0; i < label.count + 1; i++) {
          labelValue = typeof label.fixed === "number" ? value.toFixed(label.fixed) : value;

          if (typeof o.onDrawLabelY === "function") {
            labelValue = o.onDrawLabelY.apply(null, [value]);
          }

          if (label.showLine) {
            drawVector(ctx, [x, y, this.viewWidth + padding.left, y], {
              color: line.color,
              size: line.size,
              dash: line.dash
            });
          }

          if (i !== 0 && label.skip && k !== label.skip) {
            k++;
          } else {
            k = 1;

            if (label.showLabel && !(!i && !label.showMin)) {
              var _ref3, _label$shift$x2, _label$shift$y2;

              // short line
              drawVector(ctx, [shortLineX, y, shortLineX + shortLineSize * 2, y], {
                color: arrow && arrow.color ? arrow.color : line.color
              });
              drawText(ctx, labelValue.toString(), [0, 0], {
                color: (_ref3 = label && label.color) !== null && _ref3 !== void 0 ? _ref3 : o.color,
                align: label.align,
                font,
                translate: [labelX + ((_label$shift$x2 = label.shift.x) !== null && _label$shift$x2 !== void 0 ? _label$shift$x2 : 0), y + 1 + ((_label$shift$y2 = label.shift.y) !== null && _label$shift$y2 !== void 0 ? _label$shift$y2 : 0)],
                angle: label.angle
              });
            }
          }

          value += labelStep;
          y = padding.top + this.viewHeight - (value - this.minY) * this.ratioY;
        }
      },

      axisXY() {
        if (!this.options.axis) return;
        this.axisX();
        this.axisY();
        return this;
      }

    };

    var MixinAddPoint = {
      addPoint(index, point) {
        var shift = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        var o = this.options;
        var data;

        if (!this.data) {
          this.data = [];

          for (var i = 0; i < index + 1; i++) {
            this.data[i] = [];
          }
        }

        data = this.data[index];

        if (shift && data.length) {
          if (!o.graphSize) {
            data = data.slice(1);
          } else {
            if (data.length >= o.graphSize) {
              data = data.slice(1);
            }
          }
        }

        this.data[index] = data;
        this.data[index].push(point);
      }

    };

    var drawLine = function drawLine(ctx) {
      var coords = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var {
        color = '#000',
        size = 1,
        dash = []
      } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      ctx.beginPath();
      ctx.save();
      ctx.setLineDash(dash);
      ctx.lineWidth = size;
      ctx.strokeStyle = color;
      coords.map((_ref) => {
        var [x, y] = _ref;
        ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.restore();
      ctx.closePath();
    };

    var drawArrowX = function drawArrowX(ctx, _ref) {
      var [x1, y1, x2, y2, factorX, factorY] = _ref;
      var {
        color = '#000',
        dash = [],
        size = 1
      } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.setLineDash(dash);
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - factorX, y2 - factorY);
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - factorX, y2 + factorY);
      ctx.stroke();
      ctx.closePath();
    };

    var drawArrowY = function drawArrowY(ctx, _ref) {
      var [x1, y1, x2, y2, factorX, factorY] = _ref;
      var {
        color = '#000',
        dash = [],
        size = 1
      } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.setLineDash(dash);
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - factorX, y2 + factorY);
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 + factorX, y2 + factorY);
      ctx.stroke();
      ctx.closePath();
    };

    var MixinArrows = {
      arrowX() {
        var o = this.options,
            ctx = this.ctx;
        var padding = expandPadding(o.padding);
        if (!o.arrows.x) return;
        var arrow = o.arrows.x;
        var x1 = padding.left,
            y1 = this.viewHeight + padding.top;
        var x2 = padding.left + this.viewWidth + arrow.outside,
            y2 = y1;
        drawArrowX(ctx, [x1, y1, x2, y2, arrow.factorX, arrow.factorY], {
          color: arrow.color,
          size: arrow.size,
          dash: arrow.dash
        });
      },

      arrowY() {
        var o = this.options,
            ctx = this.ctx;
        var padding = expandPadding(o.padding);
        if (!o.arrows.y) return;
        var arrow = o.arrows.y;
        var x = padding.left,
            y1 = this.viewHeight + padding.top;
        var y2 = padding.top - arrow.outside;
        drawArrowY(ctx, [x, y1, x, y2, arrow.factorX, arrow.factorY], {
          color: arrow.color,
          size: arrow.size,
          dash: arrow.dash
        });
      },

      arrows() {
        if (!this.options.arrows) return;
        this.arrowX();
        this.arrowY();
        return this;
      }

    };

    class AreaChart extends Chart {
      constructor(el) {
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        super(el, data, merge({}, defaultAreaChartOptions, options), 'area');
        this.coords = {};
        this.minX = 0;
        this.maxX = 0;
        this.minY = 0;
        this.maxY = 0;
        this.legendItems = [];
        var legend = this.options.legend;
        var areas = this.options.areas;
        var colors = this.options.colors;

        if (legend) {
          for (var i = 0; i < this.data.length; i++) {
            this.legendItems.push([areas[i].name, colors[i]]);
          }
        }

        this.calcMinMax();
        this.resize();
      }

      calcMinMax() {
        var o = this.options;
        var a = [];

        for (var _data of this.data) {
          if (!Array.isArray(_data)) continue;

          for (var [x, y] of _data) {
            a.push([x, y]);
          }
        }

        var [minX, maxX] = minMax(a, 'x');
        var [minY, maxY] = minMax(a, 'y');
        this.minX = o.boundaries && !isNaN(o.boundaries.minX) ? o.boundaries.minX : minX;
        this.maxX = o.boundaries && !isNaN(o.boundaries.maxX) ? o.boundaries.maxX : maxX;
        this.minY = o.boundaries && !isNaN(o.boundaries.minY) ? o.boundaries.minY : minY;
        this.maxY = o.boundaries && !isNaN(o.boundaries.maxY) ? o.boundaries.maxY : maxY;
        if (isNaN(this.minX)) this.minX = 0;
        if (isNaN(this.maxX)) this.maxX = 100;
        if (isNaN(this.minY)) this.minX = 0;
        if (isNaN(this.maxY)) this.maxX = 100;
      }

      calcRatio() {
        this.ratioX = this.viewWidth / (this.maxX === this.minX ? this.maxX : this.maxX - this.minX);
        this.ratioY = this.viewHeight / (this.maxY === this.minY ? this.maxY : this.maxY - this.minY);
      }

      areas() {
        var _this = this;

        var o = this.options,
            padding = expandPadding(o.padding);
        var ctx = this.ctx;
        var coords;
        if (!this.data || !this.data.length) return;

        var _loop = function _loop(i) {
          var _area$color, _area$fill, _dots$color, _dots$fill, _dots$size;

          var area = o.areas[i];
          var data = _this.data[i];
          var color = (_area$color = area.color) !== null && _area$color !== void 0 ? _area$color : o.colors[i];
          var fill = (_area$fill = area.fill) !== null && _area$fill !== void 0 ? _area$fill : color;
          coords = [];
          coords.push([padding.left, _this.viewHeight + padding.top, 0, 0]);

          for (var [x, y] of data) {
            var _x = Math.floor((x - _this.minX) * _this.ratioX + padding.left);

            var _y = Math.floor(_this.viewHeight + padding.top - (y - _this.minY) * _this.ratioY);

            coords.push([_x, _y, x, y]);
          }

          coords.push([coords[coords.length - 1][0], _this.viewHeight + padding.top, 0, 0]);
          drawArea(ctx, coords, {
            color,
            fill,
            size: area.size
          });
          var dots = area.dots ? area.dots : {
            type: 'dot' // dot, square, triangle

          };
          var opt = {
            color: (_dots$color = dots.color) !== null && _dots$color !== void 0 ? _dots$color : color,
            fill: (_dots$fill = dots.fill) !== null && _dots$fill !== void 0 ? _dots$fill : color,
            radius: (_dots$size = dots.size) !== null && _dots$size !== void 0 ? _dots$size : 4
          };
          var drawPointFn = void 0;

          switch (dots.type) {
            case 'square':
              drawPointFn = drawSquare;
              break;

            case 'triangle':
              drawPointFn = drawTriangle;
              break;

            case 'diamond':
              drawPointFn = drawDiamond;
              break;

            default:
              drawPointFn = drawCircle;
          }

          if (area.dots && o.showDots !== false) {
            coords.map((_ref) => {
              var [x, y] = _ref;
              drawPointFn(ctx, [x, y, opt.radius], opt);
            });
          }

          _this.coords[area.name] = {
            area,
            coords,
            drawPointFn,
            opt
          };
          coords.shift();
          coords.pop();

          if (area.showLines !== false) {
            drawLine(ctx, coords, {
              color,
              fill,
              size: area.size
            });
          }
        };

        for (var i = 0; i < this.data.length; i++) {
          _loop(i);
        }
      }

      floatPoint() {
        var o = this.options;
        var ctx = this.ctx;
        var rect = this.canvas.getBoundingClientRect();
        var tooltip = false;
        if (!this.data || !this.data.length) return;
        if (!this.proxy.mouse) return;
        var {
          x,
          y
        } = this.proxy.mouse;
        var mx = x - rect.left;
        var my = y - rect.top;

        for (var name in this.coords) {
          var item = this.coords[name];
          var drawPointFn = item.drawPointFn;
          var opt = item.opt;

          for (var [px, py, _x, _y] of item.coords) {
            var accuracy = +(o.accuracy || opt.radius);
            var lx = px - accuracy,
                rx = px + accuracy;
            var ly = py - accuracy,
                ry = py + accuracy;

            if (mx > lx && mx < rx && o.hoverMode !== 'default') {
              drawPointFn(ctx, [px, py, opt.radius], {
                color: opt.color,
                fill: opt.fill
              });
            }

            if (mx > lx && mx < rx && my > ly && my < ry) {
              if (o.hoverMode === 'default') drawPointFn(ctx, [px, py, opt.radius * 2], {
                color: opt.color,
                fill: opt.fill
              });

              if (o.tooltip) {
                this.showTooltip([_x, _y], item.graph);
                tooltip = true;
              }

              break;
            }
          }

          if (!tooltip && this.tooltip) {
            this.tooltip.remove();
            this.tooltip = null;
          }
        }
      }

      add(index, _ref2, shift, align) {
        var [x, y] = _ref2;
        this.addPoint(index, [x, y], shift);
        this.minX = this.data[index][0][0];
        this.maxX = x;

        if (align) {
          if (isObject(align)) {
            this.align(align);
          }
        } else {
          if (y < this.minY) this.minY = y;
          if (y > this.maxY) this.maxY = y;
        }

        this.resize();
      }

      align(_ref3) {
        var {
          minX,
          maxX,
          minY,
          maxY
        } = _ref3;
        var a = [];

        for (var _data of this.data) {
          if (!Array.isArray(_data)) continue;

          for (var [x, y] of _data) {
            a.push([x, y]);
          }
        }

        var [_minX, _maxX] = minMax(a, 'x');
        var [_minY, _maxY] = minMax(a, 'y');
        if (minX) this.minX = _minX;
        if (minY) this.minY = _minY;
        if (maxX) this.maxX = _maxX;
        if (maxY) this.maxY = _maxY;
      }

      draw() {
        super.draw();
        this.calcRatio();
        this.axisXY();
        this.arrows();
        this.areas();
        this.floatPoint();
        this.cross();
        this.legend();
      }

    }
    Object.assign(AreaChart.prototype, MixinCross);
    Object.assign(AreaChart.prototype, MixinAxis);
    Object.assign(AreaChart.prototype, MixinAddPoint);
    Object.assign(AreaChart.prototype, MixinArrows);
    var areaChart = (el, data, options) => new AreaChart(el, data, options);

    var defaultBarChartOptions = {
      groupDistance: 0,
      barDistance: 0,
      axis: _objectSpread2({}, defaultAxis),
      dataAxisX: false,
      labels: {
        font: labelFont,
        color: '#000'
      },
      arrows: defaultArrows,
      onDrawLabel: null
    };

    var drawRect = function drawRect(ctx, _ref) {
      var [x, y, w, h] = _ref;
      var {
        color = '#000',
        fill = '#fff',
        size = 1,
        dash = []
      } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      ctx.beginPath();
      ctx.save();
      ctx.setLineDash(dash);
      ctx.lineWidth = size;
      ctx.strokeStyle = color;
      ctx.fillStyle = fill;
      ctx.rect(x, y, w, h);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      ctx.closePath();
    };

    class BarChart extends Chart {
      constructor(el, data, options) {
        super(el, data, merge({}, defaultBarChartOptions, options), 'bar');
        this.groups = 0;
        this.barWidth = 0;
        this.maxY = 0;
        this.maxX = 0;
        this.minY = 0;
        this.minX = 0;
        this.viewAxis = this.options.dataAxisX ? this.viewHeight : this.viewWidth;
        this.legendItems = [];
        var legend = this.options.legend;

        if (legend && legend.titles && legend.titles.length) {
          for (var i = 0; i < legend.titles.length; i++) {
            this.legendItems.push([legend.titles[i], this.options.colors[i]]);
          }
        }

        this.calcMinMax();
        this.resize();
      }

      calcMinMax() {
        var o = this.options;
        var a = [];

        for (var k in this.data) {
          a = [].concat(a, this.data[k]);
        }

        this.groups = this.data.length;
        var [, max] = minMaxLinear(a);
        this.maxX = this.maxY = o.boundaries && !isNaN(o.boundaries.max) ? o.boundaries.max : max;
        if (isNaN(this.maxX)) this.maxX = 100;
        if (isNaN(this.maxY)) this.maxX = 100;
      }

      calcRatio() {
        this.ratioX = this.ratioY = this.ratio = (this.options.dataAxisX ? this.viewWidth : this.viewHeight) / (this.maxY === this.minY ? this.maxY : this.maxY - this.minY);
      }

      calcBarWidth() {
        var o = this.options;
        var bars = 0;

        for (var i = 0; i < this.data.length; i++) {
          bars += Array.isArray(this.data[i]) ? this.data[i].length : 1;
        }

        var availableSpace = (o.dataAxisX ? this.viewHeight : this.viewWidth) - (this.data.length + 1) * o.groupDistance // space between groups
        - (bars - this.data.length) * o.barDistance; // space between bars

        this.barWidth = availableSpace / bars;
      }

      bars() {
        var axisX = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var o = this.options,
            bars = o.bars;
        var padding = expandPadding(o.padding);
        var ctx = this.ctx;
        var rect = this.canvas.getBoundingClientRect();
        var px,
            py,
            mx,
            my,
            tooltip = false;
        if (!this.data || !this.data.length) return;

        if (this.proxy.mouse) {
          mx = this.proxy.mouse.x - rect.left;
          my = this.proxy.mouse.y - rect.top;
        }

        px = axisX ? padding.left : padding.left + o.groupDistance;
        py = axisX ? padding.top + o.groupDistance : this.viewHeight + padding.top;

        for (var g = 0; g < this.data.length; g++) {
          var graph = this.data[g];
          var data = Array.isArray(graph) ? graph : [graph];
          var labelColor = o.labels.color;
          var name = bars[g];
          var groupWidth = 0;

          for (var i = 0; i < data.length; i++) {
            var delta = data[i] * this.ratio;
            var color = data.length === 1 ? o.colors[g] : o.colors[i];
            var options = {
              color,
              fill: color
            };
            var coords = axisX ? [px, py, px + delta - padding.right, this.barWidth] : [px, py - delta, this.barWidth - 1, delta];
            drawRect(ctx, coords, options);
            var borderX = axisX ? [px, px + delta] : [px, px + this.barWidth - 1];
            var borderY = axisX ? [py, py + this.barWidth - 1] : [py - delta, py];

            if (mx > borderX[0] && mx < borderX[1] && my > borderY[0] && my < borderY[1]) {
              drawRect(ctx, coords, _objectSpread2(_objectSpread2({}, options), {}, {
                fill: 'rgba(255,255,255,.3)'
              }));

              if (o.tooltip) {
                this.showTooltip([o.legend.titles ? o.legend.titles[i] : name, data[i]], graph);
                tooltip = true;
              }
            }

            groupWidth += this.barWidth + o.barDistance;

            if (axisX) {
              py += o.barDistance + this.barWidth;
            } else {
              px += o.barDistance + this.barWidth;
            }
          }

          if (axisX) {
            py -= o.barDistance;
          } else {
            px -= o.barDistance;
          }

          groupWidth -= o.barDistance;

          if (typeof o.onDrawLabel === 'function') {
            name = o.onDrawLabel.apply(null, name);
          }

          drawText(ctx, name, [0, 0], {
            align: 'center',
            color: labelColor,
            stroke: labelColor,
            font: o.font,
            angle: axisX ? 90 : 0,
            translate: axisX ? [px - 20, py - groupWidth / 2] : [px - groupWidth / 2, py + 20]
          });

          if (axisX) {
            py += o.groupDistance;
          } else {
            px += o.groupDistance;
          }
        }

        if (!tooltip && this.tooltip) {
          this.tooltip.remove();
          this.tooltip = null;
        }

        this.static = true;
      }

      draw() {
        var o = this.options;
        super.draw();
        this.calcBarWidth();
        this.calcRatio();

        if (o.dataAxisX) {
          this.axisX();
        } else {
          this.axisY();
        }

        this.bars(o.dataAxisX);
        this.arrows();
        this.legend();
      }

    }
    Object.assign(BarChart.prototype, MixinAxis);
    Object.assign(BarChart.prototype, MixinArrows);
    var barChart = (el, data, options) => new BarChart(el, data, options);

    var defaultBubbleChartOptions = {
      axis: defaultAxis,
      cross: defaultCross,
      arrows: defaultArrows
    };

    class BubbleChart extends Chart {
      constructor(el, data, options) {
        super(el, data, merge({}, defaultBubbleChartOptions, options), 'bubble');
        this.coords = {};
        this.minX = 0;
        this.maxX = 0;
        this.minY = 0;
        this.maxY = 0;
        this.minZ = 0;
        this.maxZ = 0;
        this.legendItems = [];
        var legend = this.options.legend;

        if (legend) {
          for (var i = 0; i < this.data.length; i++) {
            this.legendItems.push([this.data[i].name, this.options.colors[i]]);
          }
        }

        this.calcMinMax();
        this.resize();
      }

      calcMinMax() {
        var o = this.options;
        var a = [];

        for (var k in this.data) {
          var _data = this.data[k].data;
          if (!Array.isArray(_data)) continue;
          a.push(_data);
        }

        var [minX, maxX] = minMax(a, 'x');
        var [minY, maxY] = minMax(a, 'y');
        var [minZ, maxZ] = minMax(a, 'z');
        this.minX = o.boundaries && !isNaN(o.boundaries.minX) ? o.boundaries.minX : minX;
        this.maxX = o.boundaries && !isNaN(o.boundaries.maxX) ? o.boundaries.maxX : maxX;
        this.minY = o.boundaries && !isNaN(o.boundaries.minY) ? o.boundaries.minY : minY;
        this.maxY = o.boundaries && !isNaN(o.boundaries.maxY) ? o.boundaries.maxY : maxY;
        this.minZ = o.boundaries && !isNaN(o.boundaries.minZ) ? o.boundaries.minZ : minZ;
        this.maxZ = o.boundaries && !isNaN(o.boundaries.maxZ) ? o.boundaries.maxZ : maxZ;
        if (isNaN(this.minX)) this.minX = 0;
        if (isNaN(this.maxX)) this.maxX = 100;
        if (isNaN(this.minY)) this.minX = 0;
        if (isNaN(this.maxY)) this.maxX = 100;
        if (isNaN(this.minZ)) this.minX = 0;
        if (isNaN(this.maxZ)) this.maxX = 100;
      }

      calcRatio() {
        this.ratioX = this.viewWidth / (this.maxX === this.minX ? this.maxX : this.maxX - this.minX);
        this.ratioY = this.viewHeight / (this.maxY === this.minY ? this.maxY : this.maxY - this.minY);
        this.ratioZ = this.maxZ / (this.maxZ === this.minZ ? this.maxZ : this.maxZ - this.minZ);
      }

      bubbles() {
        var o = this.options,
            padding = expandPadding(o.padding);
        var ctx = this.ctx;
        if (!this.data || !this.data.length) return;

        for (var i = 0; i < this.data.length; i++) {
          var graph = this.data[i];
          var color = o.colors[i];
          var [x, y, z] = graph.data;

          var _x = Math.floor((x - this.minX) * this.ratioX + padding.left);

          var _y = Math.floor(this.viewHeight + padding.top - (y - this.minY) * this.ratioY);

          var _z = Math.floor(z * this.ratioZ);

          drawCircle(ctx, [_x, _y, _z], {
            fill: color,
            color: color
          });
        }
      }

      floatPoint() {
        if (!this.data || !this.data.length) return;
      }

      add(index, _ref) {
        var [x, y, z] = _ref;
        var shift = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        this.addPoint(index, [x, y, z], shift);
        if (x < this.minX) this.minX = x;
        if (x > this.maxX) this.maxX = x;
        if (y < this.minY) this.minY = y;
        if (y > this.maxY) this.maxY = y;
        if (z < this.minZ) this.minZ = z;
        if (z > this.maxZ) this.maxZ = z;
        this.resize();
      }

      draw() {
        super.draw();
        this.calcRatio();
        this.axisXY();
        this.arrows();
        this.bubbles();
        this.floatPoint();
        this.cross();
        this.legend();
      }

    }
    Object.assign(BubbleChart.prototype, MixinCross);
    Object.assign(BubbleChart.prototype, MixinAxis);
    Object.assign(BubbleChart.prototype, MixinArrows);
    var bubbleChart = (el, data, options) => new BubbleChart(el, data, options);

    var defaultHistogramOptions = {
      barWidth: 10,
      axis: _objectSpread2(_objectSpread2({}, defaultAxis), {}, {
        x: _objectSpread2(_objectSpread2({}, defaultAxis.x), {}, {
          arrow: false
        }),
        y: _objectSpread2(_objectSpread2({}, defaultAxis.y), {}, {
          arrow: false
        })
      }),
      cross: defaultCross,
      graphSize: 40,
      bars: {
        stroke: '#fff'
      }
    };

    class HistogramChart extends Chart {
      constructor(el) {
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        super(el, data, merge({}, defaultHistogramOptions, options), 'histogram');
        this.coords = {};
        this.minX = 0;
        this.maxX = 0;
        this.minY = 0;
        this.maxY = 0;
        this.legendItems = [];
        var legend = this.options.legend;
        var bars = this.options.bars;
        var colors = this.options.colors;

        if (legend) {
          for (var i = 0; i < this.data.length; i++) {
            this.legendItems.push([bars[i].name, colors[i]]);
          }
        }

        this.calcMinMax();
        this.resize();
      }

      calcMinMax() {
        var o = this.options;
        var a = [];

        for (var _data of this.data) {
          if (!Array.isArray(_data)) continue;

          for (var [x1, x2, y] of _data) {
            a.push([x1, x2, y]);
          }
        }

        var [minX1, maxX1] = minMax(a, 0);
        var [minX2, maxX2] = minMax(a, 1);
        var [minY, maxY] = minMax(a, 2);
        this.minX = o.boundaries && !isNaN(o.boundaries.minX) ? o.boundaries.minX : Math.min(minX1, minX2);
        this.maxX = o.boundaries && !isNaN(o.boundaries.maxX) ? o.boundaries.maxX : Math.max(maxX1, maxX2);
        this.minY = o.boundaries && !isNaN(o.boundaries.minY) ? o.boundaries.minY : minY;
        this.maxY = o.boundaries && !isNaN(o.boundaries.maxY) ? o.boundaries.maxY : maxY;
        if (isNaN(this.minX)) this.minX = 0;
        if (isNaN(this.maxX)) this.maxX = 100;
        if (isNaN(this.minY)) this.minX = 0;
        if (isNaN(this.maxY)) this.maxX = 100;
      }

      calcRatio() {
        this.ratioX = this.viewWidth / (this.maxX === this.minX ? this.maxX : this.maxX - this.minX);
        this.ratioY = this.viewHeight / (this.maxY === this.minY ? this.maxY : this.maxY - this.minY);
      }

      bars() {
        var o = this.options,
            padding = expandPadding(o.padding);
        var ctx = this.ctx;
        if (!this.data || !this.data.length) return;

        for (var i = 0; i < this.data.length; i++) {
          var bar = o.bars[i];
          var data = this.data[i];
          var color = bar.color || o.colors[i] || "#000";
          var stroke = bar.stroke || '#fff';

          for (var [x1, x2, y] of data) {
            var _x = Math.floor((x1 - this.minX) * this.ratioX + padding.left);

            var _w = Math.floor((x2 - this.minX) * this.ratioX + padding.left) - _x;

            var _h = (y - this.minY) * this.ratioY;

            var _y = Math.floor(this.viewHeight + padding.top - _h);

            drawRect(ctx, [_x, _y, _w, _h], {
              fill: color,
              color: stroke
            });
          }
        }
      }

      add(index, _ref) {
        var [x1, x2, y] = _ref;
        var shift = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        this.addPoint(index, [x1, x2, y], shift);
        this.minX = this.data[index][0][0];
        this.maxX = x2;
        if (y < this.minY) this.minY = y;
        if (y > this.maxY) this.maxY = y;
        this.resize();
      }

      draw() {
        super.draw();
        this.calcRatio();
        this.axisXY();
        this.bars();
        this.cross();
        this.legend();
      }

    }
    Object.assign(HistogramChart.prototype, MixinCross);
    Object.assign(HistogramChart.prototype, MixinAxis);
    Object.assign(HistogramChart.prototype, MixinAddPoint);
    var histogramChart = (el, data, options) => new HistogramChart(el, data, options);

    var defaultLineChartOptions = {
      hoverMode: 'default',
      // default, advanced
      axis: defaultAxis,
      cross: defaultCross,
      showDots: true,
      type: 'line',
      // line, curve
      accuracy: 2,
      lines: [],
      arrows: defaultArrows
    };

    var drawCurve = function drawCurve(ctx) {
      var coords = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var {
        color = '#000',
        size = 1,
        dash = [],
        tension = 0.25
      } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      ctx.beginPath();
      ctx.save();
      ctx.setLineDash(dash);
      ctx.lineWidth = size;
      ctx.strokeStyle = color;
      ctx.moveTo(coords[0][0], coords[0][1]);

      for (var i = 0; i < coords.length - 1; i++) {
        var x_mid = (coords[i][0] + coords[i + 1][0]) / 2;
        var y_mid = (coords[i][1] + coords[i + 1][1]) / 2;
        var cp_x1 = (x_mid + coords[i][0]) / 2; //let cp_y1 = (y_mid + coords[i][1]) / 2;

        var cp_x2 = (x_mid + coords[i + 1][0]) / 2; //let cp_y2 = (y_mid + coords[i + 1][1]) / 2;

        ctx.quadraticCurveTo(cp_x1, coords[i][1], x_mid, y_mid);
        ctx.quadraticCurveTo(cp_x2, coords[i + 1][1], coords[i + 1][0], coords[i + 1][1]);
      }

      ctx.stroke();
      ctx.restore();
      ctx.closePath();
    };

    var mergeProps = function mergeProps() {
      var result = {};

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      args.forEach(v => {
        if (v && isObject(v)) Object.assign(result, v);
      });
      return result;
    };

    var DEFAULT_LINE_TYPE = 'line';
    var DEFAULT_DOT_TYPE = 'circle';
    var DOT_TRIANGLE = 'triangle';
    var DOT_SQUARE = 'square';
    var DOT_DIAMOND = 'diamond';
    var VALUE_DEFAULT = 'default';
    class LineChart extends Chart {
      constructor(el) {
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        super(el, data, merge({}, defaultLineChartOptions, options), 'line');
        this.coords = {};
        this.minX = 0;
        this.maxX = 0;
        this.minY = 0;
        this.maxY = 0;
        this.legendItems = [];
        var legend = this.options.legend;
        var lines = this.options.lines;
        var colors = this.options.colors;

        if (legend) {
          for (var i = 0; i < lines.length; i++) {
            this.legendItems.push([lines[i].name, colors[i]]);
          }
        }

        this.calcMinMax();
        this.resize();
      }

      calcMinMax() {
        var o = this.options;
        var a = [];

        for (var _data of this.data) {
          if (!Array.isArray(_data)) continue;

          for (var [x, y] of _data) {
            a.push([x, y]);
          }
        }

        var [minX, maxX] = minMax(a, 'x');
        var [minY, maxY] = minMax(a, 'y');
        this.minX = o.boundaries && !isNaN(o.boundaries.minX) ? o.boundaries.minX : minX;
        this.maxX = o.boundaries && !isNaN(o.boundaries.maxX) ? o.boundaries.maxX : maxX;
        this.minY = o.boundaries && !isNaN(o.boundaries.minY) ? o.boundaries.minY : minY;
        this.maxY = o.boundaries && !isNaN(o.boundaries.maxY) ? o.boundaries.maxY : maxY;
        if (isNaN(this.minX)) this.minX = 0;
        if (isNaN(this.maxX)) this.maxX = 100;
        if (isNaN(this.minY)) this.minX = 0;
        if (isNaN(this.maxY)) this.maxX = 100;
      }

      calcRatio() {
        this.ratioX = this.viewWidth / (this.maxX === this.minX ? this.maxX : this.maxX - this.minX);
        this.ratioY = this.viewHeight / (this.maxY === this.minY ? this.maxY : this.maxY - this.minY);
      }

      lines() {
        var _this = this;

        var o = this.options,
            padding = expandPadding(o.padding);
        var ctx = this.ctx;
        var coords;
        if (!this.data || !this.data.length) return;

        var _loop = function _loop(i) {
          var _dots$color, _dots$fill, _dots$size;

          var line = o.lines[i];
          var data = _this.data[i];
          var color = o.colors[i];
          var type = line.type || o.type || DEFAULT_LINE_TYPE;
          coords = [];

          for (var [x, y] of data) {
            var _x = Math.floor((x - _this.minX) * _this.ratioX + padding.left);

            var _y = Math.floor(_this.viewHeight + padding.top - (y - _this.minY) * _this.ratioY);

            coords.push([_x, _y, x, y]);
          }

          if (line.showLine !== false) {
            if (type !== DEFAULT_LINE_TYPE) {
              drawCurve(ctx, coords, {
                color: color,
                size: line.size
              });
            } else {
              drawLine(ctx, coords, {
                color: color,
                size: line.size
              });
            }
          }

          var dots = mergeProps({
            type: DEFAULT_DOT_TYPE
          }, o.dots, line.dots);
          var opt = {
            color: (_dots$color = dots.color) !== null && _dots$color !== void 0 ? _dots$color : color,
            fill: (_dots$fill = dots.fill) !== null && _dots$fill !== void 0 ? _dots$fill : color,
            radius: (_dots$size = dots.size) !== null && _dots$size !== void 0 ? _dots$size : 2
          };
          var drawPointFn = void 0;

          switch (dots.type) {
            case DOT_SQUARE:
              drawPointFn = drawSquare;
              break;

            case DOT_TRIANGLE:
              drawPointFn = drawTriangle;
              break;

            case DOT_DIAMOND:
              drawPointFn = drawDiamond;
              break;

            default:
              drawPointFn = drawCircle;
          }

          if (line.dots && o.showDots !== false) {
            coords.map((_ref) => {
              var [x, y] = _ref;
              drawPointFn(ctx, [x, y, opt.radius], opt);
            });
          }

          _this.coords[line.name] = {
            line,
            coords,
            drawPointFn,
            opt
          };
        };

        for (var i = 0; i < this.data.length; i++) {
          _loop(i);
        }
      }

      floatPoint() {
        var o = this.options;
        var ctx = this.ctx;
        var rect = this.canvas.getBoundingClientRect();
        var tooltip = false;
        if (!this.data || !this.data.length) return;
        if (!this.proxy.mouse) return;
        var {
          x,
          y
        } = this.proxy.mouse;
        var mx = x - rect.left;
        var my = y - rect.top;

        for (var name in this.coords) {
          var item = this.coords[name];
          var drawPointFn = item.drawPointFn;
          var opt = item.opt; // const graph = item.graph

          for (var [px, py, _x, _y] of item.coords) {
            var accuracy = +(o.accuracy || opt.radius);
            var lx = px - accuracy,
                rx = px + accuracy;
            var ly = py - accuracy,
                ry = py + accuracy;

            if (mx > lx && mx < rx && o.hoverMode !== VALUE_DEFAULT) {
              drawPointFn(ctx, [px, py, opt.radius], {
                color: opt.color,
                fill: opt.fill
              });
            }

            if (mx > lx && mx < rx && my > ly && my < ry) {
              if (o.hoverMode === VALUE_DEFAULT) drawPointFn(ctx, [px, py, opt.radius * 2], {
                color: opt.color,
                fill: opt.fill
              });

              if (o.tooltip) {
                this.showTooltip([_x, _y], item.graph);
                tooltip = true;
              }

              break;
            }
          }

          if (!tooltip && this.tooltip) {
            this.tooltip.remove();
            this.tooltip = null;
          }
        }
      }

      add(index, _ref2, shift, align) {
        var [x, y] = _ref2;
        this.addPoint(index, [x, y], shift);
        this.minX = this.data[index][0][0];
        this.maxX = x;

        if (align) {
          if (isObject(align)) {
            this.align(align);
          }
        } else {
          if (y < this.minY) this.minY = y;
          if (y > this.maxY) this.maxY = y;
        }

        this.resize();
      }

      align(_ref3) {
        var {
          minX,
          maxX,
          minY,
          maxY
        } = _ref3;
        var a = [];

        for (var _data of this.data) {
          if (!Array.isArray(_data)) continue;

          for (var [x, y] of _data) {
            a.push([x, y]);
          }
        }

        var [_minX, _maxX] = minMax(a, 'x');
        var [_minY, _maxY] = minMax(a, 'y');
        if (minX) this.minX = _minX;
        if (minY) this.minY = _minY;
        if (maxX) this.maxX = _maxX;
        if (maxY) this.maxY = _maxY;
      }

      draw() {
        super.draw();
        this.calcRatio();
        this.axisXY();
        this.arrows();
        this.lines();
        this.floatPoint();
        this.cross();
        this.legend();
      }

    }
    Object.assign(LineChart.prototype, MixinCross);
    Object.assign(LineChart.prototype, MixinAxis);
    Object.assign(LineChart.prototype, MixinAddPoint);
    Object.assign(LineChart.prototype, MixinArrows);
    var lineChart = (el, data, options) => new LineChart(el, data, options);

    var defaultPieChartOptions = {
      other: {
        color: '#eaeaea'
      },
      labels: {
        font: labelFont,
        color: '#fff'
      },
      showValue: false,
      padding: 0,
      onDrawValue: null
    };

    var drawSector = function drawSector(ctx, _ref) {
      var [x, y, radius = 4, startAngle, endAngle] = _ref;
      var {
        color = '#000',
        fill = '#fff',
        size = 1
      } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      ctx.beginPath();
      ctx.save();
      ctx.setLineDash([]);
      ctx.lineWidth = size;
      ctx.strokeStyle = color;
      ctx.fillStyle = fill;
      ctx.arc(x, y, radius, startAngle, endAngle);
      ctx.lineTo(x, y);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      ctx.closePath();
    };

    class PieChart extends Chart {
      constructor(el, data, options) {
        super(el, data, merge({}, defaultPieChartOptions, options), 'pie');
        this.total = this.data.reduce((acc, curr) => acc + curr, 0);
        this.legendItems = [];
        var legend = this.options.legend;

        if (legend && legend.titles && legend.titles.length) {
          for (var i = 0; i < legend.titles.length; i++) {
            this.legendItems.push([legend.titles[i], this.options.colors[i], this.data[i]]);
          }
        }

        this.resize();
      }

      sectors() {
        var ctx = this.ctx,
            o = this.options;
        var [x, y] = this.center;
        var radius = this.radius;
        var startAngle = 0,
            endAngle = 360,
            offset = 0,
            textVal = '';
        var textX, textY;
        if (!this.data || !this.data.length) return;

        for (var i = 0; i < this.data.length; i++) {
          var _val = this.data[i];
          var color = o.colors[i];
          endAngle = 2 * Math.PI * _val / this.total;
          drawSector(ctx, [x, y, radius, startAngle, startAngle + endAngle], {
            fill: color,
            color: color
          });
          startAngle += endAngle;
        }

        startAngle = 0;

        for (var _i = 0; _i < this.data.length; _i++) {
          var _ref;

          var _val2 = this.data[_i],
              percent = void 0;
          var name = (_ref = this.legendItems[_i] && this.legendItems[_i][0]) !== null && _ref !== void 0 ? _ref : "";
          endAngle = 2 * Math.PI * _val2 / this.total;
          offset = 0;
          percent = Math.round(_val2 * 100 / this.total);
          textVal = o.showValue ? _val2 : percent + "%";

          if (typeof o.onDrawValue === 'function') {
            textVal = o.onDrawValue.apply(null, [name, _val2, percent]);
          }

          textX = x + (radius / 2 + offset) * Math.cos(startAngle + endAngle / 2);
          textY = y + (radius / 2 + offset) * Math.sin(startAngle + endAngle / 2);
          var textW = getTextBoxWidth(ctx, [_val2 + "%"], {
            font: o.labels.font
          });
          drawText(ctx, textVal, [textX - textW / 2, textY + o.labels.font.size / 2], {
            color: o.labels.color,
            font: o.labels.font
          });
          startAngle += endAngle;
        }
      }

      draw() {
        super.draw();
        this.sectors();
        this.legend();
      }

      resize() {
        super.resize();
        this.center = [this.dpiWidth / 2, this.dpiHeight / 2];
      }

    }
    var pieChart = (el, data, options) => new PieChart(el, data, options);

    var defaultStackedBarChartOptions = {
      groupDistance: 0,
      axis: defaultAxis,
      dataAxisX: false,
      arrows: defaultArrows,
      onDrawLabel: null
    };

    class StackedBarChart extends Chart {
      constructor(el, data, options) {
        super(el, data, merge({}, defaultStackedBarChartOptions, options), 'stacked-bar');
        this.barWidth = 0;
        this.maxY = 0;
        this.maxX = 0;
        this.minY = 0;
        this.minX = 0;
        this.viewAxis = this.options.dataAxisX ? this.viewHeight : this.viewWidth;
        this.ratioX = 0;
        this.ratioY = 0;
        this.legendItems = [];
        var legend = this.options.legend;

        if (legend && legend.titles && legend.titles.length) {
          for (var i = 0; i < legend.titles.length; i++) {
            this.legendItems.push([legend.titles[i], this.options.colors[i]]);
          }
        }

        this.calcMinMax();
        this.resize();
      }

      calcMinMax() {
        var o = this.options;
        var a = [];

        for (var k in this.data) {
          var data = this.data[k].data;
          a.push(data.reduce((a, b) => a + b, 0));
        }

        var [, max] = minMaxLinear(a);
        this.maxX = this.maxY = o.boundaries && !isNaN(o.boundaries.max) ? o.boundaries.maxY : max;
        if (isNaN(this.maxX)) this.maxX = 100;
        if (isNaN(this.maxY)) this.maxX = 100;
      }

      calcRatio() {
        this.ratio = this.ratioY = this.ratioX = (this.options.dataAxisX ? this.viewWidth : this.viewHeight) / (this.maxY === this.minY ? this.maxY : this.maxY - this.minY);
      }

      calcBarWidth() {
        var o = this.options;
        var bars = this.data.length;
        var availableSpace = (o.dataAxisX ? this.viewHeight : this.viewWidth) - (this.data.length + 1) * o.groupDistance; // space between groups

        this.barWidth = availableSpace / bars;
      }

      barsX() {
        var o = this.options;
        var padding = expandPadding(o.padding);
        var ctx = this.ctx;
        var px, py;
        var rect = this.canvas.getBoundingClientRect();
        var mx, my;
        var tooltip = false;
        if (!this.data || !this.data.length) return;

        if (this.proxy.mouse) {
          mx = this.proxy.mouse.x - rect.left;
          my = this.proxy.mouse.y - rect.top;
        }

        px = padding.left;
        py = padding.top + o.groupDistance;
        var colors = Array.isArray(o.colors) ? o.colors : o.colors.split(",").map(c => c.trim());

        for (var graph of this.data) {
          var data = graph.data;
          var name = graph.name;
          var labelColor = colors.length > 1 ? o.color : colors[0]; // ???

          var sigma = 0;

          for (var i = 0; i < data.length; i++) {
            var delta = data[i] * this.ratio;
            var color = colors[i];
            var fill = colors[i];
            var valueTitle = o.values[i];
            drawRect(ctx, [px + sigma, py, delta, this.barWidth], {
              color,
              fill
            });

            if (mx > px + sigma && mx < px + delta + sigma && my > py && my < py + this.barWidth) {
              drawRect(ctx, [px + sigma, py, delta, this.barWidth - 1], {
                color: 'rgba(255,255,255,.3)',
                fill: 'rgba(255,255,255,.3)'
              });

              if (o.tooltip) {
                this.showTooltip([valueTitle, data[i]], graph);
                tooltip = true;
              }
            }

            sigma += delta;
          }

          py += o.groupDistance + this.barWidth;

          if (typeof o.onDrawLabel === 'function') {
            name = o.onDrawLabel.apply(null, name);
          }

          drawText(ctx, name, [0, 0], {
            align: 'center',
            color: labelColor,
            stroke: labelColor,
            font: o.font,
            translate: [px - 20, py - this.barWidth / 2],
            angle: 90
          });
        }

        if (!tooltip && this.tooltip) {
          this.tooltip.remove();
          this.tooltip = null;
        }
      }

      barsY() {
        var o = this.options;
        var padding = expandPadding(o.padding);
        var ctx = this.ctx;
        var px, py;
        var rect = this.canvas.getBoundingClientRect();
        var mx, my;
        var tooltip = false;
        if (!this.data || !this.data.length) return;

        if (this.proxy.mouse) {
          mx = this.proxy.mouse.x - rect.left;
          my = this.proxy.mouse.y - rect.top;
        }

        px = padding.left + o.groupDistance;
        py = this.viewHeight + padding.top;
        var colors = Array.isArray(o.colors) ? o.colors : o.colors.split(",").map(c => c.trim());

        for (var graph of this.data) {
          var data = graph.data;
          var name = graph.name;
          var labelColor = colors.length > 1 ? o.color : colors[0];
          var sigma = 0;

          for (var i = 0; i < data.length; i++) {
            var delta = data[i] * this.ratio;
            var color = colors[i];
            var fill = colors[i];
            var valueTitle = o.values[i];
            drawRect(ctx, [px, py - delta - sigma, this.barWidth, delta], {
              color,
              fill
            });

            if (mx > px && mx < px + this.barWidth - 1 && my > py - delta - sigma && my < py - sigma) {
              drawRect(ctx, [px, py - delta - sigma, this.barWidth, delta], {
                color: 'rgba(255,255,255,.3)',
                fill: 'rgba(255,255,255,.3)'
              });

              if (o.tooltip) {
                this.showTooltip([valueTitle, data[i]], graph);
                tooltip = true;
              }
            }

            sigma += delta;
          }

          px += o.groupDistance + this.barWidth;

          if (typeof o.onDrawLabel === 'function') {
            name = o.onDrawLabel.apply(null, name);
          }

          drawText(ctx, name, [0, 0], {
            align: 'center',
            color: labelColor,
            stroke: labelColor,
            font: o.font,
            translate: [px - o.groupDistance - this.barWidth / 2, py + 20],
            angle: 0
          });
        }

        if (!tooltip && this.tooltip) {
          this.tooltip.remove();
          this.tooltip = null;
        }
      }

      draw() {
        var o = this.options;
        super.draw();
        this.calcBarWidth();
        this.calcRatio();

        if (o.dataAxisX) {
          this.axisX();
          this.barsX();
        } else {
          this.axisY();
          this.barsY();
        }

        this.arrows();
        this.legend();
      }

    }
    Object.assign(StackedBarChart.prototype, MixinAxis);
    Object.assign(StackedBarChart.prototype, MixinArrows);
    var stackedBarChart = (el, data, options) => new StackedBarChart(el, data, options);

    var gaugeLabel = {
      font: defaultFont,
      fixed: false,
      color: "#000",
      angle: 0,
      shift: {
        x: 0,
        y: 0
      }
    };
    var defaultGaugeOptions = {
      backStyle: "#a7a7a7",
      fillStyle: "#8f8",
      startFactor: 0.85,
      endFactor: 0.15,
      backWidth: 32,
      valueWidth: 32,
      radius: 100,
      boundaries: {
        min: 0,
        max: 100
      },
      value: gaugeLabel,
      label: {
        min: gaugeLabel,
        max: gaugeLabel
      },
      padding: {
        left: 0,
        right: 0
      }
    };

    var drawArc = function drawArc(ctx, _ref) {
      var [x, y, radius, startAngle, endAngle] = _ref;
      var {
        stroke = '#000',
        fill = '#fff',
        size = 1,
        dash = []
      } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      ctx.beginPath();
      ctx.save();
      ctx.setLineDash(dash);
      ctx.lineWidth = size;
      ctx.strokeStyle = stroke;
      ctx.fillStyle = fill;
      ctx.arc(x, y, radius, startAngle, endAngle);
      ctx.stroke();
      ctx.restore();
      ctx.closePath();
    };

    var getFillColor = (p, colors) => {
      var res = '#fff',
          min = 0;

      for (var i = 0; i < colors.length; i++) {
        var c = colors[i][0];

        if (p >= min && p <= c) {
          res = colors[i][1];
          min = colors[i][0];
        }
      }

      return res;
    };

    class Gauge extends Chart {
      constructor(el, data, options) {
        super(el, data, merge({}, defaultGaugeOptions, options), 'gauge');
        this.min = this.options.boundaries.min;
        this.max = this.options.boundaries.max;
        this.resize();
      }

      gauge() {
        var ctx = this.ctx,
            o = this.options,
            padding = expandPadding(o.padding);
        var [x, y] = this.center;
        x += padding.left;
        y += padding.top;
        var PI = Math.PI,
            min = PI * o.startFactor,
            max = PI * (2 + o.endFactor);
        var r = o.radius * this.radius / 100 - o.backWidth;
        var v = this.data[0],
            p = Math.round(Math.abs(100 * (v - this.min) / (this.max - this.min)));
        var val = min + (max - min) * p / 100;
        var textVal = p;
        var colors = [];

        if (typeof o.onDrawValue === 'function') {
          textVal = o.onDrawValue.apply(null, [v, p]);
        }

        drawArc(ctx, [x, y, r, min, max], {
          size: o.backWidth,
          stroke: o.backStyle
        });

        if (typeof o.fillStyle === "string") {
          colors.push([100, o.fillStyle]);
        } else if (Array.isArray(o.fillStyle)) {
          for (var c of o.fillStyle) {
            colors.push(c);
          }
        }

        drawArc(ctx, [x, y, r, min, val], {
          size: o.valueWidth,
          stroke: getFillColor(p, colors)
        });
        drawText(ctx, textVal, [0, 0], {
          align: "center",
          baseLine: "middle",
          color: o.value.color,
          stroke: o.value.color,
          font: o.value.font || o.font,
          translate: [x + o.value.shift.x, y + o.value.shift.y],
          angle: o.value.angle
        });

        if (o.label.min) {
          drawText(ctx, o.boundaries.min, [0, 0], {
            align: "left",
            baseLine: "middle",
            color: o.label.min.color,
            stroke: o.label.min.color,
            font: o.label.min.font || o.font,
            translate: [x + r * Math.cos(min) + o.backWidth + o.label.min.shift.x, y + r * Math.sin(min) + o.label.min.shift.y],
            angle: 0
          });
        }

        if (o.label.max) {
          drawText(ctx, o.boundaries.max, [0, 0], {
            align: "right",
            baseLine: "middle",
            color: o.label.max.color,
            stroke: o.label.max.color,
            font: o.label.max.font || o.font,
            translate: [x + r * Math.cos(max) - o.backWidth + o.label.max.shift.x, y + r * Math.sin(max) + o.label.max.shift.y],
            angle: 0
          });
        }
      }

      draw() {
        super.draw();
        this.gauge();
      }

    }
    var gauge = (el, data, options) => new Gauge(el, data, options);

    var donutLabel = {
      font: defaultFont,
      fixed: false,
      color: "#000",
      angle: 0,
      shift: {
        x: 0,
        y: 0
      }
    };
    var defaultDonutOptions = {
      backStyle: "#a7a7a7",
      fillStyle: "#8f8",
      backWidth: 100,
      valueWidth: 100,
      radius: 100,
      boundaries: {
        min: 0,
        max: 100
      },
      label: donutLabel,
      padding: 0
    };

    class Donut extends Chart {
      constructor(el, data, options) {
        super(el, data, merge({}, defaultDonutOptions, options), 'donut');
        this.total = this.data.reduce((acc, curr) => acc + curr, 0);
        this.min = this.options.boundaries.min;
        this.max = this.options.boundaries.max;
        this.legendItems = [];
        var legend = this.options.legend;

        if (legend && legend.titles && legend.titles.length) {
          for (var i = 0; i < legend.titles.length; i++) {
            this.legendItems.push([legend.titles[i], this.options.colors[i], this.data[i]]);
          }
        }

        this.resize();
      }

      gauge() {
        var ctx = this.ctx,
            o = this.options;
        var [x, y] = this.center;
        var PI = Math.PI;
        var radius = this.radius - o.backWidth / 2;
        drawArc(ctx, [x, y, radius, 0, 2 * PI], {
          size: o.backWidth,
          stroke: o.backStyle
        });
        var startAngle = 0,
            endAngle = 0;

        for (var i = 0; i < this.data.length; i++) {
          var color = o.colors[i];
          var val = this.data[i];
          endAngle = 2 * Math.PI * val / this.total;
          drawArc(ctx, [x, y, radius, startAngle, startAngle + endAngle], {
            size: o.valueWidth,
            stroke: color
          });

          if (o.label) {
            var _ref;

            var name = (_ref = this.legendItems[i] && this.legendItems[i][0]) !== null && _ref !== void 0 ? _ref : "";
            var percent = Math.round(val * 100 / this.total);
            var textVal = o.showValue ? val : percent + "%";
            var textX = void 0,
                textY = void 0;

            if (typeof o.onDrawValue === 'function') {
              textVal = o.onDrawValue.apply(null, [name, val, percent]);
            }

            textX = x + radius * Math.cos(startAngle + endAngle / 2);
            textY = y + radius * Math.sin(startAngle + endAngle / 2);
            drawText(ctx, textVal, [textX, textY], {
              color: o.label.color,
              font: o.label.font
            });
          }

          startAngle += endAngle;
        }
      }

      draw() {
        super.draw();
        this.gauge();
        this.legend();
      }

      resize() {
        super.resize();
        this.center = [this.dpiWidth / 2, this.dpiHeight / 2];
      }

    }
    var donut = (el, data, options) => new Donut(el, data, options);

    var defaultSegmentOptions = {
      segment: {
        count: 100,
        distance: 4,
        rowDistance: 4,
        height: "auto",
        radius: 0
      },
      ghost: {
        color: "#f1f1f1"
      },
      colors: [[70, '#60a917'], [90, '#f0a30a'], [100, '#a20025']],
      padding: 0,
      margin: 0
    };

    var drawRoundedRect = function drawRoundedRect(ctx, _ref) {
      var [x, y, width, height] = _ref;
      var {
        color = '#000',
        fill = '#fff',
        size = 1,
        dash = [],
        radius = 4
      } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (typeof radius === 'number') {
        radius = {
          tl: radius,
          tr: radius,
          br: radius,
          bl: radius
        };
      } else {
        var defaultRadius = {
          tl: 0,
          tr: 0,
          br: 0,
          bl: 0
        };

        for (var side in defaultRadius) {
          radius[side] = radius[side] || defaultRadius[side];
        }
      }

      ctx.beginPath();
      ctx.fillStyle = fill;
      ctx.strokeStyle = color;
      ctx.moveTo(x + radius.tl, y);
      ctx.lineTo(x + width - radius.tr, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
      ctx.lineTo(x + width, y + height - radius.br);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
      ctx.lineTo(x + radius.bl, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
      ctx.lineTo(x, y + radius.tl);
      ctx.quadraticCurveTo(x, y, x + radius.tl, y);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    };

    class Segment extends Chart {
      constructor(el, data, options) {
        super(el, data, merge({}, defaultSegmentOptions, options), 'segment');
        this.min = 0;
        this.max = 100;

        if (this.options.segment.height !== "auto") {
          var o = this.options;
          var s = o.segment;
          var rowDistance = s.rowDistance * o.dpi;
          this.options.height = this.data.length * (rowDistance + 1 + s.height);
        }

        this.resize();
      }

      segments() {
        var ctx = this.ctx,
            o = this.options,
            s = o.segment;
        var count = s.count ? s.count : 20;
        var distance = s.distance * o.dpi;
        var rowDistance = s.rowDistance * o.dpi;
        var width = this.viewWidth / count - distance;
        var colors = [];
        var padding = expandPadding(o.padding);
        var x,
            y = padding.top + distance;
        var height;

        if (s.height === 'auto') {
          height = (o.height - rowDistance * this.data.length) / this.data.length;
        } else {
          height = s.height;
        }

        if (typeof o.colors === "string") {
          colors.push([100, o.colors]);
        } else if (Array.isArray(o.colors)) {
          for (var c of o.colors) {
            colors.push(c);
          }
        }

        for (var k = 0; k < this.data.length; k++) {
          var value = this.data[k];
          var limit = count * value / 100;
          x = padding.left + 1;

          for (var i = 0; i < count; i++) {
            var color = getFillColor(i * 100 / count, colors);

            if (i <= limit) {
              drawRoundedRect(ctx, [x, y, width, height], {
                color,
                fill: color,
                radius: s.radius
              });
            } else {
              if (o.ghost) {
                drawRoundedRect(ctx, [x, y, width, height], {
                  color: o.ghost.color,
                  fill: o.ghost.color,
                  radius: s.radius
                });
              }
            }

            x += width + distance;
          }

          y += height + rowDistance;
        }
      }

      setData(data) {
        var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var redraw = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
        this.data[index] = data;
        if (redraw) this.resize();
      }

      draw() {
        super.draw();
        this.segments();
      }

    }
    var segment = (el, data, options) => new Segment(el, data, options);

    var defaultCandlestickOptions = {
      axis: defaultAxis,
      boundaries: {
        minY: 0
      },
      candle: {
        size: 1,
        width: 'auto',
        white: 'green',
        black: 'red',
        distance: 4,
        cutoff: false
      },
      ghost: {
        stroke: "#e3e3e3",
        fill: "#e3e3e3"
      },
      arrows: defaultArrows
    };

    var drawCandle = function drawCandle(ctx, _ref) {
      var [x, y, h, by, bw, bh] = _ref;
      var {
        color = 'red',
        size = 1,
        leg = false
      } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      ctx.beginPath();
      ctx.save();
      ctx.setLineDash([]);
      ctx.lineWidth = size;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + h);

      if (leg) {
        ctx.moveTo(x - bw / 2, y);
        ctx.lineTo(x + bw / 2, y);
        ctx.moveTo(x - bw / 2, y + h);
        ctx.lineTo(x + bw / 2, y + h);
      }

      ctx.rect(x - bw / 2, by, bw, bh);
      ctx.stroke();
      ctx.fill();
      ctx.restore();
      ctx.closePath();
    };

    class CandlestickChart extends Chart {
      constructor(el, data, options) {
        super(el, data, merge({}, defaultCandlestickOptions, options), 'candlesticks');
        this.minY = 0;
        this.maxY = 0;
        this.labels = [];
        this.coords = [];
        this.calcMinMax();
        this.resize();
      }

      calcMinMax() {
        var o = this.options;
        var a = [];
        this.labels.length = 0;

        for (var k in this.data) {
          var [x, hi, low] = this.data[k];
          a.push([0, hi]);
          a.push([0, low]);
          this.labels.push(x);
        }

        var [minY, maxY] = minMax(a, 'y');
        this.minY = o.boundaries && !isNaN(o.boundaries.minY) ? o.boundaries.minY : minY;
        this.maxY = o.boundaries && !isNaN(o.boundaries.maxY) ? o.boundaries.maxY : maxY;
      }

      calcRatio() {
        this.ratioY = this.viewHeight / (this.maxY === this.minY ? this.maxY : this.maxY - this.minY);
      }

      getCandleSize() {
        var candle = this.options.candle;
        var dataLength = this.data.length;
        return candle.width === 'auto' ? (this.viewWidth - candle.distance * 2 - candle.distance * (dataLength - 1)) / dataLength : candle.width;
      }

      candlesticks() {
        // data [x, hi, low, open, close]
        var ctx = this.ctx,
            o = this.options,
            candle = o.candle,
            ghost = o.ghost;
        var padding = expandPadding(o.padding);
        var dataLength = this.data.length;
        var rect = this.canvas.getBoundingClientRect();
        var candleSize = this.getCandleSize();
        var mx,
            my,
            tooltip = false;

        if (this.proxy.mouse) {
          mx = this.proxy.mouse.x - rect.left;
          my = this.proxy.mouse.y - rect.top;
        }

        var x = padding.left + candleSize / 2 + candle.distance;
        this.coords.length = 0;

        for (var i = 0; i < dataLength; i++) {
          var y = void 0,
              y2 = void 0,
              o1 = void 0,
              c1 = void 0,
              [xv, hi, low, open, close] = this.data[i];
          var whiteCandle = close > open;
          var candleColor = whiteCandle ? candle.white : candle.black;
          var bx1 = x - candleSize / 2 - candle.distance / 2,
              bx2 = x + candleSize / 2 + candle.distance / 2;
          y = padding.top + this.viewHeight - (hi - this.minY) * this.ratioY;
          y2 = padding.top + this.viewHeight - (low - this.minY) * this.ratioY;
          o1 = padding.top + this.viewHeight - (open - this.minY) * this.ratioY;
          c1 = padding.top + this.viewHeight - (close - this.minY) * this.ratioY;

          if (mx >= bx1 && mx <= bx2) {
            drawRect(ctx, [bx1, padding.top, candleSize + candle.distance, this.viewHeight], {
              color: ghost.stroke,
              fill: ghost.fill
            });
          }

          drawCandle(ctx, [x, y, y2 - y, o1, candleSize, c1 - o1], {
            color: candleColor,
            size: candle.size,
            leg: candle.leg
          });

          if (mx >= bx1 && mx <= bx2 && my >= y && my <= y2) {
            if (o.tooltip) {
              this.showTooltip(this.data[i], {
                type: whiteCandle
              });
              tooltip = true;
            }
          }

          this.coords.push(x);
          x += candleSize + candle.distance;
        }

        if (!tooltip && this.tooltip) {
          this.tooltip.remove();
          this.tooltip = null;
        }
      }

      axis() {
        var _ref, _line$shortLineSize;

        // draw default axis Y
        this.axisY(); // draw axis X

        var ctx = this.ctx,
            o = this.options,
            candle = o.candle;
        var padding = expandPadding(o.padding);
        var axis = o.axis.x,
            label = axis.label,
            line = axis.line,
            arrow = axis.arrow;
        var font = (_ref = label && label.font) !== null && _ref !== void 0 ? _ref : o.font;
        var shortLineSize = (_line$shortLineSize = line.shortLineSize) !== null && _line$shortLineSize !== void 0 ? _line$shortLineSize : 0;
        var candleSize = this.getCandleSize();
        var x = padding.left + candleSize / 2 + candle.distance,
            y = padding.top + this.viewHeight;
        var k = 0;

        for (var i = 0; i < this.labels.length; i++) {
          var value = this.labels[i];
          var labelValue = value;

          if (typeof o.onDrawLabelX === "function") {
            labelValue = o.onDrawLabelX.apply(null, [value]);
          }

          if (i !== 0 && label.skip && k !== label.skip) {
            k++;
          } else {
            var _label$color, _label$shift$x, _label$shift$y;

            k = 1; // short line

            drawVector(ctx, [x, y - shortLineSize, x, y + shortLineSize], {
              color: arrow && arrow.color ? arrow.color : line.color
            }); // label

            drawText(ctx, labelValue.toString(), [0, 0], {
              color: (_label$color = label.color) !== null && _label$color !== void 0 ? _label$color : o.color,
              align: label.align,
              font,
              translate: [x + ((_label$shift$x = label.shift.x) !== null && _label$shift$x !== void 0 ? _label$shift$x : 0), y + font.size + 5 + ((_label$shift$y = label.shift.y) !== null && _label$shift$y !== void 0 ? _label$shift$y : 0)],
              angle: label.angle
            });
          }

          x += candleSize + candle.distance;
        }
      }

      add(_ref2) {
        var [x, hi, low, open, close] = _ref2;
        var shift = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var o = this.options;
        var data;

        if (!this.data) {
          this.data = [];
        }

        data = this.data;

        if (shift && data.length) {
          if (!o.graphSize) {
            data = data.slice(1);
          } else {
            if (data.length >= o.graphSize) {
              data = data.slice(1);
            }
          }
        }

        this.data = data;
        this.data.push([x, hi, low, open, close]);
        this.calcMinMax();
        this.resize();
      }

      draw() {
        super.draw();
        this.calcRatio();
        this.axis();
        this.arrows();
        this.candlesticks();
      }

    }
    Object.assign(CandlestickChart.prototype, MixinAxis);
    Object.assign(CandlestickChart.prototype, MixinTooltip);
    Object.assign(CandlestickChart.prototype, MixinArrows);
    var candlestickChart = (el, data, options) => new CandlestickChart(el, data, options);

    globalThis.chart = {
      areaChart,
      barChart,
      bubbleChart,
      histogramChart,
      lineChart,
      pieChart,
      stackedBarChart,
      gauge,
      donut,
      segment,
      candlestickChart
    };

}());
