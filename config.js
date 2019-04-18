/*------------------------------*/
/*HOW TO ADD NEW FIELDS
/* Add this line: cfg.<YOUR_KEY> = <DEFAULT_VALUE>
/* That's it.
/*------------------------------*/
//CONSTS
const SAVE_PATH = "./config.json"
//LIB
const fs = require("fs");
//CONFIG OBJECT
var cfg = {};
//LOAD EXISTING
var ld = {};
if (fs.existsSync(SAVE_PATH)) {
    let file = fs.readFileSync(SAVE_PATH, "utf8");
    if (file.length > 0) {
        try {
            ld = JSON.parse(file);
        } catch (err) {
            console.error("Config.js - Loading failed! - %o", err);
        }
    }

}
//Add function
/**
 * Sets and saves a part of config
 * @param {String} key the key to save/change
 * @param {*} value value for the key
 */
cfg.save = function (key, value) {
    if (key && value) {
        cfg[key] = value;
    }
    let toWrite = JSON.stringify(cfg);
    try {
        fs.writeFileSync(SAVE_PATH, toWrite, "utf8")
        console.info("Config.js - Save successful! Changed key '%s' to %o", key, value);
    } catch (err) {
        console.error("Config.js - Save failed! - %o", err);
    }
}
//KEYS
cfg.DISCORD_TOKEN = "NTY4NTA0MTE3OTkxOTY0NzMy.XLjDLQ.h6nqIGf94EdW3DejZWQ2MTV0VBs";
cfg.YOUTUBE_API_KEY = "AIzaSyDjpHuUZ2gA_ZWjAyDBtoQhWoecxeTpQ6c";
cfg.ADMINS = [];
cfg.PREFIX = "!";
cfg.PRESENCE = {
    status: "online",
    game: {
        name: "Kokot&Mamlas",
        type: "prstí si prdel"
    }
};
cfg.HELP_PREFIX = "";
cfg.INVITE_LINK = "No invite link specified!";

//Load variables from file
Object.keys(cfg).forEach((i) => {
    if (ld[i]) {
        cfg[i] = ld[i];
    }
});

cfg.save();

//CHECK IMPORTANT KEYS
if (!cfg.DISCORD_TOKEN) {
    throw new Error("Config.js - NO DISCORD TOKEN SPECIFIED!!");
}
if (!cfg.YOUTUBE_API_KEY) {
    throw new Error("Config.js - NO YOUTUBE API JWT KEY SPECIFIED!!");
}

console.log("---------------CONFIG---------------");
console.dir(cfg);
console.log("------------------------------------");

module.exports = cfg;