exports.uuid = '39dd0524-647d-4004-abc7-46a0794b5a30';
exports.name = 'Color';
exports.description = {'en': 'Convert various color values.', 'zh-Hans': '转换各种颜色值。'};
exports.type = 'pattern';
exports.command = null;
exports.pattern = function (input) {
    rgbMatch = rgbPattern.exec(input);
    hexMatch = hexPattern.exec(input);
    if (rgbMatch !== null || hexMatch != null) {
        return true;
    } else {
        return false;
    }
}

let rgbPattern = /^rgb\((\d{1,3}),\s{0,5}(\d{1,3}),\s{0,5}(\d{1,3})\)$/;
let hexPattern = /^#[0-9a-fA-F]{6}$/;
let rgbMatch, hexMatch;
let data = [];
exports.process = function (getData, input) {
    let red, green, blue;
    if (rgbMatch) {
        red = parseInt(rgbMatch[1], 10);
        green = parseInt(rgbMatch[2], 10);
        blue = parseInt(rgbMatch[3], 10);
        if (red > 255) red = 255;
        if (green > 255) green = 255;
        if (blue > 255) blue = 255;
    } else {
        red = parseInt(input.substring(1, 3), 16);
        green = parseInt(input.substring(3, 5), 16);
        blue = parseInt(input.substring(5, 7), 16);
    }
    
    let redHex = red.toString(16).padStart(2, '0').toUpperCase();
    let greenHex = green.toString(16).padStart(2, '0').toUpperCase();
    let blueHex = blue.toString(16).padStart(2, '0').toUpperCase();
    let item_hex = {};
    item_hex.label = 'HEX';
    item_hex.content = '#' + redHex + greenHex + blueHex;
    item_hex.type = 'color';
    item_hex.value = item_hex.content;
    data.push(item_hex);

    let item_rgb = {};
    item_rgb.label = 'RGB';
    item_rgb.content = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
    item_rgb.type = 'color';
    item_rgb.value = item_hex.content;
    data.push(item_rgb);

    let item_nscolor = {};
    item_nscolor.label = 'NSColor';
    item_nscolor.content = '[NSColor colorWithRed:' + (Math.round((red / 255) * 1000) / 1000).toFixed(3)
        + ' green:' + (Math.round((green / 255) * 1000) / 1000).toFixed(3) + ' blue:'
        + (Math.round((blue / 255) * 1000) / 1000).toFixed(3) + ' alpha:1]';
    item_nscolor.type = 'color';
    item_nscolor.value = item_hex.content;
    data.push(item_nscolor);

    let item_flutter = {};
    item_flutter.label = 'Flutter';
    item_flutter.content = 'Color(0xFF' + redHex + greenHex + blueHex + ')';
    item_flutter.type = 'color';
    item_flutter.value = item_hex.content;
    data.push(item_flutter);

    getData(data);

}