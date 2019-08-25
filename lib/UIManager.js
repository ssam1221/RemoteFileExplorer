var Settings = require('../Settings.json');

function UIManager() { }

function beforeBody() {

    return ''
        + '<html>'
        + '<head>'
        + '<title>File Browser</title>'
        + '<style>'
        + '    th, td {'
        + '        border  : 1px solid #000000;'
        + '        margin  : 0px;'
        + '        padding : 5px;'
        + '        cursor: default;'
        + '        text-decoration: none;'
        + '        color: black;'
        + '    }'
        + '    td.folder {'
        // + '        font-size: 18px;'
        + '        font-weight: bold;'
        + '    }'
        + '    td.filesize {'
        + '        text-align: right;'
        + '    }'
        + '</style>'
        + '</head>'
        + '<body>'
}

function afterBody() {
    return ''
        + '</body>'
        + '</html>'
}

UIManager.prototype.createTable = function (data) {

    var folderList = [],
        fileList = [],
        sortedList = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].fileType === Settings.FILETYPE.FOLDER) {
            folderList.push(data[i]);
        }
        else {
            fileList.push(data[i]);
        }
    }

    folderList.sort(function (a, b) {
        return a.filename < b.filename ? -1 : a.filename > b.filename ? 1 : 0;
    });

    fileList.sort(function (a, b) {
        return a.filename < b.filename ? -1 : a.filename > b.filename ? 1 : 0;
    });

    for (var i = 0; i < folderList.length; i++) {
        sortedList.push(folderList[i]);
    }
    for (var i = 0; i < fileList.length; i++) {
        sortedList.push(fileList[i]);
    }

    var html = beforeBody()
        + '<div id = "filelist">';
    html += '</div>'
        + afterBody();

    // Generate file table
    html += '<script>' + '\n'
        + 'window.onload = function() {' + '\n'

    html += ''
        + '    var temp = location.href.split("/")' + '\n'
        + '    var previousURL = "http://"' + '\n'
        + '    for(var i = 2; i < temp.length - 2; i++) {'
        + '        previousURL += temp[i] + "/";' + '\n'
        + '    }' + '\n'
        + '    var fileServerURL = ""' + '\n'
        + '                      + location.href.split(":")[0] + ":"' + '\n'
        + '                      + location.href.split(":")[1] + ":"' + '\n'
        + '                      + ' + Settings.Port.File + '+ "/"' + '\n'
        + '    var currentPath = "<div>Current path : workspace/"' + '\n'
        + '    for(var i = 3; i < temp.length - 1; i++) {' + '\n'
        + '        currentPath += temp[i] + "/";' + '\n'
        + '    }' + '\n'
        + '    currentPath += "</div>"' + '\n'
        + '    currentPath += "</div>"' + '\n'
        + '    var tableHTML = ""' + '\n'
        + '                  + "<table>"' + '\n'
        + '                  + "<tr>"' + '\n'
        + '                  + "<th>Filename</th><th>Type</th><th>Size</th><th>Last Modify</th>"' + '\n'
        + '                  + "</tr>"' + '\n';

    for (var i = 0; i < sortedList.length; i++) {
        html += '                  + "<tr>"' + '\n';
        if ((sortedList[i].filename === '..')
            && (sortedList[i].fullPath !== (Settings.Root + '/'))) {
            html += '                  + "<td class=\'folder\'>"' + '\n'
                + '                  + "'
                + '<a href=\'" + previousURL + '
                + '"' + sortedList[i].filename + '/\'>'
                + sortedList[i].filename + '</a></td>"' + '\n'
        }
        else if (sortedList[i].fileType === Settings.FILETYPE.FOLDER) {
            html += '                  + "<td class=\'folder\'>"' + '\n'
                + '                  + "'
                + '<a href=\'" + location.href + '
                + '"' + sortedList[i].filename + '/\'>'
                + sortedList[i].filename + '</a></td>"' + '\n'
        }
        else {
            html += '                  + "<td>"' + '\n'
                + '                  + "'
                + '<a href=\'" + fileServerURL + '
                + '"' + sortedList[i].filename + '\'>'
                + sortedList[i].filename + '</a></td>"' + '\n'
        }
        html += '                  + "</td>"' + '\n'
            + '                  + "<td>' + sortedList[i].fileType + '</td>"' + '\n';
        if (sortedList[i].fileType === Settings.FILETYPE.FOLDER) {
            html += '                  + "<td></td>"' + '\n'
        }
        else {
            html += '                  + "<td class=\'filesize\'>' + sortedList[i].size + '</td>"' + '\n'
        }
        html += '                  + "<td>' + sortedList[i].mtime + '</td>"' + '\n'
            + '                  + "</tr>"' + '\n';
    }
    html += '' + '\n'
        + '    tableHTML += "</table>";' + '\n'
        + '    document.getElementById("filelist").innerHTML = currentPath + "<br>" + tableHTML;' + '\n'
        + '}' + '\n'
        + '</script>' + '\n';

    return html;
}

module.exports = UIManager;