
var fs = require('fs');

var Settings = require('../Settings.json');
var FileManager = require('./FileManager');
var UIManager = require('./UIManager');
var express = require('express');

var fileManager = new FileManager(),
    uiManager = new UIManager();

var uiServer,
    fileServer;


var PORT = {
    UI: 50000,
    FILE: 50001
}

var FAVICON_DATA = fs.readFileSync('./resources/favicon.ico');

function ServerManager(portObj) {
    // console.log(arguments)
    if (typeof portObj !== 'object') {

    }

    fileServer = express();
    fileServer.use(express.static('./workspace'));

    uiServer = express();

    uiServer.get('/favicon.ico', function (req, res) {
        // res.send('Hello World!');

        res.send(FAVICON_DATA);
    });
    uiServer.get('*', function (req, res) {
        var list = fileManager.ls(Settings.Root + req.path);
        var html = uiManager.createTable(list);
        res.send(html);
    });
}

function getMyIp() {

    var os = require('os');
    var ifaces = os.networkInterfaces();

    var iplist = [];

    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;

        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
            }

            // if (alias >= 1) {
            //     // this single interface has multiple ipv4 addresses
            //     console.log(ifname + ':' + alias, iface.address);
            // } else {
            //     // this interface has only one ipv4 adress
            //     console.log(ifname + ':' + iface.address);
            // }
            iplist.push(iface.address)
            ++alias;
        });
    });

    return iplist;
}

ServerManager.prototype.open = function () {
    var iplist = getMyIp();
    var flags = {
        ui: false,
        file: false
    }
    uiServer.listen(PORT.UI, function () {
        flags.ui = true;
    });

    fileServer.listen(PORT.FILE, function () {
        flags.file = true;
    });
    var interval = setInterval(function () {
        if (flags.ui === true && flags.file === true) {
            console.log('Go to any below URL using web browser : ')
            for (var i = 0; i < iplist.length; i++) {
                console.log('  http://' + iplist[i] + ':' + PORT.UI)
            }
            clearInterval(interval);
        }
    })
}

module.exports = ServerManager;