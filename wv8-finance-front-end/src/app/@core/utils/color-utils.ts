var tinycolor = require("tinycolor2");

export class ColorUtils {
  static lighten(color, percentage) {
    return tinycolor(color).lighten(percentage).toString();
  }
}
