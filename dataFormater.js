var fs = require('fs');
var path = require('path');

var names = []
var gender = [];
var race = [];
var occupation = [];
var hair = [];
var eyes = [];
var skin = [];
var build = [];
var face = [];
var orientation = [];
var status = [];

function readFiles(dirname, onFileContent, onError) {
    fs.readdir(dirname, function (err, filenames) {
        FileCount = filenames.length;
        if (err) {
            onError(err);
            return;
        }
        filenames.forEach(function (filename) {
            fs.readFile(dirname + filename, 'utf-8', function (err, content) {
                if (err) {
                    onError(err);
                    return;
                }
                onFileContent(filename, content);
            });
        });
    });
}


readFiles('npc/', function (filename, content) {
    

});

function contains(a, obj) {
    var i = a.length;
    while (i--) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}
function exitHandler(options, err) {

    var data = {
        names: names,
        gender: gender,
        race: race,
        occupation: occupation,
        hair: hair,
        eyes: eyes,
        skin: skin,
        build: build,
        face: face,
        relationship: {
            orientation: orientation,
            status: status
        }
    }
    fs.writeFileSync(path.resolve(__dirname, "npc.json"), JSON.stringify(data));
}


if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));