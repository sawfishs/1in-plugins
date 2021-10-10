const PluginBase = require('../base.js');
const uuid = '3613d064-c366-4bc4-a230-06a1114c3c8a';
const name = 'IP';
const description = {'en': 'Get external IP address.', 'zh-Hans': '获取外网IP地址。'};
const summary = '';
const type = PluginBase.plugin_type.COMMAND;
const command = 'ip';
const pattern = null;

const process = function (callback) {

    let data = [];
    const https = require('http')
    const options = {
        host: 'icanhazip.com',
    }

    const req = https.request(options, res => {
        res.on('data', function (chunk) {
                const label = 'External IP';
                const content = ('' + chunk).trim();
                let item = PluginBase.BuildItem(label, content, PluginBase.item_type.TEXT);
                data.push(item);
                callback(data);
            }
        )
    })
    req.on('error', error => {
        data.push(PluginBase.BuildErrorItem(error.message));
        callback(data);
    })
    req.end(() => {

    })

}

module.exports = new PluginBase.BuildPlugin(uuid, name, description, summary, type, command, pattern, process);
