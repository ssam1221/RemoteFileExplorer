var fs = require('fs');
var ROOT = 'workspace/';
var Settings = require('../Settings.json');


function FileManager() { }

function getFiletype(filepath) {
    // No extention
    if (filepath.split('.').length === 1) {
        return Settings.FILETYPE.FILE;
    }
    var tmp = filepath.split('.');
    var extention = tmp[tmp.length - 1].toLowerCase();
    switch (extention.toLowerCase()) {

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
        }
        else {
            fileInfo.fileType = getFiletype(fullPath);
        }
        fileInfo.fullPath = fullPath;
        fileInfo.path = path;
        returnList.push(fileInfo);
    }


    return returnList;
}



module.exports = FileManager;