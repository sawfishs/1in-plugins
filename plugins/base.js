const plugin_type = {
    COMMAND: 'command',
    LEADS: 'leads',
    PATTERN: 'pattern'
};

const item_type = {
    TEXT: 'text',
    INFO: 'info',
    ERROR: 'error',
    NUMBER: 'number',
    COLOR: 'color',
    PLUGIN: 'plugin'
};

const item_style = {
    LIST: 'list',
    GRID: 'grid',
    HTML: 'html',
};

const Plugin = function (uuid, name, description, summary, type, command, pattern, process) {

    this.uuid = uuid;
    this.name = name;
    this.description = description;
    this.summary = summary;
    this.type = type;
    this.command = command;
    this.pattern = pattern;
    this.process = process;

};

const DataItem = function (label, content, type = item_type.TEXT, value = '',
                          summary = '', style = item_style.LIST) {

    let item = {};
    item.label = label;
    item.content = content;
    item.type = type;
    item.value = value;
    item.summary = summary;
    item.style = style;
    return item;
};

const BuildInfoItem = function (content) {
    return DataItem('Info', content, item_type.INFO);
};

const BuildErrorItem = function (content) {
    return DataItem('Error', content, item_type.ERROR);
}

exports.plugin_type = plugin_type;
exports.item_type = item_type;
exports.item_style = item_style;
exports.BuildPlugin = Plugin;
exports.BuildItem = DataItem;
exports.BuildInfoItem = BuildInfoItem;
exports.BuildErrorItem = BuildErrorItem;
