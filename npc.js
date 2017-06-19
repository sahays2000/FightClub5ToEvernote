var request = require('request');
var fs = require('fs');
var path = require('path');



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

var template = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE en-export SYSTEM "http://xml.evernote.com/pub/evernote-export2.dtd">
<en-export export-date="20170619T085751Z" application="Evernote/Windows" version="6.x">
<note><title>{0}</title><content><![CDATA[<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">

<en-note><div><b><span style="font-size: 21px;">Description</span></b></div><div><br/></div><table style="border-collapse: collapse; margin-left: 0px; table-layout: fixed;width:100%;"><tr><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>Age</div></td><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:49.91258741258741%;"><div>{1}</div></td></tr><tr><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>Gender</div></td><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>{2}</div></td></tr><tr><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>Race</div></td><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>{3}</div></td></tr><tr><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;">Occupation</td><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>{4}</div></td></tr></table><div>&nbsp;</div><div><span style="font-size: 21px;"><b>Appearance</b></span></div><div><br/></div><table style="-evernote-table:true;border-collapse:collapse;width:100%;table-layout:fixed;margin-left:0px;"><tr><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>Hair</div></td><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>{5}</div></td></tr><tr><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>Eyes</div></td><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>{6}</div></td></tr><tr><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>Skin</div></td><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>{7}</div></td></tr><tr><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>Height</div></td><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>{8}</div></td></tr><tr><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>Build</div></td><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>{9}</div></td></tr><tr><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>Face</div></td><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>{10}</div></td></tr></table><div>&nbsp;</div><div><span style="font-size: 21px;"><b>Abilities</b></span></div><div><br/></div><table style="-evernote-table:true;border-collapse:collapse;width:100%;table-layout:fixed;margin-left:0px;"><tr><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>Str</div></td><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>{11}</div></td></tr><tr><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>Dex</div></td><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>{12}</div></td></tr><tr><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>Con</div></td><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>{13}</div></td></tr><tr><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>Int</div></td><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>{14}</div></td></tr><tr><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>Wis</div></td><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>{15}</div></td></tr><tr><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>Cha</div></td><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>{16}</div></td></tr></table><div>&nbsp;</div></en-note>]]></content><created>20170619T085318Z</created><updated>20170619T085724Z</updated><tag>Npc</tag><tag>{2}</tag><tag>{3}</tag><note-attributes><author>codeiain@outlook.com</author><source>desktop.win</source><source-application>evernote.win32</source-application></note-attributes></note></en-export>
`;

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function get(batch, callback) {
    var _self = this;
    console.log('getting batch ' + batch);
    _self.count = 0;
    for (var x = 0; x < 100; x++) {
        getfiles((npc, error) => {

        console.log(npc);
        var h = JSON.parse(npc);
          var newNPC = {
              name: capitalizeFirstLetter(h.description.name),
              age: h.description.age,
              gender : capitalizeFirstLetter(h.description.gender),
              race: capitalizeFirstLetter(h.description.race),
              occupation: capitalizeFirstLetter(h.description.occupation),
              hair: capitalizeFirstLetter(h.physical.hair),
              eyes: capitalizeFirstLetter(h.physical.eyes),
              skin: capitalizeFirstLetter(h.physical.skin),
              height: h.physical.height,
              build: capitalizeFirstLetter(h.physical.build),
              face: capitalizeFirstLetter(h.physical.face),
              str: h.abilities.str,
              dex: h.abilities.dex,
              con: h.abilities.con,
              int: h.abilities.int,
              wis: h.abilities.wis,
              cha: h.abilities.cha
          }
          var currentFileName = newNPC.name.replace(' ', '_').replace('/', '_').replace("'", '') + '.enex';

          var fileContent = npcOutput(newNPC)

          fs.writeFile(path.resolve(__dirname, "npcs/" + currentFileName),fileContent , function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });

        });

    }

}

function npcOutput(newNPC){

    return template.format(newNPC.name, newNPC.age, newNPC.gender, newNPC.race, newNPC.occupation, newNPC.hair, newNPC.eyes, newNPC.skin, newNPC.height, newNPC.build, newNPC.face, newNPC.str, newNPC.dex, newNPC.con, newNPC.int, newNPC.wis, newNPC.cha);
}


function start(batch) {
    console.log('starting')
    get(batch, () => {
        batch++;
        if (batch == 1000) {
            process.exit();
        }
        console.log('waiting');
        var waitTill = new Date(new Date().getTime() + 10 * 1000);
        while (waitTill > new Date()) { }

        start(batch);
    });
}
process.stdin.resume();
start(0);

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
