const dh = require("./discordHelper.js");
const cfg = require("./config.js");

function init(client) {
	this.flex = new dh.Command("flex", (msg) => {		
		msg.channel.send("💪👁️👅👁️💪");
	}, "chat", "Flex on 'em!");
	//Return
	return this;
}

module.exports = init;