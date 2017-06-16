const args = process.argv;
if (args < 4) process.exit();
dir = args[2];
file = args[3];

var fs = require('fs');
var parseString = require('xml2js').parseString;
var builder = require('xmlbuilder');
var path = require('path');
var fileAsJs = [];
var FileCount = 0;
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
let x = 0;
var testsuites = []
readFiles(dir + '/', function (filename, content) {
    parseString(content, function (err, results) {
        if (filename == '.DS_Store' || filename == '.gitkeep') {
            return;
        }

        var items = results.compendium;
        if (items.spell != undefined) {
            for (x = 0; x < items.spell.length; x++) {
                var current = items.spell[x];
                var formated = ParseSpell(current);
                var currentFileName = current.name[0].replace(' ', '_').replace('/', '_').replace("'", '') + '.enex';
                //console.log(formated.name);
                fs.writeFile(path.resolve(__dirname, "spells/" + currentFileName), spellOutputXML(formated), function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            }

        }
        if (items.item != undefined) {
            for (let x = 0; x < items.item.length; x++) {
                var current = items.item[x];
                var currentFileName = current.name[0].replace(' ', '_').replace('/', '_') + '.enex';
                var formated = ParseItems(current);
                //console.log(formated.name);
                fs.writeFile(path.resolve(__dirname, "items/" + currentFileName), itemOutputXML(formated), function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            }
        }
        if (items.monster != undefined) {
            for (let x = 0; x < items.monster.length; x++) {
                var current = items.monster[x];
                var currentFileName = current.name[0].replace(' ', '_').replace('/', '_') + '.enex';
                var formated = ParseMonster(current);
                //console.log(formated.name);
                fs.writeFile(path.resolve(__dirname, "monster/" + currentFileName), monsterOutputXML(formated), function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            }
        }
        if (items.background != undefined) {
            for (let x = 0; x < items.background.length; x++) {
                var current = items.background[x];
                var currentFileName = current.name[0].replace(' ', '_').replace('/', '_') + '.enex';
                var formated = ParseBackground(current);
                //console.log(formated.name);
                fs.writeFile(path.resolve(__dirname, "background/" + currentFileName), backgroundOutputXML(formated), function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            }
        }
        if (items.feat != undefined) {
            for (let x = 0; x < items.feat.length; x++) {
                var current = items.feat[x];
                var currentFileName = current.name[0].replace(' ', '_').replace('/', '_') + '.enex';
                var formated = ParesFeat(current);
                //console.log(formated.name);
                fs.writeFile(path.resolve(__dirname, "feat/" + currentFileName), featOutputXML(formated), function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            }
        }
        if (items.race != undefined) {
            for (let x = 0; x < items.race.length; x++) {
                var current = items.race[x];
                var currentFileName = current.name[0].replace(' ', '_').replace('/', '_') + '.enex';
                var formated = ParesRace(current);
                //console.log(formated.name);
                fs.writeFile(path.resolve(__dirname, "race/" + currentFileName), raceOutputXML(formated), function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            }
        }
    });

})

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

function ParesRace(race) {
    var newRace = {
        name: race.name[0],
        size: (race.size != undefined ? getSize(race.size[0]) : ""),
        speed: (race.speed != undefined ? race.speed[0] : ""),
        ability: (race.ability != undefined ? race.ability[0] : ""),
        trait: ""
    };

    if (race.trait) {
        for (var x = 0; x < race.trait.length; x++) {
            newRace.trait += CreateRow(race.trait[x].name, race.trait[x].text);
        }
    }
    return newRace;
}

function ParesFeat(feat) {
    text = feat.text.join('<br/>');
    var newFeat = {
        name: feat.name[0],
        body: text
    }
    return newFeat;
}

function ParseBackground(back) {
    var newBackground = {
        name: back.name[0],
        proficiency: (back.proficiency != undefined ? back.proficiency[0] : ""),
        trait: ""
    }
    if (back.trait) {
        for (var x = 0; x < back.trait.length; x++) {
            newBackground.trait += CreateRow(back.trait[x].name, back.trait[x].text);
        }
    }
    return newBackground;
}

function ParseSpell(spell) {

    var newSpell = {
        name: spell.name[0],
        level: (spell.level != undefined ? '<b>Level:</b> ' + spell.level[0] : ""),
        school: (spell.school != undefined ? '<b>School:</b> ' + getSchools(spell.school[0]) : ""),
        ritual: (spell.ritual != undefined ? '<i>' + isRitual(spell.ritual[0]) + '</i>' : ""),
        time: (spell.time != undefined ? '<b>Casting Time:</b> ' + spell.time[0] : ""),
        range: (spell.range != undefined ? '<b>Range:</b> ' + spell.range[0] : ""),
        components: (spell.compendium != undefined ? '<b>Components:</b>' + spell.components[0] : ""),
        duration: (spell.duration != undefined ? '<b>Duration:</b>' + spell.duration[0] : ""),
        text: (spell.text != undefined ? spell.text.join('<br/>') : ""),
        roll: (spell.roll != undefined ? '<b>Role:</b> ' + spell.roll[0] : ""),
        classes: (spell.classes != undefined ? '<b>Classes:</b> ' + spell.classes[0] : "")
    }
    return newSpell;
}

function ParseMonster(monster) {
    var newMonster = {
        name: monster.name[0],
        size: (monster.size != undefined ? getSize(monster.size[0]) : ""),
        type: (monster.type != undefined ? monster.type[0] : ""),
        alignment: (monster.alignment != undefined ? monster.alignment[0] : ""),
        ac: (monster.ac != undefined ? monster.ac[0] : ""),
        hp: (monster.hp != undefined ? monster.hp[0] : ""),
        speed: (monster.speed != undefined ? monster.speed[0] : ""),
        str: (monster.str != undefined ? monster.str[0] : ""),
        dex: (monster.dex != undefined ? monster.dex[0] : ""),
        con: (monster.con != undefined ? monster.con[0] : ""),
        int: (monster.int != undefined ? monster.int[0] : ""),
        wis: (monster.wis != undefined ? monster.wis[0] : ""),
        cha: (monster.cha != undefined ? monster.cha[0] : ""),
        cr: (monster.cr != undefined ? monster.cr[0] : ""),
        details: "",
        spells: "",
        trait: "",
        action: "",
        legendary: "",
        reaction: ""
    }

    newMonster.details += (monster.save != undefined ? CreateRow('Saving Throws', monster.save[0]) : "");
    newMonster.details += (monster.skill != undefined ? CreateRow('Skills', monster.skill[0]) : "");
    newMonster.details += (monster.vulnerable != undefined ? CreateRow('Damage vulnerabilities', monster.vulnerable[0]) : "");
    newMonster.details += (monster.resist != undefined ? CreateRow('Damage resistances', monster.resist[0]) : "");
    newMonster.details += (monster.immune != undefined ? CreateRow('Damage immunities', monster.immune[0]) : "");
    newMonster.details += (monster.conditionImmune != undefined ? CreateRow('Conditional immunities', monster.conditionImmune[0]) : "");
    newMonster.details += (monster.senses != undefined ? CreateRow('Senses', monster.senses[0]) : "");
    newMonster.details += (monster.passive != undefined ? CreateRow('Passive Perception', monster.passive[0]) : "");
    newMonster.details += (monster.languages != undefined ? CreateRow('Languages', monster.languages[0]) : "");
    newMonster.details += (monster.cr != undefined ? CreateRow('CR', monster.cr[0]) : "");

    if (monster.trait != undefined) {
        for (var x = 0; x < monster.trait.length; x++) {
            newMonster.trait += CreateRow(monster.trait[x].name, monster.trait[x].text);
        }
    }
    if (monster.action != undefined) {
        for (var x = 0; x < monster.action.length; x++) {
            newMonster.action += CreateRow(monster.action[x].name, monster.action[x].text.join('<br/>'));
        }
    }
    if (monster.spells != undefined) {
        var spellTemplate = `<table style="width: 100%; border: none; border-collapse: collapse; table-layout: fixed;"><tbody>{0}</tbody></table>`

        newMonster.spells = spellTemplate.format(CreateRow('Spells', monster.spells[0].replace(/,/g, '<br/>')));
    }

    if (monster.legendary != undefined) {
        var legendaryTemplate = `<table style="width: 100%; border: none; border-collapse: collapse; table-layout: fixed;"><tbody><tr><td style="width: 26.40449438202247%; border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px; min-width: 50%;"><b>Legendary Actions</b></td><td style="width: 73.47066167290886%; border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px; min-width: 50%;"><div><br/></div></td></tr>{0}</tbody></table>`;
        var Actions = ""
        for (var x = 0; x < monster.legendary.length; x++) {
            Actions += CreateRow(monster.legendary[x].name, monster.legendary[x].text.join('<br/>'));
        }
        newMonster.legendary = legendaryTemplate.format(Actions);
    }


    if (monster.reaction != undefined) {
        var reactionTemplate = `<table style="width: 100%; border: none; border-collapse: collapse; table-layout: fixed;"><tbody><tr><td style="width: 26.40449438202247%; border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px; min-width: 50%;"><b>Reaction</b></td><td style="width: 73.47066167290886%; border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px; min-width: 50%;"><div><br/></div></td></tr>{0}</tbody></table>`;
        var reaction = ""
        for (var x = 0; x < monster.reaction.length; x++) {
            reaction += CreateRow(monster.reaction[x].name, monster.reaction[x].text.join('<br/>'));
        }
        newMonster.reaction = reactionTemplate.format(reaction);
    }

    return newMonster;
}

function CreateRow(name, value) {
    var row = "";
    if (value != "") {
        row = `<tr><td style="border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px;"><div><span style="font-style: normal; font-variant-caps: normal; font-weight: normal; line-height: normal;"><font style="font-size: 14px;" face="Helvetica Neue"><i>` + name + `</i></font></span></div></td><td style="border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px;"><div>` + value + `</div></td></tr>`
    }
    return row;
}

function createHR() {
    return `<div><hr/><br/></div>`;
}

function getSize(size) {
    let typeString = ""
    switch (size) {
        case 'T':
            typeString = 'Tiny'
            break;
        case 'S':
            typeString = 'Small'
            break;
        case 'M':
            typeString = 'Medium'
            break;
        case 'L':
            typeString = 'Large'
            break;
        case 'H':
            typeString = 'Huge'
            break;
        case 'G':
            typeString = 'Gargantuan'
            break;
    }
    return typeString;
}

function ParseItems(item) {

    var newItem = {
        name: item.name[0], //0
        type: (item.type != undefined ? '<i>' + getItemType(item.type[0]) + '</i>' : ""), //1
        details: (item.details != undefined ? '<b>Details: </b>' + item.details.join("<br/>") : ""), //2
        magic: (item.magic != undefined ? isMagical(item.magic[0]) + "<br/>" : ""), //3
        weight: (item.weight != undefined ? '<b>Weight: </b>' + item.weight[0] : ""), //4
        text: item.text.join('<br/>'), //5
        ac: (item.ac != undefined ? '<b>Armor Class: </b>' + item.ac[0] + "<br/>" : ""), //6
        strength: (item.strength != undefined ? '<b>Requires strenght of </b>' + item.strength[0] + "<br/>" : ""),//7
        stealth: (item.stealth != undefined ? disadvantageOnStealth(item.stealth[0]) + "<br/>" : ""),//8
        dmg1: (item.dmg1 != undefined ? '<b>One-handed weapon damage: </b>' + item.dmg1[0] + "<br/>" : ""),//9
        dmg2: (item.dmg2 != undefined ? '<b>Two-handed weapon damage: </b>' + item.dmg2[0] + "<br/>" : ""),//10
        dmgType: (item.dmgType != undefined ? '<b>Damage Type: </b>' + damageType(item.dmgType[0]) + "<br/>" : ""),//11
        property: (item.property != undefined ? '<b>Properties: </b>' + itemProps(item.property) : ""),//12
        range: (item.range != undefined ? '<b>Range: </b>' + item.range[0] + "<br/>" : ""),//13
        rarity: (item.rarity != undefined ? '<b>Rarity</b>: ' + item.rarity[0] : ""),//14
        value: (item.value != undefined ? '<b>Value</b>: ' + item.value[0] : "")//15
    }
    return newItem;
}

function itemProps(item) {
    let typeString = []
    var props = item[0].split(',');
    for (let x = 0; x < props.length; x++) {
        switch (props[x].replace(' ', '')) {
            case 'A':
                typeString.push('Ammunition')
                break;
            case 'F':
                typeString.push('Finesse')
                break;
            case 'H':
                typeString.push('Heavy')
                break;
            case 'L':
                typeString.push('Light')
                break;
            case 'LD':
                typeString.push('Loading')
                break;
            case 'R':
                typeString.push('Reach')
                break;
            case 'S':
                typeString.push('Special')
                break;
            case 'T':
                typeString.push('Thrown')
                break;
            case '2H':
                typeString.push('Two-handed')
                break;
            case 'V':
                typeString.push('Versatile')
                break;

        }
    }
    return typeString.join(', ');
}

function damageType(item) {
    let typeString = "";
    switch (item) {
        case 'B':
            typeString = 'Bludgeoning'
            break;
        case 'P':
            typeString = 'Piercing'
            break;
        case 'S':
            typeString = 'Slashing'
            break;
    }
    return typeString;
}

function isMagical(item) {
    if (item == 1) {
        return "Magical item";
    }
    return "";
}

function disadvantageOnStealth(item) {
    if (item == "YES") {
        return "Disadvantage on Stealth checks";
    }
    return "";
}

function isRitual(ritual) {
    if (ritual == "YES") {
        return "ritual"
    }
    return "";
}

function getSchools(type) {
    let typeString = "";
    switch (type) {
        case 'A':
            typeString = 'Abjuration'
            break;
        case 'C':
            typeString = 'Conjuration'
            break;
        case 'D':
            typeString = 'Divination'
            break;
        case 'EN':
            typeString = 'Enchantment'
            break;
        case 'EV':
            typeString = 'Evocation'
            break;
        case 'I':
            typeString = 'Illusion'
            break;
        case 'N':
            typeString = 'Necromancy'
            break;
        case 'T':
            typeString = 'Transmutation'
            break;
    }
    return typeString;
}

function getItemType(type) {
    let typeString = "";
    switch (type) {
        case 'LA':
            typeString = 'Light armor'
            break;
        case 'MA':
            typeString = 'Medium armor'
            break;
        case 'HA':
            typeString = 'Heavy armor'
            break;
        case 'S':
            typeString = 'Shield'
            break;
        case 'M':
            typeString = 'Melee weapon'
            break;
        case 'R':
            typeString = 'Ranged weapon'
            break;
        case 'A':
            typeString = 'Ammunition'
            break;
        case 'RD':
            typeString = 'Rod'
            break;
        case 'ST':
            typeString = 'Staff'
            break;
        case 'WD':
            typeString = 'Wand'
            break;
        case 'RG':
            typeString = 'Ring'
            break;
        case 'P':
            typeString = 'Potion'
            break;
        case 'SC':
            typeString = 'Scroll'
            break;
        case 'W':
            typeString = 'Wondrous item'
            break;
        case 'G':
            typeString = 'Adventuring gear'
            break;
        case '$':
            typeString = 'Money'
            break;
    }
    return typeString;
}


function spellOutputXML(item) {
    var templare = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE en-export SYSTEM "http://xml.evernote.com/pub/evernote-export3.dtd">
<en-export export-date="20170615T112953Z" application="Evernote" version="Evernote Mac 6.11.1 (455061)">
<note><title>{0}</title><content><![CDATA[<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">
<en-note><div>{1}</div><div>{2}</div><div>{3}</div><div>{4}</div><div><b>Components</b>: {5}</div><div>{6}</div><div>{7}</div><div><hr/></div><div><b>Description</b>:</div><div>{8}</div><div>{9}<div>{10}</div></div><div><br/></div><div><br/></div></en-note>
]]></content><created>20170615T073616Z</created><updated>20170615T112931Z</updated><tag>Spell</tag>{11}<note-attributes><author>codeiain@outlook.com</author><source>desktop.mac</source><reminder-order>0</reminder-order></note-attributes></note>
</en-export>`
    var tags = "";
    var classes = item.classes.replace('<b>Classes:</b> ', '').split(',')
    for (var x = 0; x < classes.length; x++) {
        tags += '<tag>' + classes[x].replace(' ', '') + '</tag>'
    }

    var school = item.school.replace('<b>School:</b> ', '');
    if (school != "") {
        school = school.replace('(', ' ');
        school = school.replace(')', '');
        tags += '<tag>' + school + '</tag>';
    }

    return templare.format(item.name, item.level, item.school, item.ritual, item.time, item.range, item.components, item.duration, item.classes, item.text, item.roll, tags);
}

function itemOutputXML(item) {
    var templare = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE en-export SYSTEM "http://xml.evernote.com/pub/evernote-export2.dtd">
<en-export export-date="20170615T142538Z" application="Evernote/Windows" version="6.x">
<note><title>{0}</title><content><![CDATA[<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">

<en-note><div>{1} <i>{2}</i></div><div>{3}{6}{7}{8}{9}{10}{11}{13}</div><div> {12}</div><div><br/></div><div>{5}</div><div><br/></div><div>{4}</div><div>{15}</div></en-note>]]></content><created>20170615T134747Z</created><updated>20170615T142525Z</updated><tag>Item</tag>{16}<note-attributes><author>codeiain@outlook.com</author><source>desktop.win</source><source-application>evernote.win32</source-application></note-attributes></note></en-export>
`;

    tags = "";
    if (item.rarity != "") {
        tags = "<tag>" + item.rarity[0] + "</tag>"
    }
    if (item.type != "") {
        tags += "<tag>" + item.type + "</tag>"
    }

    return templare.format(item.name, item.type, item.details, item.magic, item.weight, item.text, item.ac, item.strength, item.stealth, item.dmg1, item.dmg2, item.dmgType, item.property, item.range, item.rarity, item.value, tags);

}


function monsterOutputXML(monster) {
    var templare = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE en-export SYSTEM "http://xml.evernote.com/pub/evernote-export3.dtd">
<en-export export-date="20170615T163532Z" application="Evernote" version="Evernote Mac 6.11.1 (455061)">
<note><title>{0}</title><content><![CDATA[<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">
<en-note><div><i>{2} {1} {3}</i></div><div><i><br/></i></div><table style="width: 100%; border: none; border-collapse: collapse; table-layout: fixed;"><tbody><tr><td style="width: 15.543071161048688%; border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px; min-width: 50%;"><div>Amor Class</div></td><td style="width: 84.33208489388264%; border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px; min-width: 50%;"><div>{4}</div></td></tr><tr><td style="border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px;"><div>Hit Points</div></td><td style="border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px;"><div>{5}</div></td></tr><tr><td style="border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px;">Speed</td><td style="border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px;"><div>{6}</div></td></tr></tbody></table><div><hr/><br/></div><table style="width: 100%; border: none; border-collapse: collapse; table-layout: fixed;"><tbody><tr><td style="width: 16.666666666666668%; border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px; min-width: 16.666666666666668%;"><div>STR</div></td><td style="width: 16.666666666666668%; border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px; min-width: 16.666666666666668%;"><div>DEX</div></td><td style="width: 16.666666666666668%; border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px; min-width: 16.666666666666668%;"><div>CON</div></td><td style="width: 16.666666666666668%; border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px; min-width: 16.666666666666668%;"><div>INT</div></td><td style="width: 16.666666666666668%; border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px; min-width: 16.666666666666668%;"><div>WIS</div></td><td style="width: 16.666666666666668%; border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px; min-width: 16.666666666666668%;"><div>CHA</div></td></tr><tr><td style="border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px;"><div>{7}</div></td><td style="border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px;"><div>{8}</div></td><td style="border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px;"><div>{9}</div></td><td style="border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px;"><div>{10}</div></td><td style="border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px;"><div>{11}</div></td><td style="border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px;"><div>{12}</div></td></tr></tbody></table><div><hr/></div><div><br/></div><div/><table style="width: 100%; border: none; border-collapse: collapse; table-layout: fixed;"><tbody>{13}</tbody></table>{14}<table style="width: 100%; border: none; border-collapse: collapse; table-layout: fixed;"><tbody>{15}</tbody></table>{16}<table style="width: 100%; border: none; border-collapse: collapse; table-layout: fixed;"><tbody><tr><td style="width: 50%; border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px; min-width: 50%;"><div><b>Actions</b></div></td><td style="width: 50%; border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px; min-width: 50%;"><div><br/></div></td></tr>{17}</tbody></table><div>{18}{19}{20}{21}{22}<br/></div></en-note>
]]></content><created>20170615T154351Z</created><updated>20170615T163456Z</updated><tag>Monster</tag><tag>{23}</tag><tag>{24}</tag><note-attributes><latitude>55.97468375802527</latitude><longitude>-3.169147832769942</longitude><altitude>11.30382442474365</altitude><author>codeiain@outlook.com</author><source>desktop.mac</source><reminder-order>0</reminder-order></note-attributes></note>
</en-export>
`

    return templare.format(monster.name, monster.size, monster.type, monster.alignment, monster.ac, monster.hp
        , monster.speed, monster.str, monster.dex, monster.con, monster.int, monster.wis, monster.cha, monster.details, createHR(), monster.trait, createHR(), monster.action, createHR(), monster.spells, createHR(), monster.legendary, monster.reaction, "CR-" + monster.cr, cleanMonsterTag(monster.type));
}

function cleanMonsterTag(tag) {
    tag = tag.replace(', monster manual', '');
    tag = tag.replace(", Volo's Guide", '');
    tag = tag.replace(", Volo's Guide", "");
    tag = tag.replace(',tome of Beasts', '');
    tag = tag.replace(', elemental evil', '');
    tag = tag.replace(', tyranny of dragons', '');
    tag = tag.replace(', out of the abyss', '');
    tag = tag.replace(", Volo's Guide, Volo's Guide", '');
    tag = tag.replace(', curse of strahd', '');
    tag = tag.replace(', lost mine of phandelver', '');
    tag = tag.replace(', storm kings thunder', '');
    console.log(tag);
    return tag.toLowerCase();
}




function backgroundOutputXML(back) {
    var templare = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE en-export SYSTEM "http://xml.evernote.com/pub/evernote-export3.dtd">
<en-export export-date="20170616T071655Z" application="Evernote" version="Evernote Mac 6.11.1 (455061)">
<note><title>{0}</title><content><![CDATA[<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">
<en-note><div><br/></div><table style="width: 100%; border: none; border-collapse: collapse; table-layout: fixed;"><tbody><tr><td style="width: 50%; border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px; min-width: 50%;"><div><i>Proficiency</i></div></td><td style="width: 50%; border: 1px solid rgb(219, 219, 219); padding: 10px; margin: 0px; min-width: 50%;"><div>{1}</div></td></tr>{2}</tbody></table><div><br/></div></en-note>
]]></content><created>20170616T071424Z</created><updated>20170616T071516Z</updated><tag>Background</tag><tag>{0}</tag><note-attributes><author>codeiain@outlook.com</author><source>desktop.mac</source><reminder-order>0</reminder-order></note-attributes></note>
</en-export>
`

    return templare.format(back.name, back.proficiency, back.trait);
}

function featOutputXML(feat) {
    var templare = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE en-export SYSTEM "http://xml.evernote.com/pub/evernote-export3.dtd">
<en-export export-date="20170616T072527Z" application="Evernote" version="Evernote Mac 6.11.1 (455061)">
<note><title>{0}</title><content><![CDATA[<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">
<en-note><div>{1}</div></en-note>
]]></content><created>20170616T071424Z</created><updated>20170616T072510Z</updated><tag>Feat</tag><tag>{0}</tag><note-attributes><author>codeiain@outlook.com</author><source>desktop.mac</source><reminder-order>0</reminder-order></note-attributes></note>
</en-export>`

    return templare.format(feat.name, feat.body);
}


function raceOutputXML(race) {
    var templare = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE en-export SYSTEM "http://xml.evernote.com/pub/evernote-export2.dtd">
<en-export export-date="20170616T092258Z" application="Evernote/Windows" version="6.x">
<note><title>{0}</title><content><![CDATA[<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">
<en-note><div><br/></div><table style="-evernote-table:true;border-collapse:collapse;table-layout:fixed;margin-left:0px;width:100%;"><tr><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>Size</div></td><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:49.91258741258741%;"><div>{1}</div></td></tr><tr><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>Speed</div></td><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>{2}</div></td></tr><tr><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>Ability Modifiers&nbsp;</div></td><td style="border-style:solid;border-width:1px;border-color:rgb(211,211,211);padding:10px;margin:0px;width:50%;"><div>{3}</div></td></tr>{4}</table><div><br/></div></en-note>]]></content><created>20170616T085603Z</created><updated>20170616T092233Z</updated><tag>Race</tag><tag>{0}</tag><note-attributes><author>codeiain@outlook.com</author><source>desktop.win</source><source-application>evernote.win32</source-application></note-attributes></note></en-export>
`

    return templare.format(race.name, race.size, race.speed, race.ability, race.trait);
}