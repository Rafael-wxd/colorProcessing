const rgbaReg = /^(rgba|RGBA)/;
const rgbReg = /^(rgb|RGB)/;
const hexReg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;

const hsbToRgbObj = function (hsb) {
  const rgb = {};
  let h = Math.round(hsb['h']);
  let s = Math.round(hsb['s'] * 255 / 100);
  let b = Math.round(hsb['b'] * 255 / 100);
  if (s === 0) {
    rgb['r'] = rgb['g'] = rgb['b'] = b;
  } else {
    let num1 = b;
    let num2 = (255 - s) * b / 255;
    let num3 = (num1 - num2) * (h % 60) / 60;
    if (h === 360) {
      h = 0;
    }
    if (h < 60) {
      rgb['r'] = num1;
      rgb['g'] = num2 + num3;
      rgb['b'] = num2;
    } else if (h < 120) {
      rgb['r'] = num1 - num3;
      rgb['g'] = num1;
      rgb['b'] = num2;
    } else if (h < 180) {
      rgb['r'] = num2;
      rgb['g'] = num1;
      rgb['b'] = num2 + num3;
    } else if (h < 240) {
      rgb['r'] = num2;
      rgb['g'] = num1 - num3;
      rgb['b'] = num1;
    } else if (h < 300) {
      rgb['r'] = num2 + num3;
      rgb['g'] = num2;
      rgb['b'] = num1;
    } else if (h < 360) {
      rgb['r'] = num1;
      rgb['g'] = num2;
      rgb['b'] = num1 - num3;
    } else {
      rgb['r'] = 0;
      rgb['g'] = 0;
      rgb['b'] = 0;
    }
  }
  return {
    r: Math.round(rgb['r']),
    g: Math.round(rgb['g']),
    b: Math.round(rgb['b']),
    a: 1
  }
}
const hexToRgbObj = function (hex) {
  hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
  return {
    r: hex >> 16,
    g: (hex & 0x00FF00) >> 8,
    b: (hex & 0x0000FF),
    a: 1
  }
}
const rgbObjToHsb = function (rgb) {
  const hsb = {
    h: 0,
    s: 0,
    b: 0
  }
  const min = Math.min(rgb['r'], rgb['g'], rgb['b']);
  const max = Math.max(rgb['r'], rgb['g'], rgb['b']);
  const cz = max - min;
  hsb['b'] = max;
  hsb['s'] = max !== 0 ? 255 * cz / max : 0;
  if (hsb['s'] !== 0) {
    if (rgb['r'] === max) {
      hsb['h'] = (rgb['g'] - rgb['b']) / cz;
    } else if (rgb['g'] === max) {
      hsb['h'] = 2 + (rgb['b'] - rgb['r']) / cz;
    } else {
      hsb['h'] = 4 + (rgb['r'] - rgb['g']) / cz;
    }
  } else {
    hsb['h'] = -1;
  }
  hsb['h'] *= 60;
  if (hsb['h'] < 0) {
    hsb['h'] += 360;
  }
  hsb['s'] *= 100 / 255;
  hsb['b'] *= 100 / 255;
  return hsb;
}
const hexToHsb = function (hex) {
  return rgbObjToHsb(hexToRgbObj(hex));
}
const rgbObjToHex = function (rgb) {
  var hex = [
    rgb['r'].toString(16),
    rgb['g'].toString(16),
    rgb['b'].toString(16)
  ];
  hex.map(function (str, i) {
    if (str.length == 1) {
      hex[i] = '0' + str;
    }
  });
  return '#' + hex.join('');
}
const rgbStrToHex = function (color) {
  var rgb = color.split(',');
  var r = parseInt(rgb[0].split('(')[1]);
  var g = parseInt(rgb[1]);
  var b = parseInt(rgb[2].split(')')[0]);
  var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  return hex;
}
const rgbaStrToRgba = function (str) {
  const strArr = str.toLocaleUpperCase().replace('RGBA(', '').replace(')', '').split(',');
  const rgba = {
    r: parseInt(strArr[0]),
    g: parseInt(strArr[1]),
    b: parseInt(strArr[2]),
    a: parseFloat(strArr[3]),
  }
  return rgba;
}
const getThemeCluster = function (theme) {
  const tintColor = (color, tint) => {
    let red = parseInt(color.slice(0, 2), 16);
    let green = parseInt(color.slice(2, 4), 16);
    let blue = parseInt(color.slice(4, 6), 16);

    if (tint === 0) {
      return [red, green, blue].join(',');
    } else {
      red += Math.round(tint * (255 - red));
      green += Math.round(tint * (255 - green));
      blue += Math.round(tint * (255 - blue));

      red = red.toString(16);
      green = green.toString(16);
      blue = blue.toString(16);

      return `#${ red }${ green }${ blue }`;
    }
  };

  const shadeColor = (color, shade) => {
    let red = parseInt(color.slice(0, 2), 16);
    let green = parseInt(color.slice(2, 4), 16);
    let blue = parseInt(color.slice(4, 6), 16);

    red = Math.round((1 - shade) * red);
    green = Math.round((1 - shade) * green);
    blue = Math.round((1 - shade) * blue);

    red = red.toString(16);
    green = green.toString(16);
    blue = blue.toString(16);

    return `#${ red }${ green }${ blue }`;
  };

  const clusters = [theme];
  for (let i = 0; i <= 9; i++) {
    clusters.push(tintColor(theme, Number((i / 10).toFixed(2))));
  }
  clusters.push(shadeColor(theme, 0.1));
  return clusters;
}

class ColorProcessing {
  constructor (color) {
    if (typeof color === 'string') {
      if (rgbaReg.test(color)) {
        this.init('rgba', rgbaStrToRgba(color));
      } else if (rgbReg.test(color)) {
        this.init('hex', rgbStrToHex(color));
      } else if (hexReg.test(color)) {
        this.init('rgb', hexToRgbObj(color));
      } else {
        throw new Error('The color type is not recognized. string');
      }
    } else if (typeof color === 'object' && !Array.isArray(color)) {
      if (color['r'] && color['g'] && color['b'] && color['a']) {
        const {r, g, b, a} = color;
        this.init('rgba', {r, g, b, a});
      } else if (color['r'] && color['g'] && color['b']) {
        this.init('hsb', rgbObjToHsb(color));
      } else if (color['h'] && color['s'] && color['b']) {
        this.init('rgb', hsbToRgbObj(color));
      } else {
        throw new Error('The color type is not recognized. object');
      }
    } else {
      throw new Error('The color type is not recognized. null');
    }
  }
  init (type, color) {
    if (type === 'hex') {
      this.$hex = color;
      this.$rgba = hexToRgbObj(color);
      this.$hsb = rgbObjToHsb(this.$rgba);
    } else if (type === 'rgb') {
      this.$rgba = color;
      this.$hex = rgbObjToHex(color);
      this.$hsb = rgbObjToHsb(color);
    } else if (type === 'hsb') {
      this.$hsb = color;
      this.$rgba = hsbToRgbObj(color);
      this.$hex = rgbObjToHex(this.$rgba);
    } else if (type === 'rgba') {
      this.$rgba = color;
      this.$hsb = rgbObjToHsb(color);
      this.$hex = rgbObjToHex(this.$rgba);
    }
  }
  rgbToString () {
    const {r, g, b} = this.$rgba;
    return `rgb(${r}, ${g}, ${b})`;
  }
  rgbaToString () {
    const {r, g, b, a} = this.$rgba;
    return `rgb(${r}, ${g}, ${b}, ${a})`;
  }
  getThemeCluster (newColorProcessing) {
    if (!(newColorProcessing instanceof ColorProcessing)) {
      throw new Error('newColorProcessing is not instanceof ColorProcessing');
    }
    return {
      oldColors: getThemeCluster(this.$hex.replace('#', '')),
      newColors: getThemeCluster(newColorProcessing.$hex.replace('#', ''))
    }
  }
}

['hex', 'rgba', 'hsb'].forEach((key) => {
  ColorProcessing.prototype[key] = function () {
    return this['$' + key];
  }
});
