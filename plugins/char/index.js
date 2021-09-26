const PluginBase = require('../base.js');
const uuid = '3ff0313e-384a-43aa-85e0-098d6fe38a3a';
const name = 'Char';
const description = {'en': 'Display various encodings of char.', 'zh-Hans': '显示单个Unicode字符各种编码。'};
const summary = '';
const type = PluginBase.plugin_type.PATTERN;
const command = '';
const pattern = function (input) {
    return 1 === Array.from(input).length;
};

const process = function (callback, input) {
    let data = [];
    let codepoint = input.codePointAt(0);

    let label = 'Code point';
    let content = codepoint + '';
    let item_codepoint = PluginBase.BuildItem(label, content);
    data.push(item_codepoint);

    label = 'Unicode';
    content = 'U+' + (codepoint).toString(16)
        .padStart(4, '0').toUpperCase();
    let item_unicode = PluginBase.BuildItem(label, content);
    data.push(item_unicode);

    let python_str;
    if (codepoint > 0xffff) {
        python_str = '\\U' + (codepoint).toString(16)
            .padStart(8, '0').toUpperCase();
    } else {
        python_str = '\\u' + (codepoint).toString(16)
            .padStart(4, '0').toUpperCase();
    }
    label = 'Python3';
    content = python_str;
    let item_python3 = PluginBase.BuildItem(label, content);
    data.push(item_python3);

    let es6_str;
    if (codepoint > 0xffff) {
        es6_str = '\\u{' + (codepoint).toString(16)
            .toUpperCase() + '}';
    } else {
        es6_str = '\\u{' + (codepoint).toString(16)
            .padStart(4, '0').toUpperCase() + '}'
    }
    label = 'ES6 Unicode';
    content = es6_str;
    let item_es6 = PluginBase.BuildItem(label, content);
    data.push(item_es6);

    let buf = Buffer.from(input, 'utf8');
    let utf8_str = buf.toString('hex').toUpperCase()
    label = 'UTF-8';
    content = splitString(utf8_str);
    let item_utf8 = PluginBase.BuildItem(label, content);
    data.push(item_utf8);

    buf = Buffer.from(input, 'utf16le');
    let utf16_str = buf.toString('hex').toUpperCase()
    label = 'UTF16-le';
    content = splitString(utf16_str);
    let item_utf16 = PluginBase.BuildItem(label, content);
    data.push(item_utf16);

    let json_str;
    if (input.length === 2) {
        json_str = '\\u' + input.charCodeAt(0).toString(16).toUpperCase()
        json_str += '\\u' + input.charCodeAt(1).toString(16).toUpperCase()
    } else if (codepoint > 126) {
        json_str = '\\u' + codepoint.toString(16).toUpperCase()
    } else {
        json_str = input;
    }
    label = 'JSON dumps';
    content = json_str;
    let item_json = PluginBase.BuildItem(label, content);
    data.push(item_json);
    callback(data);

    function splitString(str) {
        let s = str.match(/(.{1,2})/g);
        let result = '';
        for (let key in s) {
            result += s[key];
            result += ' ';
        }
        return result.trim();
    }

}

exports.handle = new PluginBase.BuildPlugin(uuid, name, description, summary, type, command, pattern, process);
