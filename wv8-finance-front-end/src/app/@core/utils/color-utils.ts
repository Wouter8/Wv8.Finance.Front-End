var tinycolor = require("tinycolor2");

export class ColorUtils {
  static colorShade(color, percentage) {
    return tinycolor(color).lighten(percentage).toString();
  }
}
