/**
* @author ProCoderMew
* @warn Do not edit code or edit credits
*/

module.exports.config = {
    name: "antiout",
    version: "1.1.2",
    hasPermssion: 1,
    credits: "ProCoderMew",
    description: "Tự động add lại thành viên out chùa | Không chắc chắn là add lại được tất cả.",
    commandCategory: "Box chat",
    usages: "",
    cooldowns: 5,
    dependencies: {
        "path": "",
        "fs-extra": ""
    }
};
module.exports.languages = {
  "vi": {},
  "en": {}
};
module.exports.onLoad = function() {
    const { writeFileSync, existsSync } = global.nodemodule["fs-extra"];
    const { resolve } = global.nodemodule["path"];
    const log = require(process.cwd() + '/utils/log');
    const path = resolve(__dirname, 'cache', 'meewmeew.json');
    if (!existsSync(path)) {
        const obj = {
            antiout: {}
        };
        writeFileSync(path, JSON.stringify(obj, null, 4));
    } else {
        const data = require(path);
        if (!data.hasOwnProperty('antiout')) data.antiout = {};
        writeFileSync(path, JSON.stringify(data, null, 4));
    }
}

module.exports.run = async function({ api, event }) {
    const { writeFileSync } = global.nodemodule["fs-extra"];
    const { resolve } = global.nodemodule["path"];
    const path = resolve(__dirname, 'cache', 'meewmeew.json');
    const { threadID, messageID } = event;
    const database = require(path);
    const { antiout } = database;
    if (antiout[threadID] == true) {
        antiout[threadID] = false;
        api.sendMessage("Đã tắt chế độ chống out chùa.", threadID, messageID);
    } else {
        antiout[threadID] = true;
        api.sendMessage("⊰᯽⊱─🇦 🇳 🇹 🇮 🇴 🇺 🇹 ─⊰᯽⊱\n\nĐã bật chế độ chống out chùa khi không có sự cho phép của quản trị viên\n--Tự động add lại thành viên out chùa -- Không chắc chắn là add lại được tất cả.", threadID, messageID);
    }
    writeFileSync(path, JSON.stringify(database, null, 4));
           }
