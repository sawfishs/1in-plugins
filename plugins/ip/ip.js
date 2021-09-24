exports.uuid='3613d064-c366-4bc4-a230-06a1114c3c8a';
exports.name='IP';
exports.description ={'en':'Get external IP address','zh-Hans':'获取外网IP地址'};
exports.type = 'command';
exports.command = 'ip';
exports.pattern = null;

exports.process = function (getData) {
    let data = [];
    let item = {};

    const https = require('http')
    const options = {
        host: 'icanhazip.com',
    }
    try {
        const req = https.request(options, res => {
            res.on('data', function (chunk) {
                item.label = 'External IP';
                item.content = ('' + chunk).trim();
                item.type = 'ip';
                item.value = item.content;
                data.push(item)
                getData(data);
            })
        })
        req.end()
    } catch (e) {

    }
}