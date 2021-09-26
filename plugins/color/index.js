const PluginBase = require('../base.js');
const uuid = '39dd0524-647d-4004-abc7-46a0794b5a30';
const name = 'Color';
const description = {'en': 'Convert various color values.', 'zh-Hans': '转换各种颜色值。'};
const summary = '';
const type = PluginBase.plugin_type.PATTERN;
const command = '';

const rgbPattern = /^rgb\((\d{1,3}),\s{0,5}(\d{1,3}),\s{0,5}(\d{1,3})\)$/;
const hexPattern = /^#[0-9a-fA-F]{6}$/;
let rgbMatch, hexMatch;
const pattern = function (input) {
    rgbMatch = rgbPattern.exec(input);
    hexMatch = hexPattern.exec(input);
    if (rgbMatch !== null || hexMatch != null) {
        return true;
    } else {
        return false;
    }
};

const process = function (callback, input) {
    let data = [];
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

    let label = 'HEX';
    let content = '#' + redHex + greenHex + blueHex;
    let value = content;
    let item_hex = PluginBase.BuildItem(label, content, PluginBase.item_type.COLOR, value);
    data.push(item_hex);

    label = 'RGB';
    content = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
    let item_rgb = PluginBase.BuildItem(label, content, PluginBase.item_type.COLOR, value);
    data.push(item_rgb);

    label = 'NSColor';
    content = '[NSColor colorWithRed:' + (Math.round((red / 255) * 1000) / 1000).toFixed(3)
        + ' green:' + (Math.round((green / 255) * 1000) / 1000).toFixed(3) + ' blue:'
        + (Math.round((blue / 255) * 1000) / 1000).toFixed(3) + ' alpha:1]';
    let item_nscolor = PluginBase.BuildItem(label, content, PluginBase.item_type.COLOR, value);
    data.push(item_nscolor);

    label = 'Flutter';
    content = 'Color(0xFF' + redHex + greenHex + blueHex + ')';
    let item_flutter = PluginBase.BuildItem(label, content, PluginBase.item_type.COLOR, value);
    data.push(item_flutter);

    callback(data);
}

exports.handle = new PluginBase.BuildPlugin(uuid, name, description, summary, type, command, pattern, process);
