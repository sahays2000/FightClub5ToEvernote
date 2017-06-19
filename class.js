var fs = require('fs');
var parseString = require('xml2js').parseString;
var path = require('path');

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

readFiles('xml/', function (filename, content) {
    parseString(content, function (err, results) {
        if (filename == '.DS_Store' || filename == '.gitkeep') {
            return;
        }

        var items = results.compendium;
        if (items != undefined) {
            if (items.class != undefined) {
                for (let x = 0; x < items.class.length; x++) {
                    var currentClass = cleanClass(items.class[x]);
                    var currentFileName = currentClass.name.replace(' ', '_').replace('/', '_') + '.enex';
                    fs.writeFile(path.resolve(__dirname, "classes/" + currentFileName), classOutputXml(currentClass), function (err) {
                        if (err) {
                            return console.log(err);
                        }
                    });
                }
            }
        }
    });
});

function CreateRow(name, value) {
    var row = "";
    if (value != "") {
        row = `<tr><td style="border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px;"><div><span style="font-style: normal; font-variant-caps: normal; font-weight: normal; line-height: normal;"><font style="font-size: 14px;" face="Helvetica Neue"><i>` + name + `</i></font></span></div></td><td style="border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px;"><div>` + value + `</div></td></tr>`
    }
    return row;
}

function cleanClass(classes) {
    var newClass = {
        name: classes.name[0],
        hd: (classes.hd != undefined ? classes.hd[0] : ""),
        proficiency: (classes.proficiency != undefined ? classes.proficiency[0] : ""),
        spellAbility: (classes.spellAbility != undefined ? CreateRow('Spell Casting Ability', classes.spellAbility[0]) : ""),
        details: [],
        spellsRows: "",
        spellTable: "",
        featureRows: "",
        featureTable: "",
        features: "",
        featuresTable: ""
    }

    for (let q = 1; q < 21; q++) {
        var details = {
            level: "",
            slots: [],
            features: []
        }
        details.level = getOrdinal(q);
        for (var y = 0; y < classes.autolevel.length; y++) {
            if (classes.autolevel[y].$.level == q) {
                if (classes.autolevel[y].slots != undefined) {
                    details.slots = classes.autolevel[y].slots;
                }
                if (classes.autolevel[y].feature != undefined) {
                    for (let i = 0; i < classes.autolevel[y].feature.length; i++) {
                        details.features.push(classes.autolevel[y].feature[i].name[0]);
                    }
                }
            }

        }
        newClass.details.push(details);
    }

    console.log(newClass.details[0].slots.length)
    if (newClass.details[0].slots.length != 0) {
        for (let x = 0; x < newClass.details.length; x++) {
            var spell = {
                level: newClass.details[x].level,
                slots: newClass.details[x].slots.toString().split(','),
                feature: newClass.details[x].features.join('<br/>')
            }
            newClass.spellsRows += createSpellRow(spell);
        }
        newClass.spellTable = createSpellTable(newClass.spellsRows);
    } else {
        for (let y = 0; y < newClass.details.length; y++) {
            //console.log(newClass.details[x]);
            var feature = {
                level: newClass.details[y].level,
                name: newClass.details[y].features.join('<br/>')
            }
            newClass.featureRows += createFeatureRow(feature);
        }
        newClass.featureTable = createFeatureTable(newClass.featureRows);
    }

    for (var ind = 0; ind < classes.autolevel.length; ind++) {

        if (classes.autolevel[ind].feature != undefined) {
            console.log(classes.autolevel[ind].feature.length);
            for (var idn = 0; idn < classes.autolevel[ind].feature.length; idn++) {
                console.log(classes.autolevel[ind].feature[idn].text.join('<br/>'));
                newClass.features += createFeatureRow1({ name: classes.autolevel[ind].feature[idn].name[0], text: classes.autolevel[ind].feature[idn].text.join('<br/>') });

            }

        }
    }
    newClass.featuresTable = createFeatureTable2(newClass.features);

    return newClass;
}

function getOrdinal(value) {
    if ((parseFloat(value) == parseInt(value, 10)) && !isNaN(value)) {
        var s = ["th", "st", "nd", "rd"],
            v = value % 100;
        return value + (s[(v - 20) % 10] || s[v] || s[0]);
    }
    return value;
}

function createSpellRow(spell) {
    var template = `<tr><td style="border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px;"><div><span style="font-size: 10px;">{0}</span></div></td><td style="border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px;"><div><span style="font-size: 10px;">{1}</span></div></td><td style="border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px;"><div><span style="font-size: 10px;">{2}</span></div></td><td style="border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px;"><div><span style="font-size: 10px;">{3}</span></div></td><td style="border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px;"><div><span style="font-size: 10px;">{4}</span></div></td><td style="border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px;"><div><span style="font-size: 10px;">{5}</span></div></td><td style="border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px;"><div><span style="font-size: 10px;">{6}</span></div></td><td style="border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px;"><div><span style="font-size: 10px;">{7}</span></div></td><td style="border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px;"><div><span style="font-size: 10px;">{8}</span></div></td><td style="border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px;"><div><span style="font-size: 10px;">{9}</span></div></td><td style="border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px;"><div><span style="font-size: 10px;">{10}</span></div></td><td style="border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px;"><div><span style="font-size: 10px;">{11}</span></div></td></tr>`;
    return template.format(spell.level, spell.feature, (spell.slots[0] != undefined ? spell.slots[0] : 0), (spell.slots[1] != undefined ? spell.slots[1] : 0), (spell.slots[2] != undefined ? spell.slots[2] : 0), (spell.slots[3] != undefined ? spell.slots[3] : 0), (spell.slots[4] != undefined ? spell.slots[4] : 0), (spell.slots[5] != undefined ? spell.slots[5] : 0), (spell.slots[6] != undefined ? spell.slots[6] : 0), (spell.slots[7] != undefined ? spell.slots[7] : 0), (spell.slots[8] != undefined ? spell.slots[8] : 0), (spell.slots[9] != undefined ? spell.slots[9] : 0));
}

function createSpellTable(spells) {
    var templare = `<table style="width: 100%; border: none; border-collapse: collapse; table-layout: fixed;"><tbody><tr><td style="width: 7.6923076923076925%; border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px; min-width: 7.6923076923076925%;"><div><span style="font-size: 10px;">Level</span></div></td><td style="width: 36.381802721088434%; border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px; min-width: 7.6923076923076925%;"><div><span style="font-size: 10px;">Features</span></div></td><td style="width: 8.244047619047619%; border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px; min-width: 5%;"><div><span style="font-size: 10px;">Cantrips</span></div></td><td style="width: 6.530612244897959%; border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px; min-width: 5%;"><div><span style="font-size: 10px;">1st</span></div></td><td style="width: 6.530612244897959%; border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px; min-width: 5%;"><div><span style="font-size: 10px;">2nd</span></div></td><td style="width: 5%; border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px; min-width: 5%;"><div><span style="font-size: 10px;">3rd</span></div></td><td style="width: 5%; border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px; min-width: 5%;"><div><span style="font-size: 10px;">4th</span></div></td><td style="width: 5%; border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px; min-width: 5%;"><div><span style="font-size: 10px;">5th</span></div></td><td style="width: 5%; border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px; min-width: 5%;"><div><span style="font-size: 10px;">6th</span></div></td><td style="width: 5%; border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px; min-width: 5%;"><div><span style="font-size: 10px;">7th</span></div></td><td style="width: 5%; border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px; min-width: 5%;"><div><span style="font-size: 10px;">8th</span></div></td><td style="width: 5%; border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px; min-width: 5%;"><div><span style="font-size: 10px;">9th</span></div></td></tr>{0}</tbody></table><div><br/></div>`;
    return templare.format(spells);
}

function createFeatureRow(feature) {
    var tempalte = `<tr><td style="border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px;"><div><span style="font-size: 10px;">{0}</span></div></td><td style="border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px;"><div><font style="font-size: 10px;">{1}</font></div></td></tr>`;
    return tempalte.format(feature.level, feature.name)
}

function createFeatureTable(features) {
    var template = `<table style="width: 100%; border: none; border-collapse: collapse; table-layout: fixed;"><tbody><tr><td style="width: 7.6923076923076925%; border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px; min-width: 7.6923076923076925%;"><div><span style="font-size: 10px;">Level</span></div></td><td style="width: 44.21768707482993%; border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px; min-width: 7.6923076923076925%;"><div><span style="font-size: 10px;">Features</span></div></td></tr>{0}</tbody></table>`;
    return template.format(features);
}

function createFeatureRow1(feature) {
    var tempalte = `<tr><td style="border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px;"><div><span style="font-size: 10px;">{0}</span></div></td><td style="border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px;"><div><font style="font-size: 10px;">{1}</font></div></td></tr>`;
    return tempalte.format(feature.name, feature.text)
}

function createFeatureTable2(features) {
    var template = `<table style="width: 100%; border: none; border-collapse: collapse; table-layout: fixed;"><tbody><tr><td style="width: 7.6923076923076925%; border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px; min-width: 7.6923076923076925%;"><div><span style="font-size: 10px;">Feature</span></div></td><td style="width: 44.21768707482993%; border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px; min-width: 7.6923076923076925%;"><div><span style="font-size: 10px;">Features</span></div></td></tr>{0}</tbody></table>`;
    return template.format(features);
}

function createHR() {
    return `<div><hr/><br/></div>`;
}

function classOutputXml(classes) {
    var templare = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE en-export SYSTEM "http://xml.evernote.com/pub/evernote-export3.dtd">
<en-export export-date="20170616T172159Z" application="Evernote" version="Evernote Mac 6.11.1 (455061)">
<note><title>{0}</title><content><![CDATA[<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">
<en-note><div><br/></div><table style="width: 100%; border: none; border-collapse: collapse; table-layout: fixed;"><tbody><tr><td style="width: 50%; border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px; min-width: 50%;"><div>Hit Dice</div></td><td style="width: 50%; border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px; min-width: 50%;"><div>D{1}</div></td></tr><tr><td style="border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px;"><div>Proficiencies</div></td><td style="border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px;"><div>{2}</div></td></tr>{3}</tbody></table><hr/><div><br/></div>{4}{5}{6}{7}</en-note>
]]></content><created>20170616T165458Z</created><updated>20170616T171809Z</updated><tag>Class</tag><tag>{0}</tag><note-attributes><latitude>55.95198918309221</latitude><longitude>-3.190116844932778</longitude><altitude>49.46121978759766</altitude><author>codeiain@outlook.com</author><source>desktop.mac</source><reminder-order>0</reminder-order></note-attributes></note>
</en-export>
`

    return templare.format(classes.name, classes.hd, classes.proficiency, classes.spellAbility, classes.spellTable, classes.featureTable, createHR(), classes.featuresTable);
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