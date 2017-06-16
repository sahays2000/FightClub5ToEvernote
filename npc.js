var request = require('request');
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


function getfiles(callback) {

    request.get('http://npcgenerator.azurewebsites.net/_/npc', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(body, null)
        } else {

            if (error) {
                console.log(error);
                callback(null, error)
            }
        }
    })


}


function get(batch, callback) {
    var _self = this;
    console.log('getting batch ' + batch);
    _self.count = 0;
    for (var x = 0; x < 100; x++) {
        getfiles((npc, error) => {

            var data = JSON.parse(npc);
            var n = data.description.name.split(' ');
            for (let x = 0; x < n.length; x++) {
                n[x] = n[x].replace(' ','');
                if (!contains(names, n[x])) {
                    names.push(n[x]);
                }
            }
            if (!contains(gender, data.description.gender)) {
                gender.push(data.description.gender);
            }
            if (!contains(race, data.description.race)) {
                race.push(data.description.race);
            }
            if (!contains(occupation, data.description.occupation)) {
                occupation.push(data.description.occupation);
            }

            var h = data.physical.hair.split(',');
            for (let x = 0; x < h.length; x++) {
                h[x] = h[x].replace(' ','');
                if (!contains(hair, h[x])) {
                    hair.push(h[x]);
                }
            }

            if (!contains(eyes, data.physical.eyes)) {
                eyes.push(data.physical.eyes);
            }

            if (!contains(skin, data.physical.skin)) {
                skin.push(data.physical.skin);
            }

            if (!contains(build, data.physical.build)) {
                build.push(data.physical.build);
            }

            var h = data.physical.face.split(',');
            for (let x = 0; x < h.length; x++) {
               h[x] = h[x].replace(' ','');
                if (!contains(face, h[x])) {
                    face.push(h[x]);
                }
            }

            if (!contains(orientation, data.relationship.orientation)) {
                orientation.push(data.relationship.orientation);
            }
            if (!contains(status, data.relationship.status)) {
                status.push(data.relationship.status);
            }

            var output = `names {0} \t gender {1} \t  race {2} \t occupation {3} \t  hair {4} \t eyes {5} \t skin {6} \t build {7} \t  face {8} orientation {9} \t  status {10}`

            console.log(output.format( names.length, gender.length, race.length, occupation.length, hair.length, eyes.length, skin.length, build.length, face.length, orientation.length, status.length));
            _self.count++;
            if (_self.count == 100){
                callback();
            }
        });

    }

}

function start(batch) {
    console.log('starting')
    get(batch, () => {
        console.log('waiting');
        var waitTill = new Date(new Date().getTime() + 10 * 1000);
        while (waitTill > new Date()) { }
        batch++;
        if (batch == 1000){
            process.exit();
        }
        start(batch);
    });
}
process.stdin.resume();
start(0);


function contains(a, obj) {
    var i = a.length;
    while (i--) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
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

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));