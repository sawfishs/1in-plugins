exports.uuid='3ff0313e-384a-43aa-85e0-098d6fe38a3a';
exports.name='Char';
exports.description ={'en':'Display various encodings of char.','zh-Hans':'显示单个Unicode字符各种编码。'};
exports.type = 'pattern';
exports.command = null;
exports.pattern = function (input) {
    return 1 === Array.from(input).length;
}

exports.process = function (getData, input) {

    let data = [];
    let codepoint = input.codePointAt(0);
    let item_codepoint = {};
    item_codepoint.label = 'Code point';
    item_codepoint.content = codepoint + '';
    item_codepoint.type = 'char';
    item_codepoint.value = input;
    data.push(item_codepoint);

    let item_unicode = {};
    item_unicode.label = 'Unicode';
    item_unicode.content = 'U+' + (codepoint).toString(16)
        .padStart(4, '0').toUpperCase();
    item_unicode.type = 'char';
    item_unicode.value = input;
    data.push(item_unicode);

    let item_python3 = {};
    let python_str;
    if (codepoint > 0xffff) {
        python_str = '\\U' + (codepoint).toString(16)
            .padStart(8, '0').toUpperCase();
    } else {
        python_str = '\\u' + (codepoint).toString(16)
            .padStart(4, '0').toUpperCase();
    }
    item_python3.label = 'Python3';
    item_python3.content = python_str;
    item_python3.type = 'char';
    item_python3.value = input;
    data.push(item_python3);

    let item_es6 = {};
    let es6_str;
    if (codepoint > 0xffff) {
        es6_str = '\\u{' + (codepoint).toString(16)
            .toUpperCase() + '}';
    } else {
        es6_str = '\\u{' + (codepoint).toString(16)
            .padStart(4, '0').toUpperCase() + '}'
    }
    item_es6.label = 'ES6 Unicode';
    item_es6.content = es6_str;
    item_es6.type = 'char';
    item_es6.value = input;
    data.push(item_es6);

    let item_utf8 = {};
    let buf = Buffer.from(input, 'utf8');
    let utf8_str = buf.toString('hex').toUpperCase()

    item_utf8.label = 'UTF-8';
    item_utf8.content = splitString(utf8_str);
    item_utf8.type = 'char';
    item_utf8.value = input;
    data.push(item_utf8);

    let item_utf16 = {};
    buf = Buffer.from(input, 'utf16le');
    let utf16_str = buf.toString('hex').toUpperCase()
    item_utf16.label = 'UTF16-le';
    item_utf16.content = splitString(utf16_str);
    item_utf16.type = 'char';
    item_utf16.value = input;
    data.push(item_utf16);

    let item_json = {}
    let json_str;
    if (input.length === 2) {
        json_str = '\\u' + input.charCodeAt(0).toString(16).toUpperCase()
        json_str += '\\u' + input.charCodeAt(1).toString(16).toUpperCase()
    } else if (codepoint > 126) {
        json_str = '\\u' + codepoint.toString(16).toUpperCase()
    } else {
        json_str = input;
    }
    item_json.label = 'JSON dumps';
    item_json.content = json_str;
    item_json.type = 'char';
    item_json.value = input;
    data.push(item_json);

    getData(data);

}

function splitString(str) {
    let s = str.match(/(.{1,2})/g);
    let result = '';
    for (let key in s) {
        result += s[key];
        result += ' ';
    }
    return result.trim();
}
