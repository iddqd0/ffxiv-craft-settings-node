const WebSocket = require('ws');
const MachinaFFXIV = require('node-machina-ffxiv');
const _ = require('lodash');

const wss = new WebSocket.Server({"port": 8181});
const Machina = new MachinaFFXIV({"port": 8182, "definitionsDir": __dirname + "/definitions"});

const crafters = {
    8: "Carpenter", // Carpenter / CPT
    9: "Blacksmith", // Blacksmith / BSM
    10: "Armorer", // Armorer / ARM
    11: "Goldsmith", // Goldsmith / GSM
    12: "Leatherworker", // Leatherworker // LTW
    13: "Weaver", // Weaver / WVR
    14: "Alchemist", // Alchemist / ALC
    15: "Culinarian", // Culinarian / CUL
};

/*const gatherers = [
    16, // Miner / MIN
    17, // Botanist / BTN
    18, // Fisher / FSH
];*/


let stats = {};
let statsBuffer = {
    className: "Unknown",
    specialist: false,
    level: 1,
    cp: 1,
    craftsmanship: 0,
    control: 0
};
let lastClass = null;

Machina.start(() => {
    console.log("Machina started!");
});

wss.on('connection', function connection(ws, req) {
    console.log(`Connection from ${req.socket.remoteAddress}`);
    ws.on('message', function (data) {
        if (data === 'UPDATE') {
            if (Object.keys(stats).length > 0) {
                wss.clients.forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(stats));
                    }
                });
            }
        }
    });
});

wss.on('error', function (ws, event) {
    console.error(event);
});

Machina.on('playerStats', (content) => {
    statsBuffer = {
        cp: content.cp,
        craftsmanship: content.craftsmanship,
        control: content.control,
        level: 1
    }
});

Machina.on('playerClassInfo', (content) => {
    if (content.classId && crafters.hasOwnProperty(content.classId) && (!lastClass || content.classId !== lastClass)) {
        stats[content.classId] = _.merge(statsBuffer, {
            className: crafters[content.classId],
            level: content.syncedLevel,
            specialist: content.isSpecialist
        });
        lastClass = content.classId;
    }
});