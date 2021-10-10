const PluginBase = require('../base.js');
const uuid = 'a4d02a30-a1b1-44cd-bf26-19190bff8521';
const name = 'Plugin';
const description = {'en': 'Plugins manager.', 'zh-Hans': '插件管理器。'};
const summary = '';
const type = PluginBase.plugin_type.LEADS;
const command = 'plugin';
const pattern = null;

const process = function (callback, leadsPara, pluginsHome) {

    const git = require("nodegit");
    const fs = require("fs");
    const repoLink = 'https://gitlab.com/sawfishs/1in-plugins.git';

    let data = [];

    function installPlugins() {
        git.Clone(repoLink, pluginsHome)
            .then(function () {
                data.push(PluginBase.BuildInfoItem('Plugins install successfully.'));
                callback(data);
            }).catch(function (err) {
            let errorInfo;
            switch (err.errno) {
                case -1:
                    errorInfo = 'Failed to resolve address for plugins repository.';
                    break;
                case -4:
                    errorInfo = 'Plugins has been installed.';
                    break;
                default:
                    if (fs.existsSync(pluginsHome)) {
                        fs.rmSync(pluginsHome, {recursive: true});
                    }
                    errorInfo = 'An error occurred.';
            }
            data.push(PluginBase.BuildErrorItem(errorInfo));
            callback(data);
        });

    }

    function cleanupPlugins() {
        try {
            if (fs.existsSync(pluginsHome)) {
                fs.rmSync(pluginsHome, {recursive: true});
            }
            data.push(PluginBase.BuildInfoItem('Plugins cleanup successfully.'));
            callback(data);
        } catch (e) {
            data.push(PluginBase.BuildErrorItem('An error occurred.'));
            callback(data);
        }
    }

    function updatePlugins() {
        let repo;
        git.Repository.open(pluginsHome).then(function (repository) {
            repo = repository;
        }).then(function () {
            repo.fetchAll(null).catch(function (err){
                throw 'break';
            });
        }).then(function () {
            repo.mergeBranches('main', 'origin/' + 'main',
                null, null,
                null, null).catch(function (err){
                throw 'break';
            });
        }).then(function () {
            data.push(PluginBase.BuildInfoItem('Plugins update successfully.'));
            callback(data);
        }).catch(function (err) {
            let errorInfo;
            switch (err.errno) {
                case -3:
                    errorInfo = 'Failed to open plugins directory.';
                    break;
                default:
                    errorInfo = 'An error occurred.';
            }
            data.push(PluginBase.BuildErrorItem(errorInfo));
            callback(data);
        });
    }

    switch (leadsPara) {
        case 'install':
            installPlugins();
            break;
        case 'update':
            updatePlugins();
            break;
        case 'list':
            let fs = require('fs');
            if (fs.existsSync(pluginsHome)) {
                require('require-all')({
                    dirname: pluginsHome + '/plugins',
                    filter: /index\.js$/,
                    resolve: function (plugin) {
                        let item = PluginBase.BuildItem(plugin.name, plugin.description['zh-Hans'],
                            PluginBase.item_type.PLUGIN, plugin.uuid, plugin.summary);
                        data.push(item);
                    }
                });
                callback(data);
            }
            break;
        case 'cleanup':
            cleanupPlugins();
            break;
    }

}

module.exports = new PluginBase.BuildPlugin(uuid, name, description, summary, type, command, pattern, process);
