const dh = require("./discordHelper.js");

function init(client) {
	this.flex = new dh.Command("flex", (msg) => {
		let color = msg.splitContent[0];
		switch (color) {
			case "pale":
				color = "🏻";
				break;
			case "cream":
				color = "🏼";
				break;
			case "moderate":
				color = "🏽";
				break;
			case "dark":
				color = "🏾";
				break;
			case "black":
				color = "🏿";
				break;
			default: 
				color = "";
				break;
		}
		msg.channel.send("💪"+color+"👁️👅👁️💪"+color);
	}, "chat", "Flex on 'em! Usage: !flex <none;pale;cream;moderate;dark;black>");
	//Return
	return this;
}

module.exports = init;