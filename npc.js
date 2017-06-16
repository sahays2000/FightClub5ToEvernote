var request = require('request');
var fs = require('fs');
var path = require('path');

function getfiles(callback) {

    request.get('http://npcgenerator.azurewebsites.net/_/npc', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var csv = JSON.parse(body);
            console.log('got NPC');
            callback(csv, null)
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

            var filepath = path.resolve(__dirname, "npc/" + npc.description.name + ".json")
            if (fs.existsSync(filepath)) {
                filepath = path.resolve(__dirname, "npc/" + npc.description.name + "_" + Date.now() + ".json");
            }
            fs.writeFile(filepath, JSON.stringify(npc), function (err) {
                console.log('file created');
                if (err) {
                    return console.log(err);
                }
                _self.count++
                console.log(_self.count);
                if (_self.count == 99) {
                    callback();
                }
            });


        });

    }

}

function start(batch){
    console.log('starting')
    get(batch, () => {
        console.log('waiting');
        var waitTill = new Date(new Date().getTime() + 10 * 1000);
        while (waitTill > new Date()) { }
        batch++;
        start(batch);
    });
}
start(0);
