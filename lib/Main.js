var Settings = require('../Settings.json');
var ServerManager = require('./ServerManager');

var serverManager = new ServerManager();


serverManager.open({
    UI_Port : Settings.Port.UI,
    File_Port: Settings.Port.File
});