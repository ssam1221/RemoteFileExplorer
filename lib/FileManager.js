var fs = require('fs');
var ROOT = 'workspace/';
var Settings = require('../Settings.json');


var FOLDER_FLAG = null;

function FileManager() { }

function setIconImage(filename) {
    console.log(filename)
    var iconFile = Settings.ICON.__DEFAULT__;
    if (filename === FOLDER_FLAG) {
        iconFile = Settings.ICON.__FOLDER__;
    }
    else if (filename === '..') {
        iconFile = Settings.ICON.__FOLDER__;

    }
    else {
        var tmp = filename.split('.');
        var extension = tmp[tmp.length - 1].toUpperCase();

        for (var extensionType in Settings.ICON) {
            if (extensionType === extension) {
                iconFile = Settings.ICON[extensionType];
            }
        }
    }

    var iconData = 'data:image/png;base64, ' + fs.readFileSync(iconFile).toString('base64');

    console.log(iconFile)
    return iconData;
}

function getFiletype(filepath) {
    // No extension
    if (filepath.split('.').length === 1) {
        return Settings.FILETYPE.FILE;
    }
    var tmp = filepath.split('.');
    var extension = tmp[tmp.length - 1].toLowerCase();
    switch (extension.toLowerCase()) {

        default:
            return Settings.FILETYPE.FILE;
        // return Settings.FILETYPE.UNKNOWN;
    }
}

FileManager.prototype.ls = function (path) {
    var filelist = fs.readdirSync(path);

    var returnList = [];

    returnList.push({
        fullPath: path,
        filename: '..',
        fileType: Settings.FILETYPE.FOLDER,
        fileType: Settings.FILETYPE.FOLDER,
       icon :setIconImage(FOLDER_FLAG),
            size: '',
        mtime: ''
    });

    for (var i = 0; i < filelist.length; i++) {
        var filename = filelist[i];
        var fullPath = path + '/' + filename;
        var fileInfo = fs.statSync(fullPath);
        fileInfo.filename = filename;
        if (fileInfo.isDirectory()) {
            fileInfo.fileType = Settings.FILETYPE.FOLDER;
            fileInfo.icon = setIconImage(FOLDER_FLAG);
        }
        else {
            fileInfo.fileType = getFiletype(fullPath);
            fileInfo.icon = setIconImage(filename);
        }
        fileInfo.fullPath = fullPath;
        fileInfo.path = path;
        returnList.push(fileInfo);
    }


    return returnList;
}



module.exports = FileManager;